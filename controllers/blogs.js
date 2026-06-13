const router = require("express").Router()
const { application } = require("express")
const { Blog, User, Session } = require("../models")
const jwt = require("jsonwebtoken")
const { SECRET } = require("../util/config")
const { Op } = require("sequelize")

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({ error: error.message })
  }
  return res.status(500).json({ error: error.message })

  next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization")
  if (authorization) {
    if (authorization.toLowerCase().startsWith("bearer ")) {
      try {
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      } catch {
        return res.status(401).json({ error: "invalid token" })
      }
    }
  } else {
    return res.status(401).json({ error: "missing token" })
  }
  next()
}

const validSession = async (req, res, next) => {
  const session = await Session.findOne({
    where: { userId: req.decodedToken.id },
  })

  if (!session) {
    return res.status(401).json({ error: "session expired" })
  }

  const user = await User.findByPk(req.decodedToken.id)
  if (user.disabled) {
    return res.status(401).json({ error: "user disabled" })
  }
}

router.get("/", async (req, res) => {
  try {
    const where = {}
    if (req.query.search) {
      where[Op.or] = [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
      ]
    }
    const blogs = await Blog.findAll({
      attributes: { exclude: ["userId"] },
      include: {
        model: User,
        attributes: ["name", "username"],
      },
      where,
      order: [["likes", "DESC"]],
    })
    console.log(blogs)
    res.json(blogs)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.post("/", tokenExtractor, validSession, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.delete(
  "/:id",
  blogFinder,
  tokenExtractor,
  validSession,
  async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    if (req.blog) {
      if (user.id === req.blog.userId) {
        await req.blog.destroy()
        console.log("blog deleted")
        res.status(204).end()
      } else {
        return res.status(401).json({ error: "token invalid" })
      }
    }
  },
)

router.put("/:id", blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    console.log("like added!")
    res.json(req.blog)
  } catch (error) {
    next(error)
  }
})

router.use(errorHandler)

module.exports = router

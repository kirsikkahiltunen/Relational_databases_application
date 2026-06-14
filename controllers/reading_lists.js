const router = require("express").Router()
const { User, Blog, ReadingList, Session } = require("../models")
const { sequelize } = require("../util/db")
const jwt = require("jsonwebtoken")
const { SECRET } = require("../util/config")

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization")
  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "invalid token" })
  }
  const token = authorization.substring(7)
  req.token = token
  next()
}

const validSession = async (req, res, next) => {
  const session = await Session.findOne({
    where: { token: req.token },
  })

  if (!session) {
    return res.status(401).json({ error: "session expired" })
  }

  const user = await User.findByPk(session.userId)
  if (user.disabled) {
    return res.status(401).json({ error: "user disabled" })
  }
  req.session = session
  req.user = user
  next()
}

router.post("/", async (req, res) => {
  if (!req.body.userId) {
    return res.status(400).json({ error: "missing userId" })
  }
  if (!req.body.blogId) {
    return res.status(400).json({ error: "missing blogId" })
  }
  const user = await User.findByPk(req.body.userId)
  const blog = await Blog.findByPk(req.body.blogId)
  if (!user) {
    return res.status(404).json({ error: "user not found" })
  }
  if (!blog) {
    return res.status(404).json({ error: "blog not found" })
  }
  const duplicate = await ReadingList.findOne({
    where: { userId: req.body.userId, blogId: req.body.blogId },
  })
  if (duplicate) {
    return res.status(400).json({ error: "blog already in reading list" })
  }

  const reading_list = await ReadingList.create({
    blogId: req.body.blogId,
    userId: req.body.userId,
  })
  return res.status(201).json({
    id: reading_list.id,
    blog_id: reading_list.blogId,
    user_id: reading_list.userId,
    read: reading_list.read,
  })
})

router.put("/:id", tokenExtractor, validSession, async (req, res) => {
  const reading_list = await ReadingList.findByPk(req.params.id)
  if (!reading_list) {
    return res.status(404).json({ error: "not found" })
  }
  if (req.user.id === reading_list.userId) {
    reading_list.read = req.body.read
    await reading_list.save()
    res.json(reading_list)
  } else {
    return res.status(401).json({ error: "invalid id" })
  }
})

module.exports = router

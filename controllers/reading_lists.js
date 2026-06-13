const router = require("express").Router()
const { ReadingList, User, Blog } = require("../models")
const { sequelize } = require("../util/db")
const jwt = require("jsonwebtoken")
const { SECRET } = require("../util/config")

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

router.post("/", async (req, res) => {
  const user = await User.findByPk(req.body.userId)
  const blog = await Blog.findByPk(req.body.blogId)
  try {
    if (user && blog) {
      const reading_list = await ReadingList.create({
        blogId: req.body.blogId,
        userId: req.body.userId,
      })
      res.json(reading_list)
    } else {
      res.status(400).json({ error: "invalid userId or blogId" })
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.put("/:id", tokenExtractor, async (req, res) => {
  const reading_list = await ReadingList.findOne({
    where: { id: req.params.id },
  })
  const user = await User.findByPk(req.decodedToken.id)
  if (user.id === reading_list.userId) {
    reading_list.read = req.body.read
    await reading_list.save()
    res.json(reading_list)
  } else {
    return res.status(401).json({ error: "invalid id" })
  }
})

module.exports = router

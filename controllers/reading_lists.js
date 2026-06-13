const router = require("express").Router()
const { ReadingList, User, Blog } = require("../models")
const { sequelize } = require("../util/db")

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

module.exports = router

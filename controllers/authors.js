const router = require("express").Router()
const { User, Blog } = require("../models")
const { sequelize } = require("../util/db")

router.get("/", async (req, res) => {
  const author = await Blog.findAll({
    group: "author",
    attributes: [
      "author",
      [sequelize.fn("COUNT", sequelize.col("id")), "blogs"],
      [sequelize.fn("SUM", sequelize.col("likes")), "likes"],
    ],
    order: [["likes", "DESC"]],
  })
  res.json(author)
})

module.exports = router

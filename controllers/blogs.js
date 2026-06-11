const router = require("express").Router()

const { Blog } = require("../models")

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

router.get("/api/blogs", async (req, res) => {
  const blogs = await Blog.findAll()

  console.log(JSON.stringify(blogs))
  res.json(blogs)
})

router.post("/api/blogs", async (req, res) => {
  console.log(req.body)
  const blog = await Blog.create({ ...req.body })
  res.json(blog)
})

router.delete("/api/blogs/:id", async (req, res) => {
  await Blog.destroy({ where: { id: req.params.id } })
  res.status(204).end()
})

module.exports = router

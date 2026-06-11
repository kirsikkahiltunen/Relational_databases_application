const router = require("express").Router()

const { Blog } = require("../models")

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll()

  console.log(JSON.stringify(blogs))
  res.json(blogs)
})

router.post("/", async (req, res) => {
  console.log(req.body)
  const blog = await Blog.create({ ...req.body })
  res.json(blog)
})

router.delete("/:id", blogFinder, async (req, res) => {
  await Blog.destroy({ where: { id: req.params.id } })
  res.status(204).end()
})

router.put("/:id", blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes + 1
  await req.blog.save()
  console.log("like added!")
  res.json(req.blog)
})

module.exports = router

const router = require("express").Router()
const { application } = require("express")
const { Blog } = require("../models")

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

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    console.log(blogs)
    res.json(blogs)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.post("/", async (req, res, next) => {
  try {
    const blog = await Blog.create({ ...req.body })
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.delete("/:id", blogFinder, async (req, res) => {
  await req.blog.destroy({ where: { id: req.params.id } })
  res.status(204).end()
})

router.put("/:id", blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes + 1
    await req.blog.save()
    console.log("like added!")
    res.json(req.blog)
  } catch (error) {
    next(error)
  }
})

router.use(errorHandler)

module.exports = router

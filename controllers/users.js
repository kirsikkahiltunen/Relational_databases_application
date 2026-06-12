const router = require("express").Router()
const { User } = require("../models")
const { Blog } = require("../models")

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === "SequelizeValidationError") {
    if (
      error.message ===
      "Validation error: Validation isEmail on username failed"
    ) {
      const message = "Username must be an email address"
      return res.status(400).json(message)
    }
    return res.status(400).json({ error: error.message })
  }
  return res.status(500).json({ error: error.message })

  next(error)
}

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
    },
  })
  res.json(users)
})

router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.put("/:username", async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } })
  user.username = req.body.username
  await user.save()
  res.json(user)
})

router.use(errorHandler)

module.exports = router

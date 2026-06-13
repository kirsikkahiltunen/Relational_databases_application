const router = require("express").Router()
const bcrypt = require("bcrypt")
const { User, Blog, ReadingList } = require("../models")

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

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ["name", "username"],
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: {
          exclude: ["userId", "createdAt", "updatedAt"],
        },
        through: {
          attributes: ["read", "id"],
        },
      },
    ],
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.post("/", async (req, res, next) => {
  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(req.body.password, saltRounds)
    const user = await User.create({
      name: req.body.name,
      username: req.body.username,
      passwordHash: passwordHash,
    })
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

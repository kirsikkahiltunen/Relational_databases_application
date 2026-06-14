const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const router = require("express").Router()
const { SECRET } = require("../util/config")
const { User, Blog, Session } = require("../models")
const { response } = require("express")

router.post("/", async (req, res) => {
  const body = req.body

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  })

  if (!user) {
    return res.status(401).json({
      error: "incorrect username or password",
    })
  }

  const passwordCorrect = await bcrypt.compare(body.password, user.passwordHash)

  if (!passwordCorrect) {
    return res.status(401).json({
      error: "incorrect username or password",
    })
  }
  if (!user.disabled) {
    const userToken = {
      id: user.id,
      username: user.username,
    }
    const token = jwt.sign(userToken, SECRET)
    const session = await Session.create({ token, userId: user.id })
    res.status(200).send({ token, username: user.username, name: user.name })
  } else {
    res.status(403).json({ error: "user disabled" }).end()
  }
})

module.exports = router

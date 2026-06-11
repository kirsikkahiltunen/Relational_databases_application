const jwt = require("jsonwebtoken")
const router = require("express").Router()

const { SECRET } = require("../util/config")
const User = require("../models/user")
const { response } = require("express")

router.post("/", async (req, res) => {
  const body = req.body

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  })

  const passwordCorrect = body.password === "salaista"

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "incorrect username or password",
    })
  }

  const userToken = {
    id: user.id,
    username: user.username,
  }
  const token = jwt.sign(userToken, SECRET)

  res.status(200).send({ token, name: user.name, username: user.username })
})
module.exports = router

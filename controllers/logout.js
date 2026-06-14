const router = require("express").Router()
const { User, Session } = require("../models")
const { sequelize } = require("../util/db")
const { SECRET } = require("../util/config")
const jwt = require("jsonwebtoken")

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

const validSession = async (req, res, next) => {
  const authorization = req.get("authorization")
  req.token = authorization.substring(7)
  const session = await Session.findOne({
    where: { token: req.token },
  })

  if (!session) {
    return res.status(401).json({ error: "session expired" })
  }

  const user = await User.findByPk(req.decodedToken.id)
  if (user.disabled) {
    return res.status(401).json({ error: "user disabled" })
  }
  req.session = session
  next()
}

router.delete("/", tokenExtractor, validSession, async (req, res) => {
  await req.session.destroy()
  res.status(204).end()
})

module.exports = router

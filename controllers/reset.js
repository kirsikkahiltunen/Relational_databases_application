const router = require("express").Router()
const { User } = require("../models")
const { Blog } = require("../models")
const { sequelize } = require("../util/db")

router.post("/reset", async (req, res) => {
  await sequelize.truncate({ cascade: true, restartIdentity: true })
  res.status(204).end()
})

module.exports = router

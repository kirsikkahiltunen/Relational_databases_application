const router = require("express").Router()
const { sequelize } = require("../util/db")

router.get("/", async (req, res) => {
  res.status(200).end()
})

router.post("/api/reset", async (req, res) => {
  await sequelize.destroyAll()
  res.status(204).end()
})

module.exports = router

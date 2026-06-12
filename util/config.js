require("dotenv").config()

const database =
  process.env.TESTING === "true"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL
module.exports = {
  PORT: process.env.PORT || 3001,
  DATABASE_URL: database,
  SECRET: process.env.SECRET,
}

require("dotenv").config()
module.exports = {
  PORT: process.env.PORT || 3003,
  DATABASE_URL: process.env.DATABASE_URL,
  SECRET: process.env.SECRET,
}

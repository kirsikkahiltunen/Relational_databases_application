require("dotenv").config()
const Sequelize = require("sequelize")
const { DATABASE_URL } = require("./config")

let database
if (process.env.TESTING === "true") {
  database = process.env.TEST_DATABASE_URL
} else {
  database = DATABASE_URL
}
const sequelize = new Sequelize(database, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log("connected to the db")
  } catch (error) {
    console.log("failed to connect to the db")
    return process.exit(1)
  }
  return null
}

module.exports = { connectToDatabase, sequelize }

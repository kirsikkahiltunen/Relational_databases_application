require("dotenv").config()
const Sequelize = require("sequelize")
const { DATABASE_URL } = require("./config")
const { Umzug, SequelizeStorage } = require("umzug")

const database =
  process.env.TESTING === "true" ? process.env.TEST_DATABASE_URL : DATABASE_URL

const sequelize = new Sequelize(database, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: "migrations/*.js",
    },
    storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
    context: sequelize.getQueryInterface(),
    logger: console,
  })

  const migrations = await migrator.up()
  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  })
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log("connected to the db")
  } catch (error) {
    console.log("failed to connect to the db")
    return process.exit(1)
  }
  return null
}

module.exports = { connectToDatabase, sequelize }

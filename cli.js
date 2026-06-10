require("dotenv").config()
const { Sequelize, QueryTypes } = require("sequelize")

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

const main = async () => {
  try {
    await sequelize.authenticate()
    const blogs = await sequelize.query("SELECT * FROM blogs", {
      type: QueryTypes.SELECT,
    })
    for (const blog of blogs) {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    }
    sequelize.close()
  } catch (error) {
    console.error("Failed to connect to the database:", error)
  }
}

main()

require("dotenv").config()
const { Sequelize, DataTypes, Model } = require("sequelize")
const express = require("express")
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: "blog",
  },
)

Blog.sync()

app.use(express.json())

app.get("/api/blogs", async (req, res) => {
  const blogs = await Blog.findAll()

  console.log(JSON.stringify(blogs))
  res.json(blogs)
})

app.post("/api/blogs", async (req, res) => {
  console.log(req.body)
  const blog = await Blog.create({ ...req.body })
  res.json(blog)
})

app.delete("/api/blogs/:id", async (req, res) => {
  await Blog.destroy({ where: { id: req.params.id } })
  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const { sequelize } = require("../util/db")
const Blog = require("./blog")
const User = require("./user")
User.hasMany(Blog)
Blog.belongsTo(User)
sequelize.sync()
module.exports = { Blog, User }

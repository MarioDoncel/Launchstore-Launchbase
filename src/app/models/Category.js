const db = require('../../config/db')
const Base = require('./Base')


Base.init({table: 'categories'})

const Category = Base.findAll()


module.exports = {
    Category
}
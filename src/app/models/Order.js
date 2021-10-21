const Base = require('./Base')


Base.init({table: 'orders'})

const Category =  { ...Base }



module.exports = Category

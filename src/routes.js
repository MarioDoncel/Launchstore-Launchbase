const express = require('express')
const productController = require('./app/controllers/productController')
const routes = express.Router()
const ProductController = require('./app/controllers/productController')


routes.get('/', function(req, res) {
    return res.render("layout.njk")
})

routes.get('/products/create', productController.create)
routes.post('/products', productController.post)






routes.get('/ads/create', function(req, res) {
    return res.render("products/create")
})



module.exports = routes
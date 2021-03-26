const express = require('express')
const productController = require('./app/controllers/productController')
const routes = express.Router()
const multer = require('./app/middlewares/multer')



routes.get('/', function(req, res) {
    return res.render("layout.njk")
})

routes.get('/products/create', productController.create)
routes.get('/products/:id/edit', productController.edit)
routes.get('/products/:id', productController.show)
routes.post('/products', multer.array('photos', 6), productController.post)
routes.put('/products', multer.array('photos', 6), productController.put)
routes.delete('/products', productController.delete)



routes.get('/ads/create', function(req, res) {
    return res.render("products/create")
})



module.exports = routes
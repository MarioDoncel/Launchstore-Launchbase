const express = require('express')
const homeController = require('./app/controllers/homeController')
const productController = require('./app/controllers/productController')
const searchController = require('./app/controllers/searchController')
const routes = express.Router()
const multer = require('./app/middlewares/multer')




routes.get('/', homeController.index)

//Search
routes.get('/products/search', searchController.index) //Colocada rota antes pois senão o  
//navegador tenta encontrar o :id das rotas products

//Products
routes.get('/products/create', productController.create)
routes.get('/products/:id/edit', productController.edit)
routes.get('/products/:id', productController.show)
routes.post('/products', multer.array('photos', 6), productController.post)
routes.put('/products', multer.array('photos', 6), productController.put)
routes.delete('/products', productController.delete)


//Alias
routes.get('/ads/create', function(req, res) {
    return res.render("products/create")
})



module.exports = routes
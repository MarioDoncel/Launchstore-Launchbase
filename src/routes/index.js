const express = require('express')
const routes = express.Router()

const homeController = require('../app/controllers/homeController')

const users = require('./users')
const products = require('./products')

//Home
routes.get('/', homeController.index)

//Products
routes.use('/products', products)

//Users
routes.use('/users', users)

//Alias
routes.get('/ads/create', function(req, res) {
    return res.render("/products/create")
})

module.exports = routes
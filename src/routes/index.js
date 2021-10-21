const express = require('express')
const routes = express.Router()

const homeController = require('../app/controllers/homeController')

const users = require('./users')
const products = require('./products')
const cart = require('./cart')
const orders = require('./orders')

//Home
routes.get('/', homeController.index)

//Products
routes.use('/products', products)

//Users
routes.use('/users', users)

//Cart
routes.use('/cart', cart)

//Orders
routes.use('/orders', orders)

//Alias
routes.get('/ads/create', function(req, res) {
    return res.redirect("/products/create")
})
routes.get('/accounts', function(req, res) {
    return res.redirect("/users/login")
})

module.exports = routes
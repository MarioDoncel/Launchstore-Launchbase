const express = require('express')
const routes = express.Router()

const cartController = require('../app/controllers/cartController')



// login/logout
routes.get('/', cartController.index)
routes.post('/:id/add-one', cartController.addOne)  
routes.post('/:id/remove-one', cartController.removeOne)  
routes.post('/:id/delete', cartController.delete)  


module.exports = routes
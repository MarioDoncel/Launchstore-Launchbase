const express = require('express')
const routes = express.Router()

const orderController = require('../app/controllers/orderController')
const {onlyUsers} = require('../app/middlewares/session')




routes.get('/', onlyUsers, orderController.index)  
routes.get('/sales', onlyUsers, orderController.sales)  
routes.get('/:id', onlyUsers, orderController.show)  

routes.post('/', onlyUsers, orderController.post)  
routes.post('/:id/:action', onlyUsers, orderController.update)  
  


module.exports = routes
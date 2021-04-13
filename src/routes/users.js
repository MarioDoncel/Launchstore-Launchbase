const express = require('express')
const routes = express.Router()

const sessionController = require('../app/controllers/SessionController')
const userController = require('../app/controllers/UserController')

const Validator = require('../app/validators/user')

// //login/logout
// routes.get('/login', sessionController.loginForm)
// routes.post('/login', sessionController.login)
// routes.post('/logout', sessionController.logout)

// //resetpassword /forgot
// routes.get('/forgot-password', sessionController.forgotForm)
// routes.get('/password-reset', sessionController.resetForm)
// routes.post('/forgot-password', sessionController.forgot)
// routes.post('/password-reset', sessionController.reset)

// //user register UserController
routes.get('/register', userController.registerForm)
routes.get('/', Validator.show, userController.show)

routes.post('/register',Validator.post, userController.post)
routes.put('/',Validator.update, userController.update)
// routes.delete('/', userController.delete)

module.exports = routes
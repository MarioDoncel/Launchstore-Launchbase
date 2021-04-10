const express = require('express')
const routes = express.Router()

const sessionController = require('../app/controllers/SessionController')
const userController = require('../app/controllers/UserController')

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
// routes.get('/', userController.show)

// routes.post('/register', userController.post)
// routes.put('/', userController.update)
// routes.delete('/', userController.delete)

module.exports = routes
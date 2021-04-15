const express = require('express')
const nunjucks = require('nunjucks')
const routes = require("./routes")
const methodOverride = require("method-override")
const session = require('./config/session')

const server = express()

server.use(session) // HABILITA O REQ.SESSION
server.use((req,res,next) => { // HABILITADA UMA VARIAVEL GLOBAL 'SESSION' PARA USAR NO NJK
    res.locals.session = req.session
    next()
})
server.use(express.urlencoded({extended:true})) // HABILITA O REQ.BODY
server.use(express.static('public')) // CONFIGURANDO PASTA PUBLIC
server.use(methodOverride('_method')) //HABILITANDO METHOD PUT/DELETE - HTML ACEITARIA APENAS GET E POST
server.use(routes)// INSERINDO ROTAS



server.set("view engine", "njk")// TEMPLATE ENGINE

nunjucks.configure("src/app/views", {
    express: server,
    autoescape: false,
    noCache: true
})

server.listen(5000, function() {

})
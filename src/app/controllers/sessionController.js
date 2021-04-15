// const {formatPrice} = require('../../lib/utils')

const Product = require('../models/Product')
// const File = require('../models/File')

module.exports = {
    loginForm(req, res){
        return res.render('session/login')
    },
    login(req,res){
        // verify user
        //verify password
        //Initialize req.session
        req.session.userId = req.user.id
        return res.redirect('/users')
    },
    logout(req, res){
        req.session.destroy()

        return res.redirect('/')
    }

}
// const {formatPrice} = require('../../lib/utils')

const User = require('../models/User')
// const File = require('../models/File')

module.exports = {
    async registerForm(req,res) {
       return res.render('user/register')
    },
    async post(req,res) {
        // Validação esta no Validators (middleware)
        const results = await User.create(req.body)
        const UserId = results.rows[0]
        return res.redirect('/users')

    }, 
    async show(req, res) {
        return res.send('ok')
    }
}
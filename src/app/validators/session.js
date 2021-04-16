const User = require('../models/User')
const {compare} = require('bcryptjs')

async function login(req, res, next){
    const {email, password} = req.body
    const results = await User.findOne({
        where: {email}
    })
    const user = results.rows[0]

    if(!user) return res.render('session/login', {
        user:req.body,
        error:"Usuário não encontrado"
    })

    const passed = await compare(password, user.password) // função do bcryptjs

    if(!passed) return res.render('session/login', {
        user: req.body,
        error: 'Senha incorreta'
    })
    req.user = user
    next()
}
async function forgot(req, res, next) {
    const {email} = req.body
    try {
        const results = await User.findOne({
            where: {email}
        })
        const user = results.rows[0]
    
        if(!user) return res.render('session/forgot-password', {
            user:req.body,
            error:"Email não cadastrado!"
        })
        req.user = user
        next()
    } catch (error) {
        console.error(error)
    }
    
}

module.exports = {
    login,
    forgot
}






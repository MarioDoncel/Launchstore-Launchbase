const User = require('../models/User')

async function post(req, res, next) {
    //check if has all fields
    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "") {
            return res.render('user/register', {
                user:req.body,
                error: 'Por favor preencha todos os campos'
            })
        }
    }
    //check if user exists [email, cpf_cnpj]
    let { email, cpf_cnpj } = req.body
    cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
    const results = await User.findOne({
        where: { email },
        or: { cpf_cnpj }
    })
    const user = results.rows[0]

    if (user) return res.render('user/register', {
        user:req.body,
        error: 'Usuário já cadastrado'
    })
    //check if password matchs
    const { password, passwordRepeat } = req.body
    if (password != passwordRepeat) return res.render('user/register', {
        user:req.body,
        error: 'Senha não confirmada corretamente'
    })

    next()
}
module.exports = {
    post
}






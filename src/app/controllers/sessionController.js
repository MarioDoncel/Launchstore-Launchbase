const crypto = require('crypto') // modulo de criação de token no NODE
const mailer = require('../../lib/mailer')

const Product = require('../models/Product')
const User = require('../models/User')
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
    },
    forgotForm(req, res){
        return res.render('session/forgot-password')
    },
    async forgot(req,res){
        const user = req.user // vem do validator

        try {
             // criar token
            const token = crypto.randomBytes(20).toString('hex')
            //ciar  validade do token
            const now = new Date()
            const expires = now.setHours(now.getHours()+1)
            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: expires
            })
            // enviar email com link de recuperação de senha (token)
            await mailer.sendMail({
                to:user.email,
                from: 'no-reply@launchstore.com.br',
                subject: 'Recuperação de senha',
                html: `<h2.Perdeu a senha?</h2>
                <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
                <p>
                    <a href="http://localhost:3000/users/password-reset?token=${token} target="_blank">
                        RECUPERAR SENHA
                    </a>
                </p>
                `
            })
            //avisar o usuario que enviamos o email
            return res.render("session/forgot-password", {
                success: "Email enviado, verifique sua caixa de entrada para resetar sua senha"
            })
        } catch (error) {
            return res.render("session/forgot-password", {
                error: "Ocorreu um erro, tente novamente."
            })
        }
       
    }

}
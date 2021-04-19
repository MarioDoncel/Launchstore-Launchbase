const User = require('../models/User')

const {formatCep, formatCpfCnpj} = require('../../lib/utils')

module.exports = {
    async registerForm(req,res) {
       return res.render('user/register')
    },
    async post(req,res) {
        // Validação esta no Validators (middleware) check fields
        const results = await User.create(req.body)
        const UserId = results.rows[0]

        req.session.UserId = UserId

        return res.redirect('/users')
    }, 
    async show(req, res) {
        // Validação e busca do User esta no Validators (middleware)
        const {user} = req

        user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj) 
        user.cep = formatCep(user.cep) 

        return res.render('user/index', {user})
    },
    async update(req,res) {
        // Validação esta no Validators (middleware) - check fields - check password
        try {
            const {user} = req
            let{name, email, cpf_cnpj, cep, address} = req.body
            cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
            cep = cep.replace(/\D/g, "")

            await User.update(user.id,{
                name, 
                email, 
                cpf_cnpj, 
                cep, 
                address
            })
            
            return res.render('user/index', {
                user: req.body,
                success:"Conta atualizada com sucesso!"
            })
        } catch (error) {
            console.error(error)
            return res.render('user/index', {
                error:"Algum erro ocorreu!"
            })
        }
    },
    async delete(req, res) {
        try {
            await User.delete(req.body.id)
            req.session.destroy()

            return res.render('session/login', {
                success:"Conta deletada com sucesso!"
            })
        } catch (error) {
            console.error(error)
            return res.render('user/index', {
                user: req.body,
                error:"Erro ao deletar conta!"
            })
        }
    }
}
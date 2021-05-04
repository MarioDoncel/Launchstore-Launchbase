const fs = require('fs')
const {hash} = require('bcryptjs')

const User = require('../models/User')
const Product  = require('../models/Product')
const {formatCep, formatCpfCnpj} = require('../../lib/utils')


module.exports = {
    async registerForm(req,res) {
       return res.render('user/register')
    },
    async post(req,res) {
        // Validação esta no Validators (middleware) check fields
        try {
            
            let {name, email, password, cpf_cnpj, cep, address} = req.body
            //hash of password (criptografia)
            password = await hash(req.body.password, 8)
            cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
            cep = cep.replace(/\D/g, "")


            const UserId = await User.create({
                name, 
                email, 
                password, 
                cpf_cnpj, 
                cep, 
                address
            })
    
            req.session.UserId = UserId
    
            return res.redirect('/users')
        } catch (error) {
            console.log(error)
        }
       
    }, 
    show(req, res) {
        // Validação e busca do User esta no Validators (middleware)
        try {
            const {user} = req

            user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj) 
            user.cep = formatCep(user.cep) 

            return res.render('user/index', {user})
        } catch (error) {
            console.log(error)
        }
        
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
            // pegar todos os produtos do usuario
            const userProducts = await Product.findAll({where: {user_id:req.body.id}})
            // dos produtos, pegar as imagens
            const allFilesPromise = userProducts.map(product => Product.files(product.id))
            let promiseResults =  await Promise.all(allFilesPromise)
            // remover as imagens da pasta public
            promiseResults.map(results => {
                results.rows.map(file=>{ 
                    try {
                        fs.unlinkSync(file.path)
                    } catch (error) {
                        console.log(error)
                    }
                })
            })
            // rodar a remoção do usuario
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
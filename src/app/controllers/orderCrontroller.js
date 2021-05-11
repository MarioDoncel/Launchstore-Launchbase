const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')
const User = require('../models/User')
const LoadProductService = require('../services/LoadProductService')
const mailer = require('../../lib/mailer')

const email = (seller, buyer, product) => `
<h2>Olá ${seller.name}</h2>
<p>Voce tem um novo pedido de compra de seu produto</p>
<p>Produto: ${product.name}</p>
<p>Preço: ${product.formattedPrice}</p>
<p><br/><br/></p>
<p>Dados do comprador</p>
<p>${buyer.name}</p>
<p>${buyer.email}</p>
<p>${buyer.address}</p>
<p>${buyer.cep}</p>
<p><br/><br/></p>
<p><strong>Entre em contato com o comprador para finalizar a venda!</strong></p>
<p><br/><br/></p>
<p>Atenciosamente, Equipe Launchstore</p>

`

module.exports = {
    async post(req, res) {
        try {
            const product = await LoadProductService.load('product', {where : {id:req.body.id}})

            const seller = await User.findOne({where: {id: product.user_id}})

            const buyer = await User.findOne({where: {id: req.session.userId}})

            await mailer.sendMail({
                to: seller.email,
                from: 'no-reply@launchstore.com',
                subject: "Novo pedido de compra",
                html: email(seller, buyer, product)

            })

            return res.render(`orders/success`)

             // ============ Exemplo de async await
        } catch (error) {
            console.log(error)
            return res.render(`orders/error`)
        }
    },
}
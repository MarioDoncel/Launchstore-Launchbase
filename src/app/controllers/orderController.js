const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')
const User = require('../models/User')
const Order = require('../models/Order')
const LoadProductService = require('../services/LoadProductService')
const LoadOrderService = require('../services/LoadOrderService')
const mailer = require('../../lib/mailer')
const Cart = require('../../lib/cart')


const email = (seller, buyer, product, quantity, total) => `
<h2>Olá ${seller.name}</h2>
<p>Voce tem um novo pedido de compra de seu produto</p>
<p>Produto: ${product.name}</p>
<p>Preço: ${product.formattedPrice}</p>
<p>Quantidade: ${quantity}</p>
<p>Total: ${total}</p>
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
    async index(req,res){
            const orders =await LoadOrderService.load('orders',{
                where: {buyer_id: req.session.userId}
            } )

        return res.render('orders/index', {orders})
    },
    async sales(req,res){
        const sales = await LoadOrderService.load('orders',{
            where: {seller_id: req.session.userId}
        } )

    return res.render('orders/sales', {sales})
    },
    async show(req,res){
        const order = await LoadOrderService.load('order',{
            where: {id: req.params.id}
        } )

    return res.render('orders/details', {order})
    },
    async post(req, res) {
        try {
            const buyer_id = req.session.userId
            //pegar os produtos do carrinho
            const cart =  Cart.init(req.session.cart)
            

            // Verificar se comprador não esta comprando o próprio produto
            const filteredItems = cart.items.filter(item => item.product.user_id != buyer_id)
            

            // criar o pedido
            const createOrdersPromise = filteredItems.map(async item => {
                let {product, price: total, quantity} = item
                const {price, id:product_id, user_id:seller_id} = product
                const status = "open"

                const order = await Order.create({
                    seller_id,
                    buyer_id,
                    product_id,
                    price,
                    total,
                    quantity,
                    status
                })

                product = await LoadProductService.load('product', {where : {id:product_id}})

                const seller = await User.findOne({where: {id: seller_id}})
    
                const buyer = await User.findOne({where: {id: buyer_id}})
    
                await mailer.sendMail({
                    to: seller.email,
                    from: 'no-reply@launchstore.com',
                    subject: "Novo pedido de compra",
                    html: email(seller, buyer, product, quantity, total = item.formattedPrice)
    
                })

                return order

            })

            await Promise.all(createOrdersPromise)
            req.session.cart = Cart.init()
            // const product = await LoadProductService.load('product', {where : {id:req.body.id}})

            // const seller = await User.findOne({where: {id: product.user_id}})

            // const buyer = await User.findOne({where: {id: req.session.userId}})

            // await mailer.sendMail({
            //     to: seller.email,
            //     from: 'no-reply@launchstore.com',
            //     subject: "Novo pedido de compra",
            //     html: email(seller, buyer, product)

            // })

            return res.render(`orders/success`)

             // ============ Exemplo de async await
        } catch (error) {
            console.log(error)
            return res.render(`orders/error`)
        }
    },
    async update(req, res) {
        try {
           const {id, action} = req.params

           const acceptedActions = ['close', 'cancel']

           if(!acceptedActions.includes(action)) return res.render('orders/error')

        // Pegar Pediddo
        const order = await Order.findOne({where:{id}})

        if (!order) return res.render('orders/error')

        // Verificar se esta aberto
        if(order.status != 'open') return res.render('orders/error')

        // atualizar pedido
        const statuses= {
            close:'sold',
            cancel:'canceled'
        }

        order.status = statuses[action]

        await Order.update(id, {status:order.status})


         return res.redirect(`/orders/sales`)

        } catch (error) {
            console.log(error)
            return res.render(`orders/error`)
        }
    },
}
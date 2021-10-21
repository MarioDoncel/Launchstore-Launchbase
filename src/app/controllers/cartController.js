const { addOne } = require("../../lib/cart")
const Cart = require("../../lib/cart")
const LoadProductsService = require('../services/LoadProductService')


module.exports = {
    async index(req, res) {
        try {

            let {cart} = req.session
            cart = Cart.init(cart)

            return res.render('cart/index', {cart})

        } catch (error) {
            console.log(error)
        }
    },
    async addOne(req,res) {
        // pegar o id do produto
        const {id} = req.params
        // pegar o produto
        const product = await LoadProductsService.load('product', {where: {id: id}})
        // pegar o cart da session
        let {cart} = req.session
        // adicionar ao carrinho
        req.session.cart = Cart.init(cart).addOne(product)

        return res.redirect('/cart')
    },
    removeOne(req,res) {
        // pegar o id do produto
        const {id} = req.params
        // pegar o cart da session
        let {cart} = req.session
        // se não tiver carrinho, retorna
        if(!cart) return res.redirect('/cart')
        // remover do carrinho
        req.session.cart = Cart.init(cart).removeOne(id)

        return res.redirect('/cart')
    },
    delete(req,res) {
        // pegar o id do produto
        const {id} = req.params
        // pegar o cart da session
        let {cart} = req.session
        // se não tiver carrinho, retorna
        if(!cart) return res.redirect('/cart')
        // remover do carrinho
        req.session.cart = Cart.init(cart).delete(id)

        return res.redirect('/cart')
    }
}
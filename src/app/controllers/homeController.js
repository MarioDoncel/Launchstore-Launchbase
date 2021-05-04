const {formatPrice} = require('../../lib/utils')

const Product = require('../models/Product')


module.exports = {
    async index(req, res) {
        try {
            const products = await Product.findAll()           

            if(!products) return res.send("Não encontramos produtos.")

            async function getImage(product) {
                let files = await Product.files(product.id) 
                files = files.map(file => (`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`))
                return files[0]
            }

            const productsPromisse = products.map(async product => {
                product.img = await getImage(product)
                product.price = formatPrice(product.price)
                product.old_price = formatPrice(product.old_price)
                return product
            }).filter((product, index) => index > 2 ? false : true)
            const lastAdded = await Promise.all(productsPromisse)

            return res.render("home/index.njk", {products: lastAdded})
        } catch (error) {
            console.log(error)
        }
    }
}
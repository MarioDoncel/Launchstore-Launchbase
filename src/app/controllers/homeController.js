const {formatPrice} = require('../../lib/utils')

const Product = require('../models/Product')
const File = require('../models/File')

module.exports = {
    async index(req, res) {
        let results = await Product.all()
        const products = results.rows

        if(!products) return res.send("Não encontramos produtos.")

        async function getImage(product) {
            let results = await Product.files(product.id) 
            const files = results.rows.map(file => (`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`))
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
    }
}
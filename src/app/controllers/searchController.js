const {formatPrice} = require('../../lib/utils')

const Product = require('../models/Product')
const File = require('../models/File')

module.exports = {
    async index(req, res) {
        try {
        let results,
            params={}

        const {filter, category} = req.query
        if (!filter) return res.redirect('/')
            params.filter = filter
        if (category) {
            params.category = category
        }

        results = await Product.search(params)

        async function getImage(product) {
            let results = await Product.files(product.id) 
            const files = results.rows.map(file => (`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`))
            return files[0]
        }

        const productsPromise = results.rows.map(async product => {
            product.img = await getImage(product)
            product.price = formatPrice(product.price)
            product.old_price = formatPrice(product.old_price)
            return product
        })
        const products = await Promise.all(productsPromise)
        const search = {
            term:req.query.filter,
            total:products.length
        }

        const categories = products.map(product => ({
            id: product.category_id,
            name: product.category_name
        })).reduce((accumulator, category)=> {
            const found = accumulator.some(accumulator => accumulator.id == category.id)
            if (!found) {
                accumulator.push(category)
            }
            return accumulator
        }, [])


        return res.render("search/index.njk", {products, search, categories})

        } catch (error) {
            console.log(error)
        }
        
    }
}
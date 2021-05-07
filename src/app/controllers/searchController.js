const Product = require('../models/Product')
const LoadProductService = require('../services/LoadProductService')


module.exports = {
    async index(req, res) {
        try {

        let {filter, category} = req.query

        if (!filter || filter.toLowerCase() == 'toda a loja') filter = null

        let products = await Product.search({filter, category})

        const productsPromise = products.map(product => LoadProductService.format(product))
        products = await Promise.all(productsPromise)
        
        const search = {
            term:filter || 'Toda a loja',
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
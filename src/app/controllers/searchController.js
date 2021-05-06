const Product = require('../models/Product')
const LoadProductService = require('../services/LoadProductService')


module.exports = {
    async index(req, res) {
        try {
        let params={}

        const {filter, category} = req.query
        if (!filter) return res.redirect('/')
        
        params.filter = filter
        if (category) {
            params.category = category
        }

        let products = await Product.search(params)

        const productsPromise = products.map(product => LoadProductService.format(product))
        products = await Promise.all(productsPromise)
        
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
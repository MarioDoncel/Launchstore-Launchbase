const LoadProductService = require('../services/LoadProductService')

module.exports = {
    async index(req, res) {
        try {
            const allProducts = await LoadProductService.load('products') 
            
            const lastAdded = allProducts.filter((product, index) => {
                product.img = product.img.replace(/\\/g, "/")
                return index > 2 ? false : true
            })        

            if(!allProducts) return res.send("Não encontramos produtos.")

            return res.render("home/index.njk", {products: lastAdded})
        } catch (error) {
            console.log(error)
        }
    }
}
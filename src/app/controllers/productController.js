const Category = require('../models/Category')
const Product = require('../models/Product')

module.exports = {
    create(req,res) {
        //Pegar categorias
        Category.all()
        .then(function(results) {
            const categories = results.rows

            return res.render('products/create.njk', {categories})
        }).catch(function (err) {
            throw new Error(err)
        })

            // exemplo de PROMISSE
        
    },
    async post(req, res) {
        // Logica de salvar no DB
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (key == "") {
                return res.send("Por favor preencha todos os campos")
            }
        }
        let results = await Product.create(req.body)
        const productId = results.rows[0].id

        results = await Category.all()
        const categories = results.rows

        return res.render('products/create.njk', {categories, productId})

             // ============ Exemplo de async await
    }
}
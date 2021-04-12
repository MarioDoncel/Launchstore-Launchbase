const {formatPrice, date} = require('../../lib/utils')

const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

module.exports = {
    create(req,res) {
        //Pegar categorias
        Category.all()
        .then(function(results) {
            const categories = results.rows
            console.log(categories)

            return res.render('products/create.njk', {categories})
        }).catch(function (err) {
            throw new Error(err)
        })

            // exemplo de PROMISSE
        
    },
    async post(req, res) {
        // Logica de salvar no DB
        const keys = Object.keys(req.body)
        for (req.body[key] of keys) {
            if (key == "") {
                return res.send("Por favor preencha todos os campos")
            }
        }
        if(req.files.length == 0) return res.send('Por favor envie pelo menos uma imagem.')

        let results = await Product.create(req.body)
        const productId = results.rows[0].id

        const filesPromise = req.files.map(file =>  File.create({...file, product_id:productId})) // criando um array de promises
        await Promise.all(filesPromise) //executa cada promisse em sequencia

        results = await Category.all()
        const categories = results.rows

        return res.redirect(`products/${productId}/edit`)

             // ============ Exemplo de async await
    },
    async show(req,res){
        let results = await Product.find(req.params.id)
        const product = results.rows[0]
            if(!product)return res.send('Produto não encontrado!')

            product.published = {
                date: date(product.updated_at).format,
                hour:date(product.updated_at).hour,
                minute:date(product.updated_at).minute
            }
            product.old_price = formatPrice(product.old_price)
            product.price = formatPrice(product.price)

        results = await Product.files(product.id) // product.id
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render('products/show', {product, files})
    },
    async edit(req,res) {
        let results = await Product.find(req.params.id)
        const product = results.rows[0]
            if(!product)return res.send('Produto não encontrado!')
        
        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)
        
        // Pegando categorias para o <select>
        results = await Category.all()
        const categories = results.rows

        // pegando imagens para visualização
        results = await Product.files(product.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
        return res.render('products/edit.njk', {product, categories, files})
    },
    async put(req,res){
        const keys = Object.keys(req.body)
        for (req.body[key] of keys) {
            if (key == "" && key != "removed_files") {
                return res.send("Por favor preencha todos os campos")
            }
        }
        
        if (req.files.length != 0) {
            const newFilesPromisse = req.files.map(file => 
                File.create({...file, product_id:req.body.id}))
                await Promise.all(newFilesPromisse)
        }

        if(req.body.removed_files){
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length-1
            removedFiles.splice(lastIndex,1)
            const removedFilesPromise = removedFiles.map(id => File.delete(id))
            await Promise.all(removedFilesPromise)
        }

        req.body.price = req.body.price.replace(/\D/g, "")
        if(req.body.old_price != req.body.price){
            const oldProduct = await Product.find(req.body.id)
            
            req.body.old_price = oldProduct.rows[0].price
        }
        await Product.update(req.body)

        return res.redirect(`products/${req.body.id}`)
    }, 
    async delete(req, res) {
        await Product.delete(req.body.id)

        return res.redirect('/products/create')
    }
}
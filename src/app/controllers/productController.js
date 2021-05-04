const {formatPrice, date} = require('../../lib/utils')

const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

module.exports = {
    async create(req,res) {
        try {
            //Pegar categorias
            const categories = await Category.findAll()
            
            return res.render('products/create.njk', {categories})
        } catch (error) {
            console.log(error)
        }       
    },
    async post(req, res) {
        try {
            // Logica de salvar no DB
            const keys = Object.keys(req.body)
            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send("Por favor preencha todos os campos")
                }
            }
            if(req.files.length == 0) return res.send('Por favor envie pelo menos uma imagem.')

            let {category_id, name, description, old_price, price, quantity, status} = req.body
            price = price.replace(/\D/g, "") // Tirando a formatação de reais

            
            const product_id = await Product.create({
                category_id, 
                user_id: req.session.userId,
                name, 
                description, 
                old_price: old_price || price, 
                price, 
                quantity, 
                status: status || 1
            })
             

            const filesPromise = req.files.map(file =>  File.create({...file, product_id})) // criando um array de promises
            await Promise.all(filesPromise) //executa cada promisse em sequencia

            return res.redirect(`products/${product_id}/edit`)

             // ============ Exemplo de async await
        } catch (error) {
            console.log(error)
        }
    },
    async show(req,res){
        try {
            const product = await Product.find(req.params.id)
            if(!product)return res.send('Produto não encontrado!')

            product.published = {
                date: date(product.updated_at).format,
                hour:date(product.updated_at).hour,
                minute:date(product.updated_at).minute
            }
            product.old_price = formatPrice(product.old_price)
            product.price = formatPrice(product.price)

            let files = await Product.files(product.id) // product.id
            files = files.map(file => ({
                ...file,
                src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render('products/show', {product, files})
        } catch (error) {
            console.log(error)
        }

        
    },
    async edit(req,res) {
        try {
            const product = await Product.find(req.params.id)
         
            if(!product)return res.send('Produto não encontrado!')
            
            product.old_price = formatPrice(product.old_price)
            product.price = formatPrice(product.price)
            
            // Pegando categorias para o <select>
            const categories = await Category.findAll()
            
            // pegando imagens para visualização
            let files = await Product.files(product.id)
            files = files.map(file => ({
                ...file,
                src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))
            return res.render('products/edit.njk', {product, categories, files})
        } catch (error) {
            console.log(error)
        }
        
    },
    async put(req,res){
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
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
        await Product.update(req.body.id, {
            category_id: req.body.category_id,
            name: req.body.name,
            description: req.body.description,
            old_price: req.body.old_price,
            price: req.body.price,
            quantity: req.body.quantity,
            status: req.body.status
        })

        return res.redirect(`products/${req.body.id}`)
    }, 
    async delete(req, res) {
        await Product.delete(req.body.id)

        return res.redirect('/products/create')
    }
}
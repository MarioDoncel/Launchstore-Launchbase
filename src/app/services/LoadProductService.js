const Product = require('../models/Product')
const {formatPrice, date} = require('../../lib/utils')

async function getImages(product) {
    let files = await Product.files(product.id) 
    files = files.map(file => ({
        ...file,
        src:`${file.path.replace("public", "")}`
    }))
    return files
}

async function format(product) {
    const files = await getImages(product)
    product.img = files[0].src
    product.files = files
    product.formattedPrice = formatPrice(product.price)
    product.formattedOld_price = formatPrice(product.old_price)
    
    const {day, hour, minute, month}= date(product.updated_at)

    product.published = {
        day:`${day}/${month}`,
        hour: `${hour}h${minute}min`
    }
    // product.published = {
    //     date: date(product.updated_at).format,
    //     hour:date(product.updated_at).hour,
    //     minute:date(product.updated_at).minute
    // }
    return product
}

const LoadService = {
    load(service, filter) {
        this.filter = filter
        return this[service](filter)
    },
    async product(){
        try {
            const product = await Product.findOne(this.filter)
            return format(product)
        } catch (error) {
            console.error(error)
        }
    },
    async products(){
        try {
            const products = await Product.findAll(this.filter)
            const productsPromise = products.map(product => format(product))
            return Promise.all(productsPromise)
        } catch (error) {
            console.error(error)
        }
    },
    format
}
module.exports = LoadService
const faker = require('faker')
const {hash} = require('bcryptjs')
const User = require('./src/app/models/User')
const Product = require('./src/app/models/Product')
const File = require('./src/app/models/File')


async function createUsers() {
    const users = []
    const password = await hash('1111', 8)
    let usersIds = []

    while (users.length < 3) {
        users.push({
            name: faker.name.findName(),
            email: faker.internet.email(),
            password,
            cpf_cnpj: faker.datatype.number(99999999999),
            cep: faker.datatype.number(99999999),
            address: faker.address.streetName()
        })
    }
    const usersPromise = users.map(user => User.create(user))
    usersIds = await Promise.all(usersPromise)
}

async function createProducts() {
    const products = []
    let productsIds = []

    while (products.length < 10) {
        products.push({
            category_id: Math.ceil(Math.random()*3),
            user_id: Math.ceil(Math.random()*3),
            name: faker.name.title(),
            description: faker.lorem.paragraph(Math.ceil(Math.random()*3)),
            old_price: faker.datatype.number(9999),
            price: faker.datatype.number(9999),
            quantity: faker.datatype.number(99),
            status: Math.round(Math.random()) // 0 - 1 
        })
    }
    const productsPromise = products.map(product => Product.create(product))
    productsIds = await Promise.all(productsPromise)

    let files = []
    while (files.length < 25) {
        files.push({
            name:faker.image.image(),
            path:`public/images/placeholder.png`,
            product_id: Math.ceil(Math.random()*10),
        })
    }
    const filesPromise = files.map(file => File.create(file))
    filesIds = await Promise.all(filesPromise)

}

async function init() {
    await createUsers()
    await createProducts()
}
init()
const db = require('../../config/db')
const {hash} = require('bcryptjs')
const fs = require('fs')
const Product = require('./Product')

module.exports = {
    findOne(filters) {
        let query = `SELECT * FROM users`

        Object.keys(filters).map(key => {
            // where || or
            query = `${query}
            ${key}
            `

            Object.keys(filters[key]).map(field => {
                // email || cpf_cnpj
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })
        return db.query(query)
    },
    async create(data) {
        try {
            const query = `
        INSERT INTO users (
            name,
            email,
            password,
            cpf_cnpj,
            cep,
            address
        ) VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING id`
        
        //hash of password (criptografia)
        const passwordHash = await hash(data.password, 8)

        const values = [
            data.name,
            data.email,
            passwordHash,
            data.cpf_cnpj.replace(/\D/g, ""),
            data.cep.replace(/\D/g, ""),
            data.address
        ]

        return db.query(query, values)
        } catch (error) {
            console.error(error)
        }
        
    },
    async update(id, fields) {
        let query = `UPDATE users SET`
        Object.keys(fields).map((key, index, array)=> {
            if((index+1) < array.length) {
                query = `${query}
                ${key} = '${fields[key]}',
                `
            } else {
                //last iteration ... no comma
                query = `${query}
                ${key} = '${fields[key]}'
                WHERE id = ${id}
                `
            }
        })
        await db.query(query)
        return
    },
    async delete(id){ 
        // pegar todos os produtos do usuario
        let results = await db.query(`SELECT * FROM products WHERE user_id = ${id}`)
        const userProducts = results.rows
        // dos produtos, pegar as imagens
        const allFilesPromise = userProducts.map(product => Product.files(product.id))
        let promiseResults =  await Promise.all(allFilesPromise)
        // remover as imagens da pasta public
        promiseResults.map(results => {
            results.rows.map(file=> fs.unlinkSync(file.path))
        })
        // rodar a remoção do usuario
        await db.query(`DELETE FROM users WHERE id = ${id}`)
    }
}
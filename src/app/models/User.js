const db = require('../../config/db')
const {hash} = require('bcryptjs')

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
        
    }
}
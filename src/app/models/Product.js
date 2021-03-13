const db = require('../../config/db')

module.exports = {
    create(data) {
        const query = `
        INSERT INTO products (
            category_id,		
            user_id,
            name,	
            description,
            price,
            old_price,	
            quantity,	
            status	
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING id`

        data.price = data.price.replace(/\D/g, "") // Tirando a formatação de reais

        const values = [
            data.category_id,		
            data.user_id || 1,
            data.name,	
            data.description,
            data.price,
            data.old_price || data.price,	
            data.quantity,	
            data.status || 1	
        ]

        return db.query(query, values)
        
    }
}
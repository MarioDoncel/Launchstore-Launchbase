//funçao para calcular idade
module.exports = {
    date(timestamp) {
        const date = new Date(timestamp)

        const year = date.getUTCFullYear()
        const month = `0${date.getUTCMonth() + 1}`.slice(-2)
        const day = `0${date.getUTCDate()}`.slice(-2)
        const hour = date.getHours()
        const minute = date.getMinutes()

        
        return {
            day,
            month,
            year,
            hour,
            minute,
            iso:`${year}-${month}-${day}`,
            birthDay:`${day}/${month}`,
            format: `${day}/${month}/${year}`
        }
    },
    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style:'currency',
            currency:'BRL'
        }).format(price/100) // Formatando para reais
    },
    formatCpfCnpj(value){
        value = value.replace(/\D/g, "")
        if(value.length > 14) value = value.slice(0,-1)
        //check if CPF or CNPJ
        if (value.length > 11) {
            //cnpj
            value= value.replace(/(\d{2})(\d)/,"$1.$2")
            value= value.replace(/(\d{3})(\d)/,"$1.$2")
            value= value.replace(/(\d{3})(\d)/,"$1/$2")
            value= value.replace(/(\d{4})(\d)/,"$1-$2")
        } else {
            //cpf
            value= value.replace(/(\d{3})(\d)/,"$1.$2")
            value= value.replace(/(\d{3})(\d)/,"$1.$2")
            value= value.replace(/(\d{3})(\d)/,"$1-$2")
        }
        return value
    },
    formatCep(value){
        value = value.replace(/\D/g, "")
        if(value.length > 8) value = value.slice(0,-1)
        value= value.replace(/(\d{5})(\d)/,"$1-$2")
        return value
    }
}
// const input = document.querySelector('input[name="price"]')

// input.addEventListener("keydown", function (e) {
//     setTimeout(function () {
//         let {value} = e.target
//     value = value.replace(/\D/g, "")  // Substituir todos os caracteres que não sejam numeros
//     // e.target.value = e.target.value.replace(/\D/g, "") // Forma reduzida de executar o mesmo replace

//     value = new Intl.NumberFormat('pt-BR', {
//         style:'currency',
//         currency:'BRL'
//     }).format(value/100) // Formatando para reais

//     e.target.value = value 
    
//     },1) // a cada 1 milissegundo faz  a substituição
// })

const Mask ={
    apply(input, func) {
        setTimeout(function () {
            input.value = Mask[func](input.value)
        },1)
    },
    formatBRL(value) {
    value = value.replace(/\D/g, "")  // Substituir todos os caracteres que não sejam numeros

    return new Intl.NumberFormat('pt-BR', {
        style:'currency',
        currency:'BRL'
    }).format(value/100) // Formatando para reais
    }
}
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
    },
    cpfCnpj(value) {
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
    cep(value){
        value = value.replace(/\D/g, "")
        if(value.length > 8) value = value.slice(0,-1)
        value= value.replace(/(\d{5})(\d)/,"$1-$2")
        return value
    }
}

const PhotosUpload = {
    input:"",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    files:[], // novo array para gerenciar lista de fotos
    handleFileInput(event) {
        const { files: fileList } = event.target // Lista de arquivos do input
        PhotosUpload.input = event.target // definindo variavel input sendo o <input>
        if (PhotosUpload.limitReached(event)) return // Testando se atingiu o limite de 6 arquivos caso True encerra funcao com alert e return
        Array.from(fileList).forEach(file => { // Transforma a lista em array e analisa cada file
            PhotosUpload.files.push(file) // inclui arquivo no novo array para gerenciar
            const reader = new FileReader() // Leitor de arquivo, transforma img em codigo
            reader.onload = () => { // Ao carregar o leito faça
                const image = new Image() // cria <img>
                image.src = String(reader.result) // acrescenta src="" com arquivo convertido
                const div = PhotosUpload.getDiv(image) // Criador de div para inserir mini foto
                PhotosUpload.preview.appendChild(div) // add div com o preview(mini foto)
            }
            reader.readAsDataURL(file)
        })
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    getDiv(image) {
        const div = document.createElement('div') // cria <div>
        div.classList.add('photo') // add class="" a div
        div.onclick = (e) => PhotosUpload.removePhoto(e) // alerta ao clicar sobre div
        div.appendChild(image) // add <img> na <div>
        div.appendChild(PhotosUpload.getRemoveButton()) // add camada de exclusao da foto
        return div
    },
    limitReached(event) {
        const {uploadLimit, input, preview} = PhotosUpload
        const {files:fileList} = input
        if (fileList.length > uploadLimit) { // Limite de envio de 6 fotos
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }
        const photosDiv = [] // contador de fotos ja enviadas
        preview.childNodes.forEach(item=> { // item = photo preview 
            if(item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })
        const totalPhotos = fileList.length + photosDiv.length // Limite de fotos somando ja enviadas com novo envio
        if(totalPhotos > uploadLimit){
            alert("Você atingiu o total de fotos! O limite é de 6.")
            event.preventDefault
            return true
        }
        return false
    },
    getAllFiles(){
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer() 
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file)) // pega arquivos do novo array de fotos para transformar em lista
        return dataTransfer.files // Criando lista de fotos para poder substituir input files (que gera uma lista não manipulavel)
    },
    getRemoveButton(){
        const button = document.createElement('i') // cria camada de exclusao da foto que aparecera no :hover
        button.classList.add('material-icons')
        button.innerHTML = 'close'
        return button
    },
    removePhoto(event){
        const photoDiv = event.target.parentNode // event target = <i> ... parent node = <div class="photos">
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv) // pega o index da foto clicada
        PhotosUpload.files.splice(index, 1) // remove a foto clicada usando index pego anteriormente do array criado para subistituir lista
        PhotosUpload.input.files = PhotosUpload.getAllFiles() // Substitui a lista original do input pela nova lista modificada
        photoDiv.remove() // remove foto do front end
    },
    removeOldPhoto(event){
        const photoDiv = event.target.parentNode
        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }
        photoDiv.remove()
    }
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(event) {
        const {target} = event
        ImageGallery.previews.forEach(preview => preview.classList.remove("active"))
        target.classList.add('active')
        ImageGallery.highlight.src = target.src
    }
}
const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-close'),
    open(e){
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.closeButton.style.top = 0
        Lightbox.image.src = e.target.src
    },
    close(){
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = '-100%'
        Lightbox.closeButton.style.top = '-80px'
    }
}
const db = require('../../config/db')
const fs = require('fs')
const Base = require('./Base')

Base.init({table: 'files'})

const File = {
    ...Base
}


module.exports = File



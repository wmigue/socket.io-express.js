const mongoose = require('mongoose')
const schema = mongoose.Schema

const Users = mongoose.model('User', new schema({
    email: String,
    password: String,

}))

module.exports = Users
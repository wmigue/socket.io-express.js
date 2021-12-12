const mongoose = require('mongoose')
const schema = mongoose.Schema

const Users = mongoose.model('User', new schema({
    name: String,
    email: String,
    picture: String,


}))

module.exports = Users
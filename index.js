//SERVIDOR
import express from 'express'
import { Server as Sockete } from 'socket.io'
import http from 'http'
import { v4 as uuid } from 'uuid'
import bodyParser from 'body-parser'
import process from 'process'
var path = require("path")
const { engine } = require('express-handlebars')
const cookieParser = require('cookie-parser')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const Users = require('./models/Users')

// Google Auth
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID)

//app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.engine('.hbs', engine({ defaultLayout: 'layout', extname: '.hbs' })) //layout.hbs: es el contenedor de todo.
app.set('view engine', '.hbs');
app.use("/estaticos/estaticosChat", express.static(__dirname + "/estaticos/estaticosChat")) //servir estáticos de la carpeta esa.
app.use("/estaticos/estaticosLogin", express.static(__dirname + "/estaticos/estaticosLogin"))

// Conexión a Base de datos
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});




//middlewares
function checkAuthenticated(req, res, next) {
    let token = req.cookies['session-token']
    let user = {}
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            requiredAudience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        })
        const payload = ticket.getPayload()
        user.name = payload.name
        user.email = payload.email
        user.picture = payload.picture
        console.log(payload)
    }
    verify()
        .then(() => {
            req.user = user
            next();
        })
        .catch(err => {
            console.log(token)
            res.send('error usuario / contraseña inválido.')
        })
}


// rutas
app.get('/chat', checkAuthenticated, (req, res) => {
    let user = req.user
    res.render('chat', { user })
})




app.get('/', (req, res) => {
    res.render('login')
})




app.post('/', (req, res) => {
    let token = req.body.token
    let pl = {}
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            requiredAudience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload()
        const userid = payload['sub']
        pl.name = payload['name']
        pl.email = payload['email']
        pl.picture = payload['picture']
    }
    verify()
        .then(() => {
            res.cookie('session-token', token)
            res.send('success')
            Users.findOne({ email: pl.email }).exec()
                .then(x => {
                    if (x == null) {
                        Users.create({
                            name: pl.name,
                            email: pl.email,
                            password: pl.password
                        })
                    }
                })
        })
        .catch(console.error)

})



















//CHAT CON SOCKET
const server = http.createServer(app)
const io = new Sockete(server) //queda pendiente del servidor

const ArrNotas = []

//cada que alguien se conecte o refresque navegador.
io.on('connection', (socket) => {

    console.log('nueva conexion desde cliente ID: ' + socket.id)

    socket.emit('server:loadnotes', ArrNotas) //envio el array a la interfaz de los usuarios.

    socket.on('cliente:newnote', (data) => {  //cuando envio el formulario con submit
        const nota = {
            title: data.title,
            description: data.description,
            id: uuid()
        }
        ArrNotas.push(nota) // agrego nota al array base.
        io.emit('server:newnote', nota) //emito esta nota a todos los clientes conectados. (con socket.emit solo enviaria a ese socket o cliente individual, en cambio con io.emit envio a todos los sockets conectados.)
    })

})


const PORT = process.env.PORT || 3000
server.listen(PORT)
console.log("server on port", PORT)
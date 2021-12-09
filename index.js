//SERVIDOR
import express from 'express'
import { Server as Sockete } from 'socket.io'
import http from 'http'
import { v4 as uuid } from 'uuid'
import bodyParser from 'body-parser'
var path = require("path")
const { engine } = require('express-handlebars')
const cookieParser = require('cookie-parser')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const Users = require('./models/Users')

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


// rutas
app.get('/', (req, res) => {
    res.render('login')
})



app.post('/', (req, res) => {
    const { email, password } = req.body;
    Users.findOne({ email: email, password: password }).exec()
        .then(x => {
            if (x) {
                res.render('chat.hbs')
            } else {
                res.render('error.hbs', {
                    tipo: "error, contraseña incorrecta / usuario no existe..."
                })
            }
        })
})



app.post('/nuevoUsuario', (req, res) => {
    const { email, password } = req.body
    Users.findOne({ email }).exec()
        .then(x => {
            if (x) {
                return res.send('ese usuario ya existe.')
            }
            Users.create({
                email: email,
                password: password, //lo guardo.
            }).then(() => {
                res.send('usuario creado con èxito.')
            })
        })
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
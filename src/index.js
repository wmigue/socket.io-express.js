//SERVIDOR

import express from 'express'
import { Server as Sockete } from 'socket.io'
import http from 'http'
import { v4 as uuid } from 'uuid'

const app = express()
const server = http.createServer(app)
const io = new Sockete(server) //queda pendiente del servidor

const ArrNotas = []

//servir todo lo del directorio public.
app.use(express.static(__dirname + '/public'))

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


server.listen(3000)
console.log("server on port", 3000)
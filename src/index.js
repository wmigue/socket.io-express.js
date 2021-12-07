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

//cada que alguien se conecte o refresque navegador
io.on('connection', (socket) => {

    console.log('nueva conexion desde cliente ID: ' + socket.id)

    socket.emit('server:loadnotes', ArrNotas)

    socket.on('cliente:newnote', (data) => {
        const nota = {
            title: data.title,
            description: data.description,
            id: uuid()
        }     
        ArrNotas.push(nota)
        io.emit('server:newnote', nota) 
    })

})

server.listen(3000)
console.log("server on port", 3000)
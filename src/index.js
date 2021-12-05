//SERVIDOR

import express from 'express'
import { Server as Sockete } from 'socket.io'
import http from 'http'

const app = express()
const server = http.createServer(app)
const io = new Sockete(server) //queda pendiente del servidor

//servir todo lo del directorio public.
app.use(express.static(__dirname +'/public')) 

//cada que alguien se conecte, de objeto socket sacamos el atributo id, que es unico de cada conexion.
io.on('connection', (socket)=>{
    console.log('nueva conexion desde cliente ID: ' + socket.id)
    socket.emit('mensaje1') //emito mensaje
    socket.on('mensaje2', ()=>{ //recibo mensaje del cliente.
        console.log("del servidor")
    })
})

server.listen(3000)
console.log("server on port", 3000)
//CLIENTE

const socket = io() //nueva conexion desde cliente ID: xxxxxxxxxx

//escuchando desde 
socket.on('mensaje1', ()=>{ 
    console.log("escuchando...") //cuando hay una nueva conexion se dispara este console.log
    socket.emit("mensaje2")
})
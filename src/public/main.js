//CLIENTE

const socket = io() 

const enviarRoom=(data)=>{
     socket.emit('client:msgtoroom',  data)
}

socket.on('server:msgtoroom', data=>{
    console.log(data)
})


socket.on('mensaje1', ()=>{ 
    console.log("escuchando...") 
    socket.emit("mensaje2")
})

socket.on('server:unirse', ()=>{ 
    let res = prompt("unirse a room1 ???")
    socket.emit('client:respuesta:unirse', {res: res})
})






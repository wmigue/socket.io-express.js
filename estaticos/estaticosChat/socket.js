//CLIENTE (socket)


const socket = io() 

const saveNote = (t, d) => {
    socket.emit('cliente:newnote', {
        title: t,
        description: d
    })
}

const Privado=(data)=>{
    socket.emit('client:private', { 'id': data});
}

socket.on('server:private', (data)=>{
    PintarPrivado(data.message)
})



socket.on('server:newnote', (data) => {
    appendNote(data)
})

socket.on('server:loadnotes', (data) => {
    loadNotes(data)
})

socket.on('server:loadusers', (data) => {
    appendUser(data)
})





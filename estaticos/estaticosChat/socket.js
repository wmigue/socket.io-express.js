//CLIENTE (socket)


const socket = io() 

const saveNote = (t, d) => {
    socket.emit('cliente:newnote', {
        title: t,
        description: d
    })
}

socket.on('server:newnote', (data) => {
    appendNote(data)
})

socket.on('server:loadnotes', (data) => {
    loadNotes(data)
})

socket.on('server:loadusers', (data) => {
    appendUser(data)
})




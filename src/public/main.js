//CLIENTE


const noteForm = document.querySelector('#formulario')
const noteTitle = document.querySelector('#title')
const noteDescription = document.querySelector('#description')


noteForm.addEventListener('submit', (e) => { 
    e.preventDefault()
    saveNote(noteTitle.value, noteDescription.value)
    
})






const notas = document.querySelector('#notas')

const appendNote = (data)=>{
    notas.innerHTML += `<h5>${data.title}</h5>`
}

const loadNotes=(data)=>{
    data.forEach(el => {
        appendNote(el ) 
    });
}


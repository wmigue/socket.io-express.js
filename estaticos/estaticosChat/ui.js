const notas = document.querySelector('#notas')
const usuarios = document.querySelector('#usuarios')




const appendNote = (data) => {
    let reloj = new Date()
    notas.innerHTML += `<br> <b>${data.title}</b> <br> ${data.description} <div class="reloj">${reloj.toLocaleTimeString()}</div>`
    window.scrollTo(0, document.body.scrollHeight)
}

const loadNotes = (data) => {
    data.forEach(el => {
        appendNote(el)
    })
}



const appendUser = (users) => {
    usuarios.innerHTML = ""
    users.forEach(el => {
        var p = document.createElement(p)
        p.id=el,  p.textContent = el + " --- "
        usuarios.appendChild(p)
        document.getElementById(el).addEventListener('click', () => {
            alert(el),
            Privado(el)     
        })
    })
}

const PintarPrivado=(data)=>{
    notas.innerHTML += "<br>" + data
}


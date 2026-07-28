const input = document.getElementById('ingresar-tarea');
const formulario = document.getElementById('formulario-tarea'); 
const listaDeTarea = document.getElementById('lista-de-tareas');

function agregarTarea(evento) {

    evento.preventDefault(); 

    if (input.value) {
        let tareaNueva = document.createElement('div');
        tareaNueva.classList.add('tarea');
        
        let texto = document.createElement('p');
        texto.innerText = input.value;
        tareaNueva.appendChild(texto);

        let iconos = document.createElement('div');
        iconos.classList.add('iconos');
        tareaNueva.appendChild(iconos);

        let completar = document.createElement('i');
        completar.classList.add('bi', 'bi-check-circle-fill', 'icono-completar');
        completar.addEventListener('click', completarTarea);

        let eliminar = document.createElement('i');
        eliminar.classList.add('bi', 'bi-trash3-fill', 'icono-eliminar');
        eliminar.addEventListener('click', eliminarTarea);

        iconos.append(completar, eliminar);

        listaDeTarea.appendChild(tareaNueva);

        input.value = ''; 
    } else {
        alert('Por favor ingresa una tarea');
    }
}

function completarTarea(e) {
    let tarea = e.target.parentNode.parentNode;
    tarea.classList.toggle('tarea-completa');
}

function eliminarTarea(e) {
    let tarea = e.target.parentNode.parentNode;
    tarea.remove();
}

formulario.addEventListener('submit', agregarTarea);
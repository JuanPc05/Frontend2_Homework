const input = document.getElementById('ingresar-tarea');
const formulario = document.getElementById('formulario-tarea'); 
const listaDeTarea = document.getElementById('lista-de-tareas');

const CLAVE_STORAGE = 'tareas';

function obtenerTareasGuardadas() {
    const datos = localStorage.getItem(CLAVE_STORAGE);
    return datos ? JSON.parse(datos) : [];
}

function guardarTareas() {
    const tareas = [];
    document.querySelectorAll('.tarea').forEach(tareaEl => {
        tareas.push({
            texto: tareaEl.querySelector('p').innerText,
            completada: tareaEl.classList.contains('tarea-completa')
        });
    });
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(tareas));
}

function crearElementoTarea(texto, completada = false) {
    let tareaNueva = document.createElement('div');
    tareaNueva.classList.add('tarea');
    if (completada) tareaNueva.classList.add('tarea-completa');

    let parrafo = document.createElement('p');
    parrafo.innerText = texto;
    tareaNueva.appendChild(parrafo);

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

    return tareaNueva;
}

function agregarTarea(evento) {
    evento.preventDefault(); 

    if (input.value) {
        const tareaNueva = crearElementoTarea(input.value, false);
        listaDeTarea.appendChild(tareaNueva);

        input.value = ''; 
        guardarTareas();
    } else {
        alert('Por favor ingresa una tarea');
    }
}

function completarTarea(e) {
    let tarea = e.target.parentNode.parentNode;
    tarea.classList.toggle('tarea-completa');
    guardarTareas();
}

function eliminarTarea(e) {
    let tarea = e.target.parentNode.parentNode;
    tarea.remove();
    guardarTareas();
}


function cargarTareas() {
    const tareasGuardadas = obtenerTareasGuardadas();
    tareasGuardadas.forEach(({ texto, completada }) => {
        const tareaEl = crearElementoTarea(texto, completada);
        listaDeTarea.appendChild(tareaEl);
    });
}

formulario.addEventListener('submit', agregarTarea);
cargarTareas(); 
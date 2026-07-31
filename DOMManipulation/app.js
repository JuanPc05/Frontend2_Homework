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
    tareaNueva.draggable = true;
    if (completada) tareaNueva.classList.add('tarea-completa');

    tareaNueva.addEventListener('dragstart', arrastreInicio);
    tareaNueva.addEventListener('dragover', arrastreEncima);
    tareaNueva.addEventListener('drop', arrastreSoltar);
    tareaNueva.addEventListener('dragend', arrastreFin);

    let parrafo = document.createElement('p');
    parrafo.innerText = texto;
    parrafo.addEventListener('dblclick', editarTarea);
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

function editarTarea(e) {
    const parrafo = e.target;
    const textoOriginal = parrafo.innerText;

    const inputEdicion = document.createElement('input');
    inputEdicion.type = 'text';
    inputEdicion.classList.add('input-edicion');
    inputEdicion.value = textoOriginal;

    parrafo.replaceWith(inputEdicion);
    inputEdicion.focus();
    inputEdicion.select();

    function guardarEdicion() {
        const nuevoTexto = inputEdicion.value.trim();
        parrafo.innerText = nuevoTexto ? nuevoTexto : textoOriginal;
        inputEdicion.replaceWith(parrafo);
        guardarTareas();
    }

    inputEdicion.addEventListener('blur', guardarEdicion);

    inputEdicion.addEventListener('keydown', (evento) => {
        if (evento.key === 'Enter') {
            evento.preventDefault();
            inputEdicion.blur();
        }
        if (evento.key === 'Escape') {
            inputEdicion.value = textoOriginal;
            inputEdicion.blur();
        }
    });
}

let elementoArrastrado = null;

function arrastreInicio(e) {
    elementoArrastrado = e.currentTarget; 
    e.currentTarget.classList.add('arrastrando');
}

function arrastreEncima(e) {
    e.preventDefault(); 

    const tareaEncima = e.currentTarget;
    if (tareaEncima === elementoArrastrado) return;

    const rect = tareaEncima.getBoundingClientRect();
    const mitad = rect.top + rect.height / 2;

    if (e.clientY < mitad) {
        tareaEncima.before(elementoArrastrado); 
    } else {
        tareaEncima.after(elementoArrastrado); 
    }
}

function arrastreSoltar(e) {
    e.preventDefault();
    guardarTareas(); 
}

function arrastreFin(e) {
    e.currentTarget.classList.remove('arrastrando');
    elementoArrastrado = null;
}

formulario.addEventListener('submit', agregarTarea);
cargarTareas(); 
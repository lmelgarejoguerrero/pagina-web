const formTurno = document.getElementById('form-turno');
const btnAgendar = document.getElementById('btn-agendar');
const listaTurnos = document.getElementById('turnos');
const alerta = document.createElement('div');

let turnos = JSON.parse(localStorage.getItem('turnos')) || [];

function cargarTurnos() {
    listaTurnos.innerHTML = '';
    turnos.forEach(turno => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${turno.nombre}</strong> - ${turno.servicio} - ${turno.fecha} ${turno.hora} <button class="btn-eliminar" data-index="${turnos.indexOf(turno)}">X</button>`;
        listaTurnos.appendChild(li);
    });
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', eliminarTurno);
    });
}

function agregarTurno(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const servicio = document.getElementById('servicio').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    if (nombre && email && servicio && fecha && hora) {
        const nuevoTurno = { nombre, email, telefono, servicio, fecha, hora };
        turnos.push(nuevoTurno);
        localStorage.setItem('turnos', JSON.stringify(turnos));
        formTurno.reset();
        cargarTurnos();
        mostrarAlerta('Turno agendado con éxito');
    } else {
        mostrarAlerta('Por favor, completa todos los campos obligatorios', 'danger');
    }
}

function eliminarTurno(event) {
    const index = event.target.getAttribute('data-index');
    turnos.splice(index, 1);
    localStorage.setItem('turnos', JSON.stringify(turnos));
    cargarTurnos();
}

function mostrarAlerta(mensaje, tipo = 'success') {
    alerta.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">${mensaje}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
    document.body.prepend(alerta);
    setTimeout(() => alerta.innerHTML = '', 3000);
}

btnAgendar.addEventListener('click', agregarTurno);
cargarTurnos();
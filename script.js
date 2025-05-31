const formTurno = document.getElementById('form-turno');
const btnAgendar = document.getElementById('btn-agendar');
const btnCancelar = document.getElementById('btn-cancelar');
const btnTexto = document.getElementById('btn-texto');
const listaTurnos = document.getElementById('turnos');
const contadorTurnos = document.getElementById('contador-turnos');
const mensajeSinTurnos = document.getElementById('mensaje-sin-turnos');

let turnos = [];
let editandoIndex = -1;

function cargarTurnos() {
    const turnosGuardados = localStorage.getItem('turnos');
    if (turnosGuardados) {
        turnos = JSON.parse(turnosGuardados);
    }
    mostrarTurnos();
}

function mostrarTurnos() {
    listaTurnos.innerHTML = '';
    contadorTurnos.textContent = turnos.length;
    
    if (turnos.length === 0) {
        mensajeSinTurnos.style.display = 'block';
        return;
    }
    
    mensajeSinTurnos.style.display = 'none';
    
    for (let i = 0; i < turnos.length; i++) {
        const turno = turnos[i];
        const li = document.createElement('li');
        li.className = 'turno-item';
        
        li.innerHTML = `
            <div class="turno-nombre">${turno.nombre}</div>
            <div class="turno-detalles">
                <i class="fas fa-spa"></i> ${turno.servicio}
            </div>
            <div class="turno-detalles">
                <i class="fas fa-calendar"></i> ${turno.fecha}
            </div>
            <div class="turno-detalles">
                <i class="fas fa-clock"></i> ${turno.hora}
            </div>
            <div class="turno-detalles">
                <i class="fas fa-envelope"></i> ${turno.email}
            </div>
            <div class="turno-acciones">
                <button class="btn-editar" onclick="editarTurno(${i})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-eliminar" onclick="eliminarTurno(${i})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;
        
        listaTurnos.appendChild(li);
    }
}

function agendarTurno(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const servicio = document.getElementById('servicio').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    if (!nombre || !email || !servicio || !fecha || !hora) {
        alert('Por favor, completá todos los campos obligatorios');
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        alert('Por favor, ingresá un email válido');
        return;
    }

    const hoy = new Date();
    const fechaSeleccionada = new Date(fecha);
    if (fechaSeleccionada < hoy) {
        alert('No podés agendar turnos en fechas pasadas');
        return;
    }

    for (let i = 0; i < turnos.length; i++) {
        if (i === editandoIndex) continue;
        const turnoExistente = turnos[i];
        if (turnoExistente.servicio === servicio && turnoExistente.fecha === fecha && turnoExistente.hora === hora) {
            alert('Ya existe un turno para ese servicio en esa fecha y hora');
            return;
        }
    }

    const turno = {
        nombre: nombre,
        email: email,
        telefono: telefono,
        servicio: servicio,
        fecha: fecha,
        hora: hora
    };

    if (editandoIndex >= 0) {
        turnos[editandoIndex] = turno;
        alert('Turno actualizado correctamente');
        cancelarEdicion();
    } else {
        turnos.push(turno);
        alert('Turno agendado correctamente');
    }

    localStorage.setItem('turnos', JSON.stringify(turnos));
    
    formTurno.reset();
    mostrarTurnos();
}

function editarTurno(index) {
    const turno = turnos[index];
    
    document.getElementById('nombre').value = turno.nombre;
    document.getElementById('email').value = turno.email;
    document.getElementById('telefono').value = turno.telefono;
    document.getElementById('servicio').value = turno.servicio;
    document.getElementById('fecha').value = turno.fecha;
    document.getElementById('hora').value = turno.hora;
    
    editandoIndex = index;
    btnTexto.textContent = 'Actualizar turno';
    btnCancelar.style.display = 'block';
}

function cancelarEdicion() {
    editandoIndex = -1;
    btnTexto.textContent = 'Agendar turno';
    btnCancelar.style.display = 'none';
    formTurno.reset();
}

function eliminarTurno(index) {
    const turno = turnos[index];
    
    if (confirm('¿Estás seguro de eliminar el turno de ' + turno.servicio + '?')) {
        turnos.splice(index, 1);
        localStorage.setItem('turnos', JSON.stringify(turnos));
        mostrarTurnos();
        
        if (editandoIndex === index) {
            cancelarEdicion();
        }
    }
}

btnAgendar.addEventListener('click', agendarTurno);
btnCancelar.addEventListener('click', cancelarEdicion);

document.addEventListener('DOMContentLoaded', function() {
    cargarTurnos();
    
    const hoy = new Date();
    const fechaHoy = hoy.getFullYear() + '-' + 
            String(hoy.getMonth() + 1).padStart(2, '0') + '-' + 
            String(hoy.getDate()).padStart(2, '0');
    document.getElementById('fecha').setAttribute('min', fechaHoy);
});
import { obtenerResumenDashboard, obtenerUsuarioActual } from './datos.js';

const [resumen, usuarioActual] = await Promise.all([
    obtenerResumenDashboard(),
    obtenerUsuarioActual(),
]);
const formatoNumero = new Intl.NumberFormat('es-MX');

document.getElementById('kilos-recuperados').textContent = formatoNumero.format(resumen.kilosRecuperados);
document.getElementById('familias-activas').textContent = formatoNumero.format(resumen.familiasBeneficiadas);
document.getElementById('donaciones-pendientes').textContent = formatoNumero.format(resumen.donacionesPendientes);
document.getElementById('productos-por-caducar').textContent = formatoNumero.format(resumen.productosPorCaducar);
document.getElementById('user-fullname').textContent = usuarioActual.nombre;
document.getElementById('user-role').textContent = usuarioActual.nombreRol;

const iniciales = usuarioActual.nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(nombre => nombre[0])
    .join('')
    .toLocaleUpperCase('es-MX');
document.getElementById('user-initials').textContent = iniciales;

const ahora = new Date();
const hora = ahora.getHours();
const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';
const nombre = usuarioActual.nombre.trim().split(/\s+/)[0];
const fecha = new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
}).format(ahora);

document.getElementById('dashboard-greeting').textContent = `${saludo}, ${nombre}`;
document.getElementById('dashboard-date').textContent = fecha;

const sidebarToggle = document.getElementById('toggle-sidebar-btn');
sidebarToggle.addEventListener('click', () => {
    const collapsed = document.body.classList.toggle('home-layout--sidebar-collapsed');
    sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
    sidebarToggle.setAttribute('aria-label', collapsed ? 'Expandir menú' : 'Contraer menú');
    sidebarToggle.firstElementChild.textContent = collapsed ? '›' : '‹';
});

const CLAVE = 'sesion'

export function guardarSesion(token, usuario) {
    localStorage.setItem(CLAVE, JSON.stringify({ token, usuario }))
}

function leerSesion() {
    const texto = localStorage.getItem(CLAVE)
    return texto ? JSON.parse(texto) : null
}

export function obtenerToken() {
    return leerSesion()?.token ?? null
}

export function obtenerUsuario() {
    return leerSesion()?.usuario ?? null
}

export function cerrarSesion() {
    localStorage.removeItem(CLAVE)
    location.href = 'login.html'
}
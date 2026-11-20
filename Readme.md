# NutriComunidad

NutriComunidad es una aplicación web para apoyar la gestión comunitaria de alimentos, inventario, donaciones y familias beneficiarias. Reúne en un mismo lugar un resumen de actividad y pantallas para consultar y administrar información.

> **Estado del proyecto:** en desarrollo. Algunas funciones utilizan datos de prueba en el navegador; el login no autentica credenciales y todavía no hay una base de datos de producción conectada.

## Integrantes

- **Jahdai Basebét de la Rosa Hernandez** — <axtchdz@gmail.com>
- **Jaime Ivan Sanchez Romero** — <sancehzrjaimei@gmail.com>

## Despliegue

- **Vercel:** pendiente de despliegue. Agregar aquí la URL cuando la aplicación esté publicada.

## Pantallas y navegación

| Pantalla | Archivo | Descripción |
|---|---|---|
| Inicio | [`index.html`](./index.html) | Página de presentación y formulario de registro. |
| Iniciar sesión | [`login.html`](./login.html) | Formulario con validación HTML básica. Al enviarlo, navega al dashboard; no comprueba las credenciales contra un servidor. |
| Resumen | [`home.html`](./home.html) | Dashboard con saludo, fecha, indicadores y menú lateral contraíble. |
| Usuarios y beneficiarios | [`usuarios.html`](./usuarios.html) | Directorio con búsqueda, filtros, indicadores, creación de usuarios y solicitudes de apoyo. |
| Alimentos e inventario | [`alimentos.html`](./alimentos.html) | Catálogo con búsqueda, filtros, estadísticas, paginación y acciones para agregar, consultar y editar alimentos. |
| Detalle de alimento | [`alimento-detalle.html`](./alimento-detalle.html) | Vista individual del alimento solicitado por su identificador. |
| Formulario de alimento | [`alimento-form.html`](./alimento-form.html) | Formulario independiente para agregar o editar un alimento. Las acciones también se pueden realizar desde modales en el listado. |

El sidebar y el encabezado del dashboard se reutilizan como parciales en las pantallas de los módulos.

## Funcionalidades

### Inicio de sesión y registro

- Los formularios utilizan validaciones HTML como campos obligatorios y formato de correo.
- El formulario de inicio de sesión lleva a `home.html` al enviarse.
- No existe autenticación real, gestión de sesiones ni verificación de contraseñas en un backend.

### Dashboard

- Presenta el saludo según la hora local del dispositivo y la fecha actual.
- Muestra el perfil de un usuario de ejemplo, incluidas sus iniciales y rol.
- Presenta indicadores de alimentos recuperados, familias beneficiadas, donaciones pendientes y productos por caducar.
- Incluye un menú lateral contraíble que conserva sus iconos cuando está plegado.

### Usuarios y beneficiarios

- Muestra un directorio con búsqueda y filtros por colonia y estado.
- Presenta indicadores de usuarios, personas activas e integrantes beneficiados.
- Incluye formularios para agregar usuarios y enviar solicitudes de apoyo.
- El frontend intenta comunicarse con endpoints locales de desarrollo y usa datos en memoria como alternativa cuando no hay conexión.

### Alimentos e inventario

- Muestra alimentos con categoría, unidad de medida, calorías, proteínas, carbohidratos, estado y acciones.
- Permite buscar por nombre o descripción y filtrar por categoría y estado.
- Incluye estadísticas, paginación y un mensaje cuando no hay resultados.
- Permite agregar alimentos, consultar su detalle y editar registros. Estas acciones se pueden abrir como modales sobre la lista.
- Valida campos obligatorios y valores nutricionales no negativos.
- Guarda los cambios en `localStorage`, de modo que persistan en el mismo navegador entre recargas.
- Incluye categorías y alimentos iniciales de ejemplo.

## Tecnologías

- HTML5
- CSS3
- JavaScript con módulos ES (`type="module"`)
- Vite para el servidor de desarrollo y la compilación
- `localStorage` para guardar el catálogo local de Alimentos

No se instalaron librerías de componentes para la interfaz.

## Requisitos

- Node.js y npm instalados.
- Un navegador web actualizado.

## Instalación y ejecución

Desde la carpeta raíz del repositorio:

```bash
npm install
npm run dev
```

Abre en el navegador la dirección local que muestra Vite en la terminal. **No abras las páginas directamente con `file://`**: Vite procesa los parciales del sidebar y del encabezado.

## Compilación y vista previa

Para generar la compilación de producción:

```bash
npm run build
```

Los archivos compilados se generan en `dist/`. Para servirlos localmente:

```bash
npm run preview
```

## Estructura del proyecto

```text
Nutricom/
├── index.html
├── login.html
├── home.html
├── usuarios.html
├── alimentos.html
├── alimento-detalle.html
├── alimento-form.html
├── src/
│   ├── css/
│   │   ├── normalize.css
│   │   ├── global.css
│   │   ├── index.css
│   │   ├── login.css
│   │   ├── home.css
│   │   ├── usuarios.css
│   │   ├── alimentos.css
│   │   ├── alimento-detalle.css
│   │   └── alimento-form.css
│   ├── js/
│   │   ├── datos.js
│   │   ├── index.js
│   │   ├── home.js
│   │   ├── usuarios.js
│   │   ├── alimentos.js
│   │   ├── alimento-detalle.js
│   │   └── alimento-form.js
│   └── partials/
│       ├── homesidebar.html
│       ├── homeheader.html
│       └── footer.html
├── package.json
└── vite.config.js
```

## Datos y servicios

- `src/js/datos.js` contiene datos de prueba y funciones que usan el dashboard y los módulos.
- El catálogo de Alimentos utiliza `localStorage`; los cambios son locales al navegador y no se comparten entre usuarios o dispositivos.
- El módulo de Usuarios tiene una integración de frontend orientada a endpoints locales. Sin backend, algunas operaciones recurren a datos en memoria, que se pierden al recargar la página.
- Las restricciones de acceso según el rol aún no están implementadas. Ocultar elementos en la interfaz no sustituye los controles de autorización del servidor.

## Estilos y convenciones

- `src/css/normalize.css` reduce las diferencias entre estilos predeterminados de los navegadores.
- `src/css/global.css` importa Normalize y define reglas base, tipografía, colores y variables reutilizables.
- Los módulos tienen archivos CSS propios para sus estilos específicos.
- Las clases del dashboard y de Alimentos siguen la metodología BEM: bloque, elemento (`__`) y modificador (`--`).
- Vite usa una configuración multipágina y reemplaza las etiquetas `<include>` por el contenido de `src/partials/`.

## Limitaciones conocidas

- No hay base de datos de producción conectada.
- El login no autentica ni verifica las credenciales.
- Los datos de prueba de usuarios y solicitudes pueden ser volátiles cuando se guardan en memoria.
- Los datos de Alimentos se guardan únicamente en el almacenamiento local del navegador.
- La autorización real por rol debe implementarse y verificarse en el backend.
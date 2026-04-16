# Evaluación Técnica: Gestión de Clientes y Pólizas - Frontend

Este repositorio contiene la solución del lado del cliente (Frontend) para el reto técnico de desarrolladores **Senior**. La aplicación está construida con Angular y se enfoca en proporcionar una interfaz intuitiva, segura y eficiente para la gestión de seguros.

---

## 1. Resumen del Proyecto

### 1.1 Objetivo
Desarrollar una aplicación robusta que permita la gestión integral de clientes y sus pólizas de seguro, diferenciando las capacidades según el rol del usuario (Administrador o Cliente), siguiendo las mejores prácticas de desarrollo frontend.

### 1.2 Objetivos Específicos
- **Arquitectura Limpia:** Uso de componentes independientes (Standalone Components) y una estructura de carpetas organizada por módulos funcionales.
- **Gestión de Estado:** Implementación de **NGXS** para manejar el estado de la aplicación de forma predecible.
- **Seguridad:** Sistema de autenticación basado en JWT para diferenciar el acceso entre Administradores y Clientes.
- **Interfaz de Usuario:** Diseño responsivo y amigable utilizando Bootstrap 5 y PrimeNG.
- **Validaciones:** Control estricto de formularios para asegurar la integridad de los datos antes de enviarlos al backend.
- **Rendimiento:** Optimización de bundles y carga perezosa (Lazy Loading) de rutas.

---

## 2. Requisitos del Negocio Implementados

### 2.1 Roles de la Aplicación
1.  **Administrador:** Acceso total para gestionar clientes y emitir pólizas.
2.  **Cliente:** Acceso restringido para consultar sus propias pólizas, solicitar cancelaciones y actualizar sus datos de contacto.

### 2.2 Historias de Usuario (Frontend)

#### Como Administrador:
- **Gestión de Clientes:** Vistas para el registro, edición, listado y eliminación de clientes.
    - *Validaciones:* Control de 10 dígitos para identificación, formato de correo y restricciones de caracteres en nombres.
- **Gestión de Pólizas:** Formulario para asociar pólizas (Vida, Automóvil, Salud, Hogar) a clientes existentes.
    - *Validaciones:* La fecha de expiración debe ser posterior a la de inicio; el monto debe ser positivo.
- **Filtros Avanzados:** Buscadores en tiempo real para clientes (nombre/ID/correo) y pólizas (tipo/estado/fechas).

#### Como Cliente:
- **Registro y Acceso Inicial:** Una vez que el Administrador registra a un nuevo cliente (o se solicita un reseteo de clave), el usuario deberá iniciar sesión utilizando su **número de identificación (cédula)** tanto para el campo de usuario como para la contraseña inicial. Posteriormente, el sistema le permitirá crear su contraseña personal.
- **Mis Pólizas:** Tablero para visualizar pólizas activas y canceladas.
- **Cancelación:** Funcionalidad para solicitar la cancelación de pólizas vigentes de forma inmediata.
- **Perfil:** Sección dedicada para actualizar dirección y teléfono.

---

## 3. Arquitectura y Tecnologías

### 3.1 Stack Tecnológico
- **Framework:** Angular 19+ (Standalone)
- **Gestión de Estado:** NGXS
- **Estilos:** Bootstrap 5, PrimeFlex, PrimeIcons
- **Seguridad:** JWT (Almacenamiento seguro y decodificación para manejo de roles)
- **Comunicación:** HttpClient con Interceptores para adjuntar tokens y manejar errores de forma global.

### 3.2 Estructura del Proyecto
- `src/app/core`: Singleton services, modelos globales, interceptores, guards y la definición del estado (NGXS).
- `src/app/features`: Módulos de página (Auth, Admin, Client) con sus propios componentes y rutas.
- `src/app/shared`: Componentes reutilizables, directivas y pipes.
- `src/environments`: Configuración de URLs de API para diferentes entornos.

---

## 4. Instalación y Ejecución

### Requisitos Previos
- **Node.js:** v18.x o superior.
- **NPM:** v9.x o superior.
- **Backend:** Debe estar en ejecución (Local: `http://localhost:8080` o Producción).

### Pasos para Ejecutar
1.  **Clonar el repositorio.**
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Configuración de API (Opcional):**
    Verificar el archivo `src/environments/environment.ts` para asegurar que apunta a la URL correcta del backend.
4.  **Iniciar la aplicación:**
    ```bash
    npm start
    ```
    La aplicación se abrirá en `http://localhost:4200`.

---

## 5. Despliegue y URL de Producción

La aplicación se encuentra desplegada y lista para ser evaluada en:
- **URL Frontend:** [https://frontend-zproject-production.up.railway.app/auth/login](https://frontend-zproject-production.up.railway.app/auth/login)

### Credenciales de Prueba
- **Admin:** Usuario: `admin` | Contraseña: `admin123`
- **Cliente:** Usuario: `client` | Contraseña: `client123`

---

## 6. Documentación Adicional
- El proceso de construcción utiliza presupuestos (budgets) optimizados en `angular.json` para manejar el tamaño de los bundles de producción.
- Se implementó **Git Flow** durante el desarrollo para mantener un historial de cambios limpio y organizado.

# Módulo de Seguros - Frontend Angular

Esta aplicación permite la gestión de clientes y pólizas de seguro, con vistas diferenciadas para Administradores y Clientes.

## Tecnologías Utilizadas
- **Angular 21** (Standalone Components)
- **NGXS** (Gestión de Estado)
- **Bootstrap 5** (Interfaz de Usuario)
- **JWT Decode** (Manejo de tokens)
- **HttpClient** (Consumo de API con Interceptores)

## Requisitos Previos
- Node.js v18+
- Backend ejecutándose en `http://localhost:8080`

## Instalación y Configuración

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Ejecutar la aplicación:
   ```bash
   npm start
   ```
   La aplicación estará disponible en `http://localhost:4200`.

## Roles y Credenciales de Prueba (Ejemplo)
- **Admin**: user: `admin`, pass: `admin123`
- **Cliente**: user: `client`, pass: `client123`

## Funcionalidades Implementadas

### Administrador
- **Gestión de Clientes**: Crear, editar, listar y eliminar clientes.
- **Filtros**: Búsqueda por nombre, email e identificación.
- **Emisión de Pólizas**: Formulario con validaciones de fechas y montos.
- **Reportes**: Visualización de todas las pólizas con filtros por tipo y estado.

### Cliente
- **Mis Pólizas**: Vista resumida de pólizas activas y canceladas.
- **Cancelación**: Opción para cancelar pólizas activas.
- **Perfil**: Actualización de teléfono y dirección de contacto.

## Estructura del Proyecto
- `src/app/core`: Servicios, modelos, interceptores, guards y estado (NGXS).
- `src/app/features`: Módulos funcionales (Auth, Admin, Client).
- `src/app/shared`: Componentes comunes como el Layout.

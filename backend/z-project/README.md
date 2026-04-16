# Gestión de Clientes y Pólizas de Seguro - Backend

Este proyecto es el backend de una aplicación para gestionar clientes y sus pólizas de seguro, implementado con **Spring Boot** y siguiendo una **Arquitectura Hexagonal (Puertos y Adaptadores)**.

## Requisitos
*   Java 21
*   Maven

## Estructura del Proyecto
El proyecto sigue la arquitectura hexagonal para aislar la lógica de negocio de los detalles de infraestructura:

*   `domain`: Contiene las entidades de negocio, puertos (interfaces) y excepciones.
*   `application`: Contiene los casos de uso (lógica de orquestación), DTOs y mappers.
*   `infrastructure`: Contiene los adaptadores (controladores REST, repositorios en memoria, configuración).

## Cómo construir y ejecutar
1.  Clonar el repositorio.
2.  Abrir una terminal en la raíz del proyecto.
3.  Ejecutar el siguiente comando para construir el proyecto:
    ```bash
    ./mvnw clean install
    ```
4.  Ejecutar la aplicación:
    ```bash
    ./mvnw spring-boot:run
    ```

## Documentación API (Swagger)
Una vez iniciada la aplicación, puedes acceder a la interfaz de Swagger para probar los endpoints:
`http://localhost:8080/swagger-ui.html`

## Roles y Funcionalidades
### Administrador
*   **Gestión de Clientes:** Crear, editar, listar, eliminar y buscar clientes.
*   **Gestión de Pólizas:** Asociar pólizas a clientes, filtrar pólizas.

### Cliente
*   **Gestión de Pólizas:** Consultar sus pólizas y solicitar la cancelación de una póliza activa.
*   **Información Personal:** Puede editar su dirección y teléfono (vía endpoint de actualización de cliente).

## Validaciones Implementadas
*   **Clientes:** 
    *   Número de identificación único de 10 dígitos.
    *   Nombre sin números ni caracteres especiales.
    *   Correo electrónico válido.
*   **Pólizas:**
    *   Fecha de expiración posterior a la de inicio.
    *   Monto asegurado positivo.
    *   Tipos permitidos: VIDA, AUTOMOVIL, SALUD, HOGAR.

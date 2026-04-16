# Evaluación Técnica: Gestión de Clientes y Pólizas - Backend

Este repositorio contiene la solución al reto técnico para desarrolladores **Senior**, enfocado en el diseño y desarrollo de un sistema robusto, escalable y mantenible para la gestión de seguros.

---

## 1. Resumen del Proyecto

### 1.1 Objetivo
Evaluar las habilidades técnicas y la capacidad de resolución de problemas en un entorno de desarrollo de software, diseñando una solución eficiente utilizando las mejores prácticas de arquitectura.

### 1.2 Objetivos Específicos
- **Código Limpio:** Escritura de código mantenible, eficiente y legible.
- **Arquitectura Hexagonal:** Implementación de un diseño basado en Puertos y Adaptadores para desacoplar la lógica de negocio.
- **Patrones de Diseño:** Uso de patrones adecuados en cada capa (DTOs, Mappers, Repositories, Use Cases).
- **Persistencia de Datos:** Diseño e interacción con bases de datos relacionales (PostgreSQL).
- **Seguridad:** Implementación de autenticación y autorización basada en roles (JWT).
- **Pruebas:** Desarrollo de pruebas unitarias y de integración para asegurar la integridad del sistema.
- **Documentación:** API documentada con Swagger/OpenAPI y proceso detallado en este README.

---

## 2. Requisitos del Negocio

### 2.1 Roles de la Aplicación
1.  **Administrador:** Puede gestionar de forma integral clientes y pólizas.
2.  **Cliente:** Puede visualizar sus pólizas, solicitar cancelaciones y actualizar su información personal.

### 2.2 Historias de Usuario Implementadas

#### Como Administrador:
- **Gestión de Clientes:** Registro, edición, listado y eliminación (borrado lógico) de clientes.
    - *Validaciones:* ID único de 10 dígitos, nombre sin caracteres especiales, correo válido.
- **Gestión de Pólizas:** Asociación de pólizas (Vida, Automóvil, Salud, Hogar) a clientes.
    - *Validaciones:* Fecha expiración > inicio, monto positivo.
- **Filtros Avanzados:** Búsqueda de clientes por nombre/ID/correo y pólizas por tipo/estado/fechas.

#### Como Cliente:
- **Consulta de Pólizas:** Visualización de pólizas activas y canceladas asociadas.
- **Cancelación:** Solicitud de cancelación de pólizas activas.
- **Perfil:** Edición de dirección y teléfono de contacto.

---

## 3. Arquitectura y Tecnologías

### 3.1 Stack Tecnológico
- **Lenguaje:** Java 21
- **Framework:** Spring Boot 3.x
- **Persistencia:** Spring Data JPA + PostgreSQL
- **Seguridad:** Spring Security + JSON Web Token (JWT)
- **Documentación:** Springdoc-openapi (Swagger UI)
- **Herramientas:** Lombok, MapStruct (o Mappers manuales), Maven

### 3.2 Diseño de Software: Arquitectura Hexagonal
La estructura del proyecto se organiza para proteger el núcleo de negocio de influencias externas:

- **Domain (Core):** Modelos de dominio (`Client`, `Policy`), Excepciones de dominio y Puertos (`IClientRepositoryOut`, etc.).
- **Application:** Casos de uso (`ClientUseCase`) que orquestan la lógica, DTOs y Mappers de entrada/salida.
- **Infrastructure:** Adaptadores de entrada (Controladores REST) y Adaptadores de salida (Repositorios JPA, Seguridad JWT).

---

## 4. Modelo de Datos Documentado

El sistema utiliza tres entidades principales para persistir la información:

### Entidad `ClientEntity`
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | Long | Clave primaria autoincremental. |
| `identificationNumber` | String | Único, 10 dígitos numéricos. |
| `fullName` | String | Nombre completo del cliente. |
| `email` | String | Correo electrónico de contacto. |
| `phoneNumber` | String | Teléfono de contacto. |
| `address` | String | Dirección de residencia. |
| `active` | boolean | Estado de borrado lógico. |

### Entidad `PolicyEntity`
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | Long | Clave primaria autoincremental. |
| `clientId` | Long | Relación con el cliente. |
| `type` | Enum | VIDA, AUTOMOVIL, SALUD, HOGAR. |
| `startDate` | LocalDate | Fecha de inicio de vigencia. |
| `expirationDate` | LocalDate | Fecha de fin de vigencia. |
| `insuredAmount` | BigDecimal | Monto total asegurado. |
| `status` | Enum | ACTIVA, CANCELADA. |

### Entidad `UserEntity` (Seguridad)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `username` | String | Nombre de usuario para login. |
| `password` | String | Hash BCrypt de la contraseña. |
| `role` | Enum | ADMIN, CLIENT. |
| `client_id` | Long | Enlace al perfil de cliente (si aplica). |

---

## 5. Instalación y Ejecución

### Requisitos Previos
- Java 21 instalado.
- Maven 3.x o superior.
- Instancia de PostgreSQL disponible.

### Configuración
Asegúrese de configurar las variables de entorno o el archivo `application.properties` con las credenciales de su base de datos:
```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/tu_base_de_datos
SPRING_DATASOURCE_USERNAME=usuario
SPRING_DATASOURCE_PASSWORD=contraseña
```

### Ejecución
1.  Clonar el repositorio.
2.  Ejecutar el build:
    ```bash
    mvn clean install
    ```
3.  Iniciar la aplicación:
    ```bash
    mvn spring-boot:run
    ```

---

## 6. Documentación de la API

Una vez iniciada la aplicación, la documentación interactiva está disponible en:
- **Swagger UI (Entorno Local):** `http://localhost:8080/swagger-ui.html`
- **Swagger UI (Producción - Railway):** [Link a Swagger](https://backend-zproject-production.up.railway.app/swagger-ui/index.html)
- **OpenAPI Spec:** `http://localhost:8080/v3/api-docs`

---

## 7. Pruebas

Para ejecutar las pruebas unitarias y de integración:
```bash
mvn test
```
Se han implementado pruebas sobre los casos de uso críticos, validaciones de dominio y flujos de negocio para asegurar la calidad del código.

---

## 8. Extras Opcionales Implementados
- **Autenticación y Autorización:** Uso de JWT con roles diferenciados para Admin y Cliente.
- **Validaciones Personalizadas:** Uso de excepciones personalizadas para manejar errores de negocio de forma clara.
- **Arquitectura de Microservicios Ready:** El desacoplamiento permite una transición sencilla a microservicios si fuera necesario.

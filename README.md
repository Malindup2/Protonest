# Mini Task Management System
<img width="1667" height="634" alt="image" src="https://github.com/user-attachments/assets/ee147b55-3c9e-4b63-bc16-c2849eaf4b44" />


A full-stack, secured, role-based Task Management application built using **Next.js** mapped to a **Spring Boot** application using **PostgreSQL**. The complete project was orchestrated using exactly 10 distinct logical commits tracking the step-by-step functionality addition.

## Project Overview
This project permits users to seamlessly track, add, and manage their daily activities. With an implementation of JWT authentication, it ensures robust security and separation of concerns through an API-first approach.

### Features
* **JWT-Based Authentication**: Secure implementation of login/registration workflows with an interceptor pattern.
* **Role-Based Access Control**:
    * **ADMIN**: Access to a global view of all tasks active in the system across all users.
    * **USER**: Access strictly localized to their created tasks.
* **Paging, Filtering, & Sorting**: Real-time queries integrated efficiently using Spring Data JPA matching criteria across the Next.js tabular interface.
* **CRUD Endpoints**: Highly documented operations following REST standards and globally managed via `@RestControllerAdvice` exception handlers.

## Setup Instructions

### Prerequisites
* **Java 17+** 
* **Node.js (LTS version recommended)**
* **PostgreSQL Database** running locally or remotely

### Backend Setup (Spring Boot)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build the Maven project to resolve the underlying dependencies:
   ```bash
   # Windows
   ./mvnw.cmd clean install
   # or simply 'mvn clean install' if maven is globally available
   ```
3. Run the application:
   ```bash
   ./mvnw.cmd spring-boot:run
   ```
   *The server targets `http://localhost:8080/` by default.*

### Database Configuration (PostgreSQL)
A database needs to be properly orchestrated and aligned with the API layer. Ensure you create a database specifically named `taskmanager`.
By default, the `backend/src/main/resources/application.yml` is configured as follows parameters (adjust accordingly to your local pgadmin / db environment configurations):
- **URL**: `jdbc:postgresql://localhost:5432/taskmanager`
- **Username**: `postgres`
- **Password**: `password`

Spring Boot's `ddl-auto: update` configuration will naturally enforce table schemas securely upon first run but a `schema.sql` definition is included to track its logical layout.

### Frontend Setup (Next.js)
1. Open a separate terminal and traverse to the frontend repository layout:
   ```bash
   cd frontend
   ```
2. Setup NPM dependencies:
   ```bash
   npm install
   ```
3. Invoke the development environment:
   ```bash
   npm run dev
   ```
4. Access the UI application running at `http://localhost:3000/`.

## Environment Variables
Ensure settings align correctly by exporting these environmental parameters dynamically or overriding them per runtime requirements if needed:

### Backend key requirements (`application.yml`)
- `spring.datasource.username`
- `spring.datasource.password`
- `spring.datasource.url`
- `app.jwt.secret` (Must correspond to a minimum 256-bit cryptographically secure structure key)
- `app.jwt.expirationMs`

### Frontend key requirements (`.env.local`)
- `NEXT_PUBLIC_API_URL`: Points to your backend origin proxy (`http://localhost:8080/api`). It currently utilizes localhost as a fallback definition.

## API Documentation
The API documentation encapsulates automated request/response schemas available iteratively via Swagger's UI overlay. Once the backend application is successfully running, visit:
`http://localhost:8080/swagger-ui.html`

## Testing the Application Pathways
1. Register a new user choosing specifically as `USER` or `ADMIN`.
2. Following enrollment, verify auto-logins via Bearer Token injections in `Cookies`.
3. Construct generic tasks specifying specific Priorities and Statuses.
4. Interact thoroughly querying filter metrics matching `Due Date`, `In Progress` bounds, and Sorting functionalities.

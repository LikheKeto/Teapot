# Teapot - A Note-Taking Application
![image](frontend/public/demo.png)

## Table of Contents
- [Teapot - A Note-Taking Application](#teapot---a-note-taking-application)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
    - [Notes](#notes)
    - [Categories](#categories)
    - [Authentication/Authorization](#authenticationauthorization)
    - [Other Features](#other-features)
  - [Tech Stack](#tech-stack)
  - [Backend Setup](#backend-setup)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Install Dependencies](#2-install-dependencies)
    - [3. Set Up Environment Variables](#3-set-up-environment-variables)
    - [4. Migrate the Database](#4-migrate-the-database)
    - [5. Start the Backend Server](#5-start-the-backend-server)
  - [Frontend Setup](#frontend-setup)
    - [1. Install Dependencies](#1-install-dependencies)
    - [2. Set Up Environment Variables](#2-set-up-environment-variables)
    - [3. Start the Frontend Server](#3-start-the-frontend-server)
  - [Database Design](#database-design)
    - [Relationships](#relationships)
  - [Authentication](#authentication)
  - [API Documentation](#api-documentation)
  - [Tests](#tests)
  - [Logging and Error Handling](#logging-and-error-handling)
  - [Additional Features](#additional-features)
    - [Search Functionality](#search-functionality)
    - [Sorting](#sorting)
  - [Engineering Decisions](#engineering-decisions)

## Overview
Teapot is a **Note-Taking Application** that enables users to create, edit, delete, and view notes, while organizing them into categories. The application also features an authentication system with secure login and signup functionalities.

Built with **React** for the frontend, **Node.js** for the backend, and **PostgreSQL** as the relational database, Teapot offers a seamless and intuitive user experience. The application adheres to best practices in security, performance, and scalability.

## Features

### Notes
- **Create notes**: Users can create notes with titles and content.
- **Edit notes**: Users can edit existing notes.
- **Delete notes**: Users can delete their notes.
- **View list of notes**: Users can see a paginated list of their notes.
- **View a single note**: Users can view detailed information about a specific note.

### Categories
- **CRUD operations on categories**: Users can create, view, edit, and delete categories.
- **Add multiple categories to a note**: Users can assign multiple categories to a note and deassign categories.
- **Filter notes based on category**: Users can filter their notes by category.

### Authentication/Authorization
- **Signup**: Users can register by providing their email, username, and password.
- **Email verification**: After registration, users must verify their email address by following a verification link sent to their email.
- **Login**: Users can log in with their email and password. A JWT token is generated on successful login.
- **Authorization**: Pages and APIs are protected, ensuring that only authenticated users can access or modify their own data.

### Other Features
- **Search functionality**: Users can search for notes by title or content.
- **Sorting options**: Users can sort their notes by creation date, modification date, or title.

## Tech Stack

- **Frontend**: React, Vite, Tiptap (for rich text editing)
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Styling**: TailwindCSS, Flowbite-React, and Lucide (for icons)
- **Database migrations**: Node-pg-migrate
- **API Documentation**: Swagger-JSDoc
- **Authentication**: JSON Web Tokens (JWT)
- **Backend Validation**: Validate.js
- **Email Verification**: Nodemailer
- **Testing**: Jest (for unit testing), Sinon (for mocking)
- **Logger**: Winston for logging

## Backend Setup

### 1. Clone the Repository
```bash
git clone https://github.com/LikheKeto/Teapot.git
cd Teapot
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the backend directory and provide values as per the example file.

### 4. Migrate the Database
To set up the database, run migrations:
```bash
DATABASE_URL=postgres://user:password@localhost/dbname npm run migrate:up
```

### 5. Start the Backend Server
```bash
npm start
```

The backend server will start at `http://localhost:5000` (or the specified port in the `.env` file).

## Frontend Setup

### 1. Install Dependencies
Navigate to the frontend directory and install the dependencies.
```bash
cd frontend
npm install
```

### 2. Set Up Environment Variables
Create the `.env` file and set the base URL for API calls:
```env
VITE_API_ENDPOINT=http://localhost:5000
```

### 3. Start the Frontend Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Database Design

The database is designed with normalization in mind, with the following key tables:

- **users**: Stores user information (id, username, email, password, verified, verificationToken).
- **notes**: Stores notes (id, title, content, user_id, created_at, updated_at).
- **categories**: Stores categories (id, name, user_id).
- **note_categories**: Many-to-many relationship between notes and categories.

### Relationships
- A **user** can have many **notes**.
- A **user** can have many **categories**.
- A **note** can belong to many **categories**, and a **category** can have many **notes**.

## Authentication

The authentication system uses **JSON Web Tokens (JWT)** to secure the application. The process works as follows:

- **Signup**: Users provide their email, username, and password. The password is hashed and stored in the database, but the account remains unverified until email verification is completed.
- **Verification**: Upon registration, users receive an email with a verification link. Following this link marks the user as verified.
- **Login**: Users log in using their email and password. If authenticated, a JWT token is returned.
- **Authorization**: Protected routes require a valid JWT token to ensure that users can only access or modify their own data.

## API Documentation

The API documentation is generated using Swagger-JSDoc. The documentation UI can be accessed at `http://localhost:5000/api-docs` (or `/api-docs` endpoint in the backend).

## Tests

Unit tests are implemented using **Jest** and **Sinon** (for mocking). The tests cover:

- CRUD operations for notes and categories.
- Authentication and authorization mechanisms.
- API error handling.

To run the tests:
```bash
npm run test
```

## Logging and Error Handling

The application uses **Winston** for logging. All API requests, major events, and errors are logged for debugging and auditing purposes.

- Logs are stored in a file for persistence and can be accessed by the development team.
- Errors are handled gracefully, with proper status codes and error messages returned to the user.

## Additional Features

### Search Functionality
Users can search notes by title or content using the search bar. The backend supports `ILIKE` searches in the notes' title and content fields.

### Sorting
Users can sort their notes by creation date, last modified date, or title. Sorting is done on the server-side to optimize performance.

## Engineering Decisions

Here are some of the key engineering decisions that I made during the development of this project:

1. **Node-pg-migrate for migrations**: I chose to use `node-pg-migrate` to manually write migrations instead of using an ORM like Sequelize or TypeORM. This decision was made to keep things simple and avoid the overhead of an ORM, ensuring that the database schema is directly controlled.

2. **Vite for React setup**: I used **Vite** to set up the frontend instead of Create React App (CRA), as CRA is deprecated. Vite offers faster build times and better support for modern development practices, making it a more suitable choice.

3. **TailwindCSS and Flowbite-React for styling**: I decided to use **TailwindCSS** for utility-first styling and **Flowbite-React** for pre-designed components to speed up the development process. This allows for rapid iteration and a highly customizable design system.

4. **JSON Web Tokens (JWT) for authentication**: For the authentication system, I used **JWT** for stateless and secure user authentication, which provides scalability and flexibility, especially in a RESTful API context.

5. **Database design and normalization**: I focused on proper database normalization to ensure data integrity and reduce redundancy. This helps in managing large datasets and maintaining performance.

6. **Error handling and logging**: I incorporated **Winston** for logging to monitor the application’s behavior in real-time. Error handling ensures that all errors are caught and logged properly, providing a smooth user experience even in case of issues.


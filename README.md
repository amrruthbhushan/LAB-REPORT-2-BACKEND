# Lab 2: SQLite Database and CRUD Routes

**Student Name:** Amrruth Bhushan  
**Registration Number:** [Enter your registration number]  
**Section:** [Enter your section]  
**Branch:** AI & Data Engineering  
**Campus:** NIAT Aurora  
**Subject:** Backend Development Fundamentals  


## Live Deployment

**Live API:** https://lab-report-2-backend.onrender.com/

**GitHub Repository:** https://github.com/amrruthbhushan/LAB-REPORT-2-BACKEND

## 1. Project Overview

This project implements a RESTful Books Library API using Node.js, Express.js and SQLite.

The application connects an Express server to an SQLite relational database and supports all five CRUD operations:

- Create a new book.
- Retrieve all books.
- Retrieve a specific book.
- Update an existing book.
- Delete a book.

The project uses asynchronous database operations and parameterized SQL queries to ensure safe database interactions.

## 2. Technologies Used

- Node.js
- Express.js
- SQLite
- sqlite3
- sqlite
- Nodemon
- Postman
- Git and GitHub
- Render (Deployment)

## 3. Project Structure

```text
lab-02/
│
├── app.js
├── package.json
├── package-lock.json
├── README.md
├── VIVA.md
├── .gitignore
├── .env.example
├── lab02-postman-collection.json
│
├── config/
│   └── database.js
│
├── booksData/
│   └── library.db
│
└── screenshots/
```

## 4. Database Schema

**Database:** library.db  
**Table:** book

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| title | TEXT | Book title |
| author | TEXT | Author name |
| price | INTEGER | Book price |
| pages | INTEGER | Number of pages |

The database contains sample book records for testing CRUD operations.

## 5. Installation and Setup

### Prerequisites

- Node.js installed
- npm installed
- Git installed
- Postman (for API testing)

### Clone the repository

```bash
git clone https://github.com/amrruthbhushan/LAB-REPORT-2-BACKEND.git
```

### Navigate to the project

```bash
cd LAB-REPORT-2-BACKEND/lab-02
```

### Install dependencies

```bash
npm install
```

### Environment Variables

The application uses the following environment variable:

```env
PORT=3000
```

The application uses port 3000 by default if PORT is not configured.

### Start the development server

```bash
npm run dev
```

### Start the production server

```bash
npm start
```

## 6. API Endpoints

Base URL:

`https://lab-report-2-backend.onrender.com`

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/books/` | Retrieve all books |
| GET | `/books/:bookId/` | Retrieve a book by ID |
| POST | `/books/` | Add a new book |
| PUT | `/books/:bookId/` | Update an existing book |
| DELETE | `/books/:bookId/` | Delete a book |

### Sample POST Request

**Endpoint:** `/books/`

```json
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "price": 450,
  "pages": 320
}
```

### Sample PUT Request

**Endpoint:** `/books/1/`

```json
{
  "title": "Updated Book",
  "author": "Updated Author",
  "price": 500,
  "pages": 350
}
```

## 7. Error Handling and Security

- Parameterized SQL queries using `?` placeholders.
- Input validation for API requests.
- HTTP status codes for successful and unsuccessful requests.
- 404 responses for books that do not exist.
- Database connection error handling.
- Protection against SQL injection through parameterized queries.

## 8. Screenshots

Add the actual Postman screenshots to the `screenshots/` folder and use the following references.

### GET All Books

![GET All Books](screenshots/get-all-books.png)

### GET Single Book

![GET Single Book](screenshots/get-single-book.png)

### POST Create Book

![POST Create Book](screenshots/post-create-book.png)

### PUT Update Book

![PUT Update Book](screenshots/put-update-book.png)

### DELETE Book

![DELETE Book](screenshots/delete-book.png)

### Database Verification

![SQLite Database](screenshots/database-view.png)

## 9. Deployment

The application is deployed using Render.

**Live URL:** https://lab-report-2-backend.onrender.com/

The Render service uses Node.js with the following configuration:

- Root Directory: `lab-02`
- Build Command: `npm install`
- Start Command: `npm start`

**SQLite persistence note:** Render's free instance uses an ephemeral filesystem. Database changes may not survive service restarts or redeployments unless persistent storage is configured.

## 10. Problems Faced and Solutions

1. **Database connection:** Used asynchronous initialization to ensure the database connects before the server starts.

2. **SQL injection prevention:** Used parameterized queries with placeholders.

3. **Server restart:** Configured Nodemon for automatic server restarts during development.

4. **Deployment configuration:** Configured the Render root directory to `lab-02` so the deployment process can locate package.json.

5. **Database persistence:** Documented the limitations of temporary hosting storage.

## 11. Learning Outcomes

- Understanding SQLite database integration with Express.js.
- Implementing REST API endpoints.
- Performing CRUD operations.
- Understanding asynchronous programming using async/await.
- Using parameterized SQL queries.
- Testing APIs using Postman.
- Deploying a Node.js backend application using Render.

## 12. Viva Preparation

Refer to [VIVA.md](VIVA.md) for explanations of the important concepts and lab viva questions.

---

**Lab 2 Submission – Backend Development Fundamentals**  
**Developed by: Amrruth Bhushan**

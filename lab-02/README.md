# Lab 2 — SQLite Database and CRUD Routes

> **Subject:** Backend Development Fundamentals  
> **Academic Year:** Year II, Term II  
> **Campus:** NIAT Aurora  
> **Faculty:** Joel Prashanth D

---

## Student Details

| Field               | Value                  |
|---------------------|------------------------|
| **Student Name**    | Amrruth Bhushan        |
| **Registration No.**| *(Fill your Reg. No.)* |
| **Section**         | *(Fill your Section)*  |
| **Branch**          | AI & Data Engineering  |

---

## Project Overview

This project is a fully functional **REST API** built with **Node.js** and **Express.js**, connected to a local **SQLite** database (`library.db`). It supports all five **CRUD** operations on a **Books Library**, allowing you to:

- 📖 **Create** a new book record
- 📚 **Read** all books or a specific book
- ✏️ **Update** an existing book's details
- 🗑️ **Delete** a book from the database

All SQL queries use **parameterized statements** (placeholders `?`) to prevent SQL Injection attacks.

---

## Technology Stack

| Technology   | Purpose                              |
|--------------|--------------------------------------|
| Node.js      | Runtime environment                  |
| Express.js   | Web framework / routing              |
| SQLite       | Lightweight relational database      |
| sqlite3      | Native SQLite bindings for Node.js   |
| sqlite       | Promise-based wrapper over sqlite3   |
| dotenv       | Environment variable management      |
| Nodemon      | Auto-restart server in development   |
| Postman      | API testing                          |
| Git/GitHub   | Version control                      |

---

## Project Folder Structure

```
lab-02/
│
├── app.js                        ← Main Express server + all 5 CRUD routes
├── package.json                  ← Dependencies and npm scripts
├── package-lock.json             ← Locked dependency versions
├── .gitignore                    ← Ignores node_modules, .env, logs
├── .env.example                  ← Example environment variables
├── README.md                     ← This file
├── VIVA.md                       ← Viva Q&A answers
├── lab02-postman-collection.json ← Importable Postman collection
│
├── config/
│   └── database.js               ← Database connection, table creation, seed
│
├── booksData/
│   └── library.db                ← SQLite database file (auto-created)
│
└── screenshots/
    └── (Postman testing screenshots)
```

---

## Database Schema

**Database:** `booksData/library.db`  
**Table:** `book`

| Column   | Type    | Constraint              |
|----------|---------|-------------------------|
| `id`     | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `title`  | TEXT    | NOT NULL                |
| `author` | TEXT    | NOT NULL                |
| `price`  | INTEGER | NOT NULL                |
| `pages`  | INTEGER | NOT NULL                |

---

## Installation Instructions

### Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Postman](https://www.postman.com/) for API testing

### Steps

**1. Navigate to the project directory:**

```bash
cd lab-02
```

**2. Install all dependencies:**

```bash
npm install
```

**3. (Optional) Set up environment variables:**

```bash
copy .env.example .env
```

Edit `.env` if you want to change the port (default is `3000`).

---

## Running the Server

### Development mode (with auto-restart via Nodemon):

```bash
npm run dev
```

### Production mode:

```bash
npm start
```

After starting, you should see:

```
✅ Database connection established.
✅ 'book' table is ready.
✅ 10 sample books seeded into the database.

🚀 Server is running at http://localhost:3000/
📚 Books API:  http://localhost:3000/books/
```

---

## Environment Variables

| Variable | Default | Description                    |
|----------|---------|--------------------------------|
| `PORT`   | `3000`  | Port number for the Express server |

---

## API Endpoints

| # | Method   | Endpoint           | Description               | Status |
|---|----------|--------------------|---------------------------|--------|
| 1 | `GET`    | `/books/`          | Get all books             | 200    |
| 2 | `GET`    | `/books/:bookId/`  | Get a single book by ID   | 200 / 404 |
| 3 | `POST`   | `/books/`          | Create a new book         | 201    |
| 4 | `PUT`    | `/books/:bookId/`  | Update an existing book   | 200 / 404 |
| 5 | `DELETE` | `/books/:bookId/`  | Delete a book by ID       | 200 / 404 |

---

## Sample Request Bodies

### POST /books/ — Create a New Book

```json
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "price": 450,
  "pages": 320
}
```

**Expected Response (201 Created):**

```json
{
  "message": "Book created successfully.",
  "bookId": 11
}
```

---

### PUT /books/1/ — Update a Book

```json
{
  "title": "Atomic Habits - Revised Edition",
  "author": "James Clear",
  "price": 499,
  "pages": 340
}
```

**Expected Response (200 OK):**

```json
{
  "message": "Book with id 1 updated successfully."
}
```

---

## Postman Testing Instructions

1. Open **Postman**.
2. Click **Import** → select `lab02-postman-collection.json`.
3. Make sure the server is running (`npm run dev`).
4. The collection uses `{{baseUrl}}` variable set to `http://localhost:3000`.
5. Run each request and capture screenshots.

### Error Cases to Test

| Test Case              | Endpoint               | Expected Status |
|------------------------|------------------------|-----------------|
| Book not found         | `GET /books/999/`      | 404             |
| Invalid ID             | `GET /books/abc/`      | 400             |
| Missing fields in POST | `POST /books/`         | 400             |
| Invalid price type     | `POST /books/`         | 400             |
| Update non-existent    | `PUT /books/999/`      | 404             |
| Delete non-existent    | `DELETE /books/999/`   | 404             |

---

## Screenshots

> ⚠️ Screenshots must be captured manually during Postman testing.

![GET All Books](screenshots/get-all-books.png)

![GET Single Book](screenshots/get-single-book.png)

![POST Create Book](screenshots/post-create-book.png)

![PUT Update Book](screenshots/put-update-book.png)

![DELETE Book](screenshots/delete-book.png)

![Error - Not Found](screenshots/error-not-found.png)

![Error - Invalid ID](screenshots/error-invalid-id.png)

![Error - Missing Fields](screenshots/error-missing-fields.png)

---

## Git Commands

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Lab 2: SQLite CRUD API - Amrruth Bhushan"

# Link to your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

---

## Deployment on Render

> ⚠️ **Important Note About SQLite on Render:**  
> Render's free tier uses **ephemeral storage** — your SQLite database file will be **deleted** every time the service restarts or redeploys. For persistent data on Render, you must attach a **Persistent Disk** (available on paid plans) and update the DB path accordingly.

### Steps for Render Deployment:

1. Push your code to GitHub.
2. Go to [render.com](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repository.
4. Set **Build Command:** `npm install`
5. Set **Start Command:** `npm start`
6. Add environment variable: `PORT = 10000` (Render sets this automatically).
7. *(Optional)* Attach a Persistent Disk and set `DB_PATH` accordingly.

The app listens on `0.0.0.0` (configured in `app.listen`) so it is Render-compatible.

**Deployment Link:** *(Add your Render URL here after deployment)*

---

## Problems Faced and Solutions

| Problem | Solution |
|---------|----------|
| Sample data duplicating on each restart | Added `COUNT(*)` check before seeding — only inserts if table is empty |
| SQL Injection risk | Used parameterized queries with `?` placeholders for all user inputs |
| Server starting before DB is ready | Used `async/await` in `initializeDBAndServer()` — server starts only after DB connection succeeds |
| `bookId` being a string instead of number | Used `parseInt()` with `isNaN()` validation on all `:bookId` parameters |

---

## License

MIT — Free for educational use.

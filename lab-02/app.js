// app.js
// Main entry point for the Lab 2 Express + SQLite REST API.
// Student: Amrruth Bhushan | Lab: Lab 2 | Subject: Backend Development Fundamentals

const express = require("express");
const dotenv = require("dotenv");
const { connectDatabase, createTable, seedData } = require("./config/database");

// Load environment variables from .env file (if it exists)
dotenv.config();

const app = express();

// Middleware: parse incoming JSON request bodies
app.use(express.json());

// The db variable is declared here so all route handlers can access it.
// It will be assigned after the database connection is established.
let db;

// =============================================================================
// HELPER: Validate request body for POST and PUT
// =============================================================================
function validateBookBody(body) {
  const { title, author, price, pages } = body;
  const errors = [];

  if (!title || typeof title !== "string" || title.trim() === "") {
    errors.push("'title' is required and must be a non-empty string.");
  }
  if (!author || typeof author !== "string" || author.trim() === "") {
    errors.push("'author' is required and must be a non-empty string.");
  }
  if (price === undefined || price === null) {
    errors.push("'price' is required.");
  } else if (typeof price !== "number" || !Number.isInteger(price) || price < 0) {
    errors.push("'price' must be a non-negative integer.");
  }
  if (pages === undefined || pages === null) {
    errors.push("'pages' is required.");
  } else if (typeof pages !== "number" || !Number.isInteger(pages) || pages <= 0) {
    errors.push("'pages' must be a positive integer.");
  }

  return errors;
}

// =============================================================================
// ROUTE 1: GET /books/
// Returns all books from the database.
// =============================================================================
app.get("/books/", async (req, res) => {
  try {
    // db.all() fetches all matching rows as an array
    const books = await db.all("SELECT * FROM book");
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// =============================================================================
// ROUTE 2: GET /books/:bookId/
// Returns a single book by its ID.
// =============================================================================
app.get("/books/:bookId/", async (req, res) => {
  try {
    const { bookId } = req.params;

    // Validate that bookId is a positive integer
    const id = parseInt(bookId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "bookId must be a positive integer." });
    }

    // Use a parameterized query (?) to prevent SQL injection
    const book = await db.get("SELECT * FROM book WHERE id = ?", [id]);

    if (!book) {
      return res.status(404).json({ error: `Book with id ${id} not found.` });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// =============================================================================
// ROUTE 3: POST /books/
// Inserts a new book into the database.
// =============================================================================
app.post("/books/", async (req, res) => {
  try {
    const { title, author, price, pages } = req.body;

    // Validate the request body
    const errors = validateBookBody(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Use parameterized query to safely insert user-provided data
    const result = await db.run(
      `INSERT INTO book (title, author, price, pages)
       VALUES (?, ?, ?, ?)`,
      [title.trim(), author.trim(), price, pages]
    );

    // result.lastID gives us the auto-generated ID of the new record
    res.status(201).json({
      message: "Book created successfully.",
      bookId: result.lastID,
    });
  } catch (error) {
    console.error("Error creating book:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// =============================================================================
// ROUTE 4: PUT /books/:bookId/
// Updates the details of an existing book.
// =============================================================================
app.put("/books/:bookId/", async (req, res) => {
  try {
    const { bookId } = req.params;

    // Validate bookId
    const id = parseInt(bookId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "bookId must be a positive integer." });
    }

    // Check if the book exists before updating
    const existing = await db.get("SELECT * FROM book WHERE id = ?", [id]);
    if (!existing) {
      return res.status(404).json({ error: `Book with id ${id} not found.` });
    }

    // Validate the request body
    const errors = validateBookBody(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { title, author, price, pages } = req.body;

    // Use parameterized query to safely update data
    await db.run(
      `UPDATE book
       SET title = ?, author = ?, price = ?, pages = ?
       WHERE id = ?`,
      [title.trim(), author.trim(), price, pages, id]
    );

    res.status(200).json({ message: `Book with id ${id} updated successfully.` });
  } catch (error) {
    console.error("Error updating book:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// =============================================================================
// ROUTE 5: DELETE /books/:bookId/
// Deletes a book by its ID.
// =============================================================================
app.delete("/books/:bookId/", async (req, res) => {
  try {
    const { bookId } = req.params;

    // Validate bookId
    const id = parseInt(bookId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "bookId must be a positive integer." });
    }

    // Check if the book exists before deleting
    const existing = await db.get("SELECT * FROM book WHERE id = ?", [id]);
    if (!existing) {
      return res.status(404).json({ error: `Book with id ${id} not found.` });
    }

    // Use parameterized query to safely delete
    await db.run("DELETE FROM book WHERE id = ?", [id]);

    res.status(200).json({ message: `Book with id ${id} deleted successfully.` });
  } catch (error) {
    console.error("Error deleting book:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// =============================================================================
// ROOT ROUTE: Health check
// =============================================================================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Lab 2 - Books Library API is running!",
    endpoints: {
      "GET /books/": "Get all books",
      "GET /books/:bookId/": "Get a single book",
      "POST /books/": "Create a new book",
      "PUT /books/:bookId/": "Update a book",
      "DELETE /books/:bookId/": "Delete a book",
    },
  });
});

// =============================================================================
// DATABASE INITIALIZATION AND SERVER STARTUP
// =============================================================================
// This async function:
//   1. Opens the SQLite database connection.
//   2. Creates the 'book' table (if not exists).
//   3. Seeds sample data (only if the table is empty).
//   4. Starts the Express server ONLY after the database is ready.
// =============================================================================
async function initializeDBAndServer() {
  try {
    // Step 1: Connect to the SQLite database
    db = await connectDatabase();
    console.log("✅ Database connection established.");

    // Step 2: Create the table if it doesn't exist
    await createTable(db);
    console.log("✅ 'book' table is ready.");

    // Step 3: Seed sample data if the table is empty
    await seedData(db);

    // Step 4: Start the server
    const PORT = process.env.PORT || 3000;

    // Listen on 0.0.0.0 to support cloud deployment platforms like Render
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`\n🚀 Server is running at http://localhost:${PORT}/`);
      console.log(`📚 Books API:  http://localhost:${PORT}/books/`);
    });
  } catch (error) {
    // If the database connection fails, log the error and exit.
    // We must NOT start the server without a working database.
    console.error("❌ Failed to initialize database:", error.message);
    process.exit(1);
  }
}

// Call the initialization function to start everything
initializeDBAndServer();

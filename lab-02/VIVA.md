# VIVA Preparation — Lab 2: SQLite Database and CRUD Routes

> **Student:** Amrruth Bhushan | **Subject:** Backend Development Fundamentals  
> **Faculty:** Joel Prashanth D | **Campus:** NIAT Aurora

---

## Q1. Why do we use `await` for database calls?

**Answer:**

Database operations like reading or writing to a file (SQLite) take time. They don't finish instantly. In Node.js, we can't just write:

```js
const books = db.all("SELECT * FROM book");
```

Because `db.all()` returns a **Promise** — a promise that the data will arrive *in the future*. Without `await`, `books` would just be a pending Promise object, not the actual data.

When we write:

```js
const books = await db.all("SELECT * FROM book");
```

Node.js **pauses** at that line and waits until the database finishes the query and returns the real data. This makes our code easy to read and avoids "callback hell".

**Simple analogy:** `await` is like ordering a pizza and waiting at the door until it arrives, rather than checking inside an empty box immediately.

---

## Q2. What is SQL Injection?

**Answer:**

SQL Injection is a **security attack** where a hacker inserts malicious SQL code into a user input field, tricking the database into executing dangerous commands.

**Example of unsafe code:**

```js
// BAD — Do NOT do this!
const id = req.params.bookId; // Attacker sends: "1 OR 1=1"
db.get(`SELECT * FROM book WHERE id = ${id}`);
```

The query becomes: `SELECT * FROM book WHERE id = 1 OR 1=1`  
This returns **ALL rows** — a data leak!

Or worse, an attacker could send `; DROP TABLE book; --` which would **delete your entire table**.

---

## Q3. How do Placeholders (`?`) Prevent SQL Injection?

**Answer:**

When we use `?` placeholders, we separate the **SQL structure** from the **user data**. The database treats the user input as pure data — never as part of the SQL command.

```js
// SAFE — Always do this!
db.get("SELECT * FROM book WHERE id = ?", [id]);
```

Even if an attacker sends `; DROP TABLE book; --` as the ID, the database will just try to find a book with that exact string as the ID — and return nothing. The SQL structure is never modified.

**Simple analogy:** It's like filling a blank in a sentence. The sentence structure is fixed; only the blank value changes.

---

## Q4. What is the Difference Between POST and PUT?

**Answer:**

| Feature    | POST                         | PUT                              |
|------------|------------------------------|----------------------------------|
| Purpose    | **Create** a new resource     | **Update** an existing resource  |
| URL        | `/books/` (no ID needed)     | `/books/:id/` (ID required)      |
| Idempotent | No — multiple calls create multiple records | Yes — same call always gives same result |
| Status Code | 201 Created                 | 200 OK                           |

**Simple rule:** Use `POST` when you are adding something new. Use `PUT` when you are replacing/editing something that already exists.

---

## Q5. What is SQLite?

**Answer:**

SQLite is a **lightweight, serverless** relational database. Unlike MySQL or PostgreSQL, SQLite does not need a separate database server program to be installed or running. The entire database is stored in a **single file** (e.g., `library.db`).

**Why use it for labs?**
- No setup required — just install the npm package.
- Data is stored in a file on your hard drive.
- Supports standard SQL.
- Perfect for small applications, learning, and development.

**Limitation:** Not suitable for high-traffic production apps because it doesn't handle multiple simultaneous write operations well.

---

## Q6. What is CRUD?

**Answer:**

CRUD stands for the four fundamental operations in any database-driven application:

| Letter | Operation | SQL Command | HTTP Method |
|--------|-----------|-------------|-------------|
| **C**  | Create    | INSERT      | POST        |
| **R**  | Read      | SELECT      | GET         |
| **U**  | Update    | UPDATE      | PUT         |
| **D**  | Delete    | DELETE      | DELETE      |

Almost every app you use (social media, e-commerce, banking) is built on CRUD operations at its core.

---

## Q7. What is a Primary Key?

**Answer:**

A **Primary Key** is a column (or set of columns) in a database table that **uniquely identifies each row**. No two rows can have the same primary key value.

In our `book` table:

```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
```

- `id` is the primary key.
- `AUTOINCREMENT` means SQLite automatically assigns the next available number (1, 2, 3, ...) every time a new book is inserted.
- This guarantees every book has a unique ID.

**Simple analogy:** A primary key is like your student roll number — every student has a different one, so the college can identify you precisely.

---

## Q8. What is the Purpose of `async`/`await`?

**Answer:**

`async`/`await` is a syntax in JavaScript for handling **asynchronous (non-blocking) operations** in a way that looks like normal, step-by-step code.

- `async` before a function means the function will always return a Promise.
- `await` inside an async function pauses execution until the Promise resolves.

**Without async/await (hard to read — "callback hell"):**

```js
db.get("SELECT * FROM book WHERE id = ?", [id], function(err, row) {
  if (err) { /* handle error */ }
  else { res.json(row); }
});
```

**With async/await (clean and readable):**

```js
const book = await db.get("SELECT * FROM book WHERE id = ?", [id]);
res.json(book);
```

Same result — but much cleaner!

---

## Q9. Why Do We Use Nodemon?

**Answer:**

By default, when you run `node app.js`, the server starts once. If you then change any code and save the file, **nothing happens** — the server is still running the old code. You have to manually stop it (`Ctrl+C`) and restart it every time.

**Nodemon** watches your project files for changes. The moment you save a `.js` file, Nodemon **automatically restarts the server** with the updated code.

This is a huge time-saver during development.

```bash
# Without Nodemon — manual restart needed after every change
node app.js

# With Nodemon — auto-restarts on file save
nodemon app.js
```

---

## Q10. Why Should the Database Connection Succeed Before Starting the Server?

**Answer:**

If we start the Express server before the database is connected, and a user sends a request (like `GET /books/`), the route handler will try to use `db` to query the database — but `db` would be `undefined` or not ready yet. This causes an **immediate crash** or an **unhandled error**.

By using `async/await` in `initializeDBAndServer()`, we guarantee that:

1. The database connects first ✅
2. The table is created ✅
3. The sample data is seeded ✅
4. **Only then** the server starts listening for requests ✅

This makes the application **safe, reliable, and predictable**.

```js
async function initializeDBAndServer() {
  db = await connectDatabase();   // Step 1: DB first
  await createTable(db);          // Step 2: Table ready
  await seedData(db);             // Step 3: Data ready
  app.listen(PORT, () => { ... }); // Step 4: Server starts
}
```

If the database fails (e.g., wrong path), the server exits with a clear error message instead of starting in a broken state.

---

*Good luck with your viva, Amrruth! — Prepared for Lab 2, NIAT Aurora*

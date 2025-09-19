// index.js
import express from "express";
// ...existing code...

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // parse JSON bodies
// app.use(express.static(path.join(__dirname, "public"))); // serve ./public

// In-memory store for students
const students = [];
let studentIdCounter = 1;

// Validation function
function validateStudent({ name, age, course, year }) {
  if (!name || !age || !course || !year) {
    return { ok: false, msg: "Missing required fields (name, age, course, year)." };
  }
  const ageNum = Number(age);
  if (!Number.isFinite(ageNum) || ageNum <= 0) {
    return { ok: false, msg: "Age must be a valid positive number." };
  }
  return { ok: true };
}

// Simple API endpoint
app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from the API!" });
});

// Example GET /getusers endpoint
app.get("/getusers", (req, res) => {
  res.json([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
  ]);
});

// POST /students - Add new student
app.post("/students", (req, res) => {
  const { name, age, course, year, status } = req.body;
  const v = validateStudent({ name, age, course, year });
  if (!v.ok) return res.status(400).json({ error: v.msg });

  const newStudent = {
    id: studentIdCounter++,
    name: String(name).trim(),
    age: Number(age),
    course: String(course).trim(),
    year: String(year).trim(),
    status: status ? String(status).trim() : "active",
    createdAt: new Date().toISOString()
  };

  students.push(newStudent);
  return res.status(201).json({ message: "Student added", student: newStudent });
});

// GET /students - return all students
app.get("/students", (req, res) => {
  res.json({ students });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
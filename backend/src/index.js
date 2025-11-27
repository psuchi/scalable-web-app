import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Temporary storage
let users = [];
let tasks = [];

// Auth utilities
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) =>
  jwt.sign({ id }, "testsecretkey", { expiresIn: "7d" });

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "No token" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "testsecretkey");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Routes

app.get("/", (req, res) => res.send("API Working"));

// signup
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (users.find((u) => u.email === email))
    return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), name, email, password: hashed };
  users.push(user);
  const token = generateToken(user.id);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = generateToken(user.id);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// profile
app.get("/api/users/me", authMiddleware, (req, res) => {
  const user = users.find((u) => u.id === req.userId);
  res.json({ id: user.id, name: user.name, email: user.email });
});

// update profile
app.put("/api/users/me", authMiddleware, (req, res) => {
  const user = users.find((u) => u.id === req.userId);
  user.name = req.body.name;
  res.json(user);
});

// tasks
app.get("/api/tasks", authMiddleware, (req, res) =>
  res.json(tasks.filter((t) => t.user === req.userId))
);

app.post("/api/tasks", authMiddleware, (req, res) => {
  const task = { id: Date.now().toString(), user: req.userId, ...req.body };
  tasks.push(task);
  res.json(task);
});

app.put("/api/tasks/:id", authMiddleware, (req, res) => {
  const index = tasks.findIndex((t) => t.id === req.params.id);
  tasks[index] = { ...tasks[index], ...req.body };
  res.json(tasks[index]);
});

app.delete("/api/tasks/:id", authMiddleware, (req, res) => {
  tasks = tasks.filter((t) => t.id !== req.params.id);
  res.json({ message: "Task removed" });
});

const PORT = 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));


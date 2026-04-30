require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const pool = require("./db");

const SECRET = process.env.JWT_SECRET || "dev_secret";

// 🔍 DB CONNECTION TEST
pool.query("SELECT NOW()")
  .then(res => console.log("DB Connected:", res.rows))
  .catch(err => console.error("DB ERROR:", err.message));


// ===================== HELPERS =====================
function validateBody(body) {
  return body && typeof body === "object" && !Array.isArray(body);
}


// ===================== AUTH =====================
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).send("Email and password required");
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).send("User already exists");
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, hashed]
    );

    res.send({ success: true });
  } catch (err) {
    console.error("SIGNUP ERROR:", err.message);
    res.status(500).send("Internal server error");
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).send("Email and password required");
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) return res.status(401).send("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).send("Invalid password");

    const token = jwt.sign({ userId: user.id }, SECRET, {
      expiresIn: "1d"
    });

    res.send({ token });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).send("Internal server error");
  }
});


// ===================== AUTH MIDDLEWARE =====================
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send("No token");

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
}


// ===================== CREATE =====================
app.post("/:entity", authMiddleware, async (req, res) => {
  const { entity } = req.params;

  try {
    if (!validateBody(req.body)) {
      return res.status(400).send("Invalid data format");
    }

    const result = await pool.query(
      "INSERT INTO records (entity, data, user_id) VALUES ($1, $2, $3) RETURNING id",
      [entity, req.body, req.user.userId]
    );

    res.send({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error("CREATE ERROR:", err.message);
    res.status(500).send("Internal server error");
  }
});


// ===================== READ =====================
app.get("/:entity", authMiddleware, async (req, res) => {
  const { entity } = req.params;

  try {
    const result = await pool.query(
      "SELECT id, data FROM records WHERE entity = $1 AND user_id = $2",
      [entity, req.user.userId]
    );

    const formatted = result.rows.map(r => ({
      id: r.id,
      ...r.data
    }));

    res.send(formatted);
  } catch (err) {
    console.error("READ ERROR:", err.message);
    res.status(500).send("Internal server error");
  }
});


// ===================== UPDATE =====================
app.put("/:entity/:id", authMiddleware, async (req, res) => {
  const { entity, id } = req.params;

  try {
    if (!validateBody(req.body)) {
      return res.status(400).send("Invalid data format");
    }

    await pool.query(
      "UPDATE records SET data = $1 WHERE id = $2 AND entity = $3 AND user_id = $4",
      [req.body, id, entity, req.user.userId]
    );

    res.send({ success: true });
  } catch (err) {
    console.error("UPDATE ERROR:", err.message);
    res.status(500).send("Internal server error");
  }
});


// ===================== DELETE =====================
app.delete("/:entity/:id", authMiddleware, async (req, res) => {
  const { entity, id } = req.params;

  try {
    await pool.query(
      "DELETE FROM records WHERE id = $1 AND entity = $2 AND user_id = $3",
      [id, entity, req.user.userId]
    );

    res.send({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err.message);
    res.status(500).send("Internal server error");
  }
});


// ===================== SERVER =====================
app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
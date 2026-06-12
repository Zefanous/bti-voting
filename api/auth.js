const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "sql303.infinityfree.com",
  user: "if0_42149312",
  password: "BsZTuoekMZg0",
  database: "if0_42149312_btivotes",
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { type } = req.query;
  const data = req.body;

  if (type === "admin") {
    if (data.id === "admin" && data.password === "admin2026") {
      return res.json({ success: true, role: "admin" });
    }
    return res.status(401).json({ error: "Invalid credentials" });
  }

  if (type === "student") {
    const [rows] = await db.query(
      "SELECT * FROM students WHERE reg_no=? AND voting_code=?",
      [data.regNo, data.votingCode]
    );
    if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });
    return res.json({ success: true, role: "student", student: rows[0] });
  }
}
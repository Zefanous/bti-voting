const mysql = require("mysql2/promise");
const db = mysql.createPool({
  host: "sql303.infinityfree.com",
  user: "if0_42149312",
  password: "BsZTuoekMZg0",
  database: "if0_42149312_btivotes",
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const [rows] = await db.query("SELECT * FROM candidates ORDER BY position_id,id ASC");
    return res.json(rows);
  }
  if (req.method === "POST") {
    const { name, position_id, manifesto, initials, color } = req.body;
    const [r] = await db.query(
      "INSERT INTO candidates (name,position_id,manifesto,initials,color) VALUES (?,?,?,?,?)",
      [name, position_id, manifesto, initials, color]
    );
    return res.json({ id: r.insertId, name, position_id, manifesto, initials, color });
  }
  if (req.method === "DELETE") {
    await db.query("DELETE FROM candidates WHERE id=?", [req.query.id]);
    return res.json({ success: true });
  }
}
const mysql = require("mysql2/promise");
const db = mysql.createPool({
  host: "sql303.infinityfree.com",
  user: "if0_42149312",
  password: "BsZTuoekMZg0",
  database: "if0_42149312_btivotes",
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const [rows] = await db.query("SELECT * FROM students ORDER BY id ASC");
    return res.json(rows);
  }
  if (req.method === "POST") {
    const d = req.body;
    if (d.students) {
      let count = 0;
      for (const s of d.students) {
        await db.query(
          "INSERT IGNORE INTO students (name,reg_no,voting_code) VALUES (?,?,?)",
          [s.name, s.reg_no, s.voting_code]
        );
        count++;
      }
      return res.json({ success: true, count });
    }
    const [r] = await db.query(
      "INSERT INTO students (name,reg_no,voting_code) VALUES (?,?,?)",
      [d.name, d.reg_no, d.voting_code]
    );
    return res.json({ id: r.insertId, ...d, has_voted: 0 });
  }
  if (req.method === "DELETE") {
    await db.query("DELETE FROM votes WHERE student_id=?", [req.query.id]);
    await db.query("DELETE FROM students WHERE id=?", [req.query.id]);
    return res.json({ success: true });
  }
  if (req.method === "PATCH") {
    await db.query("UPDATE students SET has_voted=0 WHERE id=?", [req.query.id]);
    await db.query("DELETE FROM votes WHERE student_id=?", [req.query.id]);
    return res.json({ success: true });
  }
}
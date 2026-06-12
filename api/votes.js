const mysql = require("mysql2/promise");
const db = mysql.createPool({
  host: "sql303.infinityfree.com",
  user: "if0_42149312",
  password: "BsZTuoekMZg0",
  database: "if0_42149312_btivotes",
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "POST") {
    const { student_id, position_id, candidate_id } = req.body;
    const [check] = await db.query(
      "SELECT id FROM votes WHERE student_id=? AND position_id=?",
      [student_id, position_id]
    );
    if (check.length > 0) return res.status(400).json({ error: "Already voted for this position" });
    await db.query(
      "INSERT INTO votes (student_id,position_id,candidate_id) VALUES (?,?,?)",
      [student_id, position_id, candidate_id]
    );
    const [[{ c: total }]] = await db.query("SELECT COUNT(*) as c FROM positions");
    const [[{ c: voted }]] = await db.query(
      "SELECT COUNT(*) as c FROM votes WHERE student_id=?", [student_id]
    );
    if (voted >= total) await db.query("UPDATE students SET has_voted=1 WHERE id=?", [student_id]);
    return res.json({ success: true });
  }

  if (req.method === "GET") {
    if (req.query.results !== undefined) {
      const [rows] = await db.query(`
        SELECT c.id,c.name,c.position_id,c.initials,c.color,COUNT(v.id) as vote_count
        FROM candidates c LEFT JOIN votes v ON v.candidate_id=c.id
        GROUP BY c.id ORDER BY c.position_id,vote_count DESC
      `);
      return res.json(rows);
    }
    if (req.query.status !== undefined) {
      const [rows] = await db.query("SELECT * FROM election_config LIMIT 1");
      return res.json(rows[0]);
    }
    if (req.query.my_votes !== undefined) {
      const [rows] = await db.query(
        "SELECT position_id FROM votes WHERE student_id=?", [req.query.student_id]
      );
      return res.json(rows.map(r => r.position_id));
    }
  }

  if (req.method === "PATCH") {
    if (req.query.status !== undefined) {
      const { is_open, results_published } = req.body;
      await db.query("UPDATE election_config SET is_open=?,results_published=?",
        [is_open, results_published]);
      return res.json({ success: true });
    }
  }
}
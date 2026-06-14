const { getRows, rowsToObjects } = require("./sheets");

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { type } = req.query;
  const data = req.body;

  try {
    if (type === "admin") {
      if (data.id === "admin" && data.password === "admin2026") {
        return res.json({ success: true, role: "admin" });
      }
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (type === "student") {
      const rows = await getRows("Students");
      const students = rowsToObjects(rows);
      const student = students.find(
        s => s.reg_no === data.regNo && s.voting_code === data.votingCode
      );
      if (!student) return res.status(401).json({ error: "Invalid Registration Number or Voting Code" });
      return res.json({ success: true, role: "student", student });
    }

    return res.status(400).json({ error: "Unknown auth type" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

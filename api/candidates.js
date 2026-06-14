const { getRows, appendRow, deleteRow, rowsToObjects } = require("./sheets");

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "GET") {
      const rows = await getRows("Candidates");
      const candidates = rowsToObjects(rows);
      return res.json(candidates);
    }

    if (req.method === "POST") {
      const rows = await getRows("Candidates");
      const existing = rowsToObjects(rows);
      const id = existing.length > 0
        ? Math.max(...existing.map(c => parseInt(c.id) || 0)) + 1
        : 1;
      const { name, position_id, manifesto, initials, color } = req.body;
      await appendRow("Candidates", [id, name, position_id, manifesto, initials, color]);
      return res.json({ id: String(id), name, position_id, manifesto, initials, color });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      const rows = await getRows("Candidates");
      const candidates = rowsToObjects(rows);
      const cand = candidates.find(c => String(c.id) === String(id));
      if (!cand) return res.status(404).json({ error: "Not found" });
      await deleteRow("Candidates", cand._rowIndex);
      return res.json({ success: true });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

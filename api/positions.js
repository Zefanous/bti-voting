const { getRows, appendRow, deleteRow, rowsToObjects } = require("./sheets");

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "GET") {
      const rows = await getRows("Positions");
      const positions = rowsToObjects(rows);
      return res.json(positions);
    }

    if (req.method === "POST") {
      const rows = await getRows("Positions");
      const existing = rowsToObjects(rows);
      const id = existing.length > 0
        ? Math.max(...existing.map(p => parseInt(p.id) || 0)) + 1
        : 1;
      const { name } = req.body;
      await appendRow("Positions", [id, name]);
      return res.json({ id: String(id), name });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      const rows = await getRows("Positions");
      const positions = rowsToObjects(rows);
      const pos = positions.find(p => String(p.id) === String(id));
      if (!pos) return res.status(404).json({ error: "Not found" });
      await deleteRow("Positions", pos._rowIndex);
      return res.json({ success: true });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

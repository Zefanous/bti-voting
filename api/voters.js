const { getRows, appendRow, updateRow, deleteRow, rowsToObjects } = require("./sheets");

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "GET") {
      const rows = await getRows("Students");
      const students = rowsToObjects(rows);
      return res.json(students);
    }

    if (req.method === "POST") {
      const d = req.body;
      const rows = await getRows("Students");
      const existing = rowsToObjects(rows);

      if (d.students) {
        // Bulk import
        let count = 0;
        const existingRegs = new Set(existing.map(s => s.reg_no));
        const maxId = existing.length > 0
          ? Math.max(...existing.map(s => parseInt(s.id) || 0))
          : 0;
        let nextId = maxId + 1;
        for (const s of d.students) {
          if (!existingRegs.has(s.reg_no)) {
            await appendRow("Students", [nextId, s.name, s.reg_no, s.voting_code, "FALSE"]);
            existingRegs.add(s.reg_no);
            nextId++;
            count++;
          }
        }
        return res.json({ success: true, count });
      }

      // Single student
      const duplicate = existing.find(s => s.reg_no === d.reg_no);
      if (duplicate) return res.status(400).json({ error: "Registration number already exists" });
      const id = existing.length > 0
        ? Math.max(...existing.map(s => parseInt(s.id) || 0)) + 1
        : 1;
      await appendRow("Students", [id, d.name, d.reg_no, d.voting_code, "FALSE"]);
      return res.json({ id: String(id), name: d.name, reg_no: d.reg_no, voting_code: d.voting_code, has_voted: "FALSE" });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      const rows = await getRows("Students");
      const students = rowsToObjects(rows);
      const student = students.find(s => String(s.id) === String(id));
      if (!student) return res.status(404).json({ error: "Not found" });
      // Delete their votes first from Votes sheet
      const voteRows = await getRows("Votes");
      const votes = rowsToObjects(voteRows);
      const studentVotes = votes.filter(v => String(v.student_id) === String(id));
      // Delete in reverse order to preserve row indices
      for (const v of studentVotes.reverse()) {
        await deleteRow("Votes", v._rowIndex);
      }
      await deleteRow("Students", student._rowIndex);
      return res.json({ success: true });
    }

    if (req.method === "PATCH") {
      const { id } = req.query;
      const rows = await getRows("Students");
      const students = rowsToObjects(rows);
      const student = students.find(s => String(s.id) === String(id));
      if (!student) return res.status(404).json({ error: "Not found" });
      await updateRow("Students", student._rowIndex, [
        student.id, student.name, student.reg_no, student.voting_code, "FALSE"
      ]);
      // Delete their votes
      const voteRows = await getRows("Votes");
      const votes = rowsToObjects(voteRows);
      const studentVotes = votes.filter(v => String(v.student_id) === String(id));
      for (const v of studentVotes.reverse()) {
        await deleteRow("Votes", v._rowIndex);
      }
      return res.json({ success: true });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

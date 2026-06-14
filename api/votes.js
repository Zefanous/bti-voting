const { getRows, appendRow, updateRow, rowsToObjects } = require("./sheets");

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "POST") {
      const { student_id, position_id, candidate_id } = req.body;

      // Check already voted this position
      const voteRows = await getRows("Votes");
      const votes = rowsToObjects(voteRows);
      const alreadyVoted = votes.find(
        v => String(v.student_id) === String(student_id) &&
             String(v.position_id) === String(position_id)
      );
      if (alreadyVoted) return res.status(400).json({ error: "Already voted for this position" });

      // Add vote
      const id = votes.length > 0
        ? Math.max(...votes.map(v => parseInt(v.id) || 0)) + 1
        : 1;
      const votedAt = new Date().toISOString();
      await appendRow("Votes", [id, student_id, position_id, candidate_id, votedAt]);

      // Check if voted all positions
      const posRows = await getRows("Positions");
      const positions = rowsToObjects(posRows);
      const updatedVoteRows = await getRows("Votes");
      const updatedVotes = rowsToObjects(updatedVoteRows);
      const studentVotes = updatedVotes.filter(v => String(v.student_id) === String(student_id));
      if (studentVotes.length >= positions.length) {
        const studentRows = await getRows("Students");
        const students = rowsToObjects(studentRows);
        const student = students.find(s => String(s.id) === String(student_id));
        if (student) {
          await updateRow("Students", student._rowIndex, [
            student.id, student.name, student.reg_no, student.voting_code, "TRUE"
          ]);
        }
      }

      return res.json({ success: true });
    }

    if (req.method === "GET") {
      // Results
      if (req.query.results !== undefined) {
        const candRows = await getRows("Candidates");
        const candidates = rowsToObjects(candRows);
        const voteRows = await getRows("Votes");
        const votes = rowsToObjects(voteRows);

        const results = candidates.map(c => ({
          id: c.id,
          name: c.name,
          position_id: c.position_id,
          initials: c.initials,
          color: c.color,
          vote_count: votes.filter(v => String(v.candidate_id) === String(c.id)).length,
        }));
        return res.json(results);
      }

      // Election status
      if (req.query.status !== undefined) {
        const rows = await getRows("Config");
        const config = rowsToObjects(rows);
        return res.json(config[0] || { is_open: "FALSE", results_published: "FALSE" });
      }

      // Student's voted positions
      if (req.query.my_votes !== undefined) {
        const { student_id } = req.query;
        const rows = await getRows("Votes");
        const votes = rowsToObjects(rows);
        const voted = votes
          .filter(v => String(v.student_id) === String(student_id))
          .map(v => v.position_id);
        return res.json(voted);
      }
    }

    if (req.method === "PATCH") {
      if (req.query.status !== undefined) {
        const { is_open, results_published } = req.body;
        const rows = await getRows("Config");
        const config = rowsToObjects(rows);
        if (config.length === 0) {
          const { appendRow } = require("./sheets");
          await appendRow("Config", [is_open ? "TRUE" : "FALSE", results_published ? "TRUE" : "FALSE"]);
        } else {
          await updateRow("Config", config[0]._rowIndex, [
            is_open ? "TRUE" : "FALSE",
            results_published ? "TRUE" : "FALSE"
          ]);
        }
        return res.json({ success: true });
      }
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

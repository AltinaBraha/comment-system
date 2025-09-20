import { pool } from "@/lib/db";

export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    await pool.query("DELETE FROM comments WHERE id = ? OR parentId = ?", [id, id]);
    return new Response("Deleted", { status: 200 });
  } catch (err) {
    console.error("DELETE Error:", err);
    return new Response("Gabim te DELETE", { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const { text } = body;

  try {
    await pool.query("UPDATE comments SET text = ? WHERE id = ?", [text, id]);

    const [updated] = await pool.query("SELECT * FROM comments WHERE id = ?", [id]);
    return new Response(JSON.stringify(updated[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("PUT Error:", err);
    return new Response("Gabim te PUT", { status: 500 });
  }
}

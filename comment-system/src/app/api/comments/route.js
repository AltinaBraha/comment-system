import { pool } from "@/lib/db";

// GET: Merr të gjithë komentet si threaded
export async function GET() {
  try {
    const [comments] = await pool.query("SELECT * FROM comments ORDER BY createdAt ASC");

    // Organizojmë threaded comments
    const map = {};
    comments.forEach(c => {
      c.replies = [];
      map[c.id] = c;
    });

    const threaded = [];
    comments.forEach(c => {
      if (c.parentId) {
        map[c.parentId]?.replies.push(c);
      } else {
        threaded.push(c);
      }
    });

    return new Response(JSON.stringify(threaded), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET Error:", err);
    return new Response("Gabim te GET", { status: 500 });
  }
}

// POST: Shto koment kryesor ose reply
export async function POST(req) {
  try {
    const body = await req.json();
    const { text, name, parentId = null } = body;

    if (!text?.trim() || !name?.trim()) {
      return new Response(JSON.stringify({ error: "Text dhe Name janë të nevojshme" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const [result] = await pool.query(
      "INSERT INTO comments (text, name, parentId) VALUES (?, ?, ?)",
      [text, name, parentId]
    );

    const newComment = {
        id: result.insertId,
        text,
        name,
        parentId,
        createdAt: new Date().toISOString(),
        replies: []
        };


    return new Response(JSON.stringify(newComment), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("POST Error:", err);
    return new Response("Gabim te POST", { status: 500 });
  }
}

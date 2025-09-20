import { pool } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Body nga frontend:", body);  // <--- shto këtë
    const text = body.text;

    if (!text || !text.trim()) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const [result] = await pool.query(
  "INSERT INTO comments (text) VALUES (?)",
  [text]
);

const newComment = {
  id: result.insertId,  // AUTO_INCREMENT id nga databaza
  text,                  // tekst i komentit
  createdAt: new Date(), // timestamp
};

return new Response(JSON.stringify(newComment), {
  status: 200,
  headers: { "Content-Type": "application/json" },
});
  } catch (err) {
    console.error("POST Error:", err); // <--- ky do të tregon pse 500
    return new Response("Gabim te POST", { status: 500 });
  }
}

"use client";
import { useState } from "react";

export default function CommentForm({ onCommentAdded }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const res = await fetch("/api/comments", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: content }), // <-- text, jo content
});


    if (res.ok) {
      const newComment = await res.json();
      onCommentAdded(newComment);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Shkruaj një koment..."
        className="border rounded p-2 flex-grow"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Shto
      </button>
    </form>
  );
}

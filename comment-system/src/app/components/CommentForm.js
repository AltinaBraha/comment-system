"use client";
import { useState } from "react";

export default function CommentForm({ onCommentAdded, parentId = null }) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !name.trim()) return;

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content, name, parentId }),
    });

    if (res.ok) {
      const newComment = await res.json();
      onCommentAdded(newComment);
      setContent("");
      setName("");
    }
  };

  return (
  <form 
  onSubmit={handleSubmit} 
  className="flex flex-col gap-2 mb-4 p-3 rounded-lg bg-gray-800 w-full"
>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Emri yt..."
        className="p-2 rounded-md border border-gray-700 bg-gray-900 text-white placeholder-gray-400 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Shkruaj një koment..."
        className="p-2 rounded-md border border-gray-700 bg-gray-900 text-white placeholder-gray-400 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition">Shto</button>
    </form>
  );
}

"use client";
import { useEffect, useState } from "react";
import CommentForm from "./commentForm";
import CommentList from "./CommentList";

export default function CommentSection() {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    const res = await fetch("/api/comments");
    if (res.ok) {
      const data = await res.json();
      setComments(data);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleNewComment = (comment) => {
    setComments((prev) => [comment, ...prev]);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Komentet</h2>
      <CommentForm onCommentAdded={handleNewComment} />
      <CommentList comments={comments} />
    </div>
  );
}

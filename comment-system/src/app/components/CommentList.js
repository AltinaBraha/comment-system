"use client";
import { useState } from "react";
import CommentForm from "./commentForm";

export default function Comment({ comment, onEdit, onDelete, onReplyAdded }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  const startEdit = () => {
    setEditingId(comment?.id);
    setEditText(comment?.text || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = () => {
    if (comment?.id) {
      onEdit({ id: comment.id, text: editText });
      cancelEdit();
    }
  };

  if (!comment) return null; // fallback për undefined

  return (
    <div className="mb-2">
      <div className="p-3 rounded-lg bg-gray-800 flex justify-between items-start shadow hover:shadow-md transition">
        <div className="flex-1">
          <p className="text-sm text-gray-400">{comment.name || "Anonim"}</p>

          {editingId === comment?.id ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="border border-gray-700 p-2 w-full rounded-md bg-gray-900 text-white"
            />
          ) : (
            <p className="text-white">{comment.text || ""}</p>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}
          </div>
        </div>

        <div className="flex flex-col gap-1 ml-4">
          {editingId === comment?.id ? (
            <>
              <button onClick={saveEdit} className="text-green-500 hover:text-green-700 text-sm">✔</button>
              <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-200 text-sm">✖</button>
            </>
          ) : (
            <>
              <button onClick={startEdit} className="text-blue-500 hover:text-blue-700 text-sm">✎</button>
              <button onClick={() => onDelete(comment.id)} className="text-red-500 hover:text-red-700 text-sm">🗑</button>
              <button onClick={() => setShowReplyForm(!showReplyForm)} className="text-yellow-400 hover:text-yellow-500 text-sm mt-1">Reply</button>
            </>
          )}
        </div>
      </div>

      {showReplyForm && (
        <div className="ml-6 mt-2">
          <CommentForm
            onCommentAdded={(reply) => {
              onReplyAdded(comment.id, reply);
              setShowReplyForm(false);
            }}
            parentId={comment.id}
          />
        </div>
      )}

      {/* Shfaq reply-t */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 border-l border-gray-600 pl-2 mt-2">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} onEdit={onEdit} onDelete={onDelete} onReplyAdded={onReplyAdded} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentList({ comments, onEdit, onDelete, onReplyAdded }) {
  if (!comments || !comments.length) return <p className="text-gray-400">S’ka komente ende.</p>;

  return (
    <div>
      {comments.map((comment) =>
        comment ? (
          <Comment key={comment.id} comment={comment} onEdit={onEdit} onDelete={onDelete} onReplyAdded={onReplyAdded} />
        ) : null
      )}
    </div>
  );
}

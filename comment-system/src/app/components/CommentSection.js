"use client";
import { useState, useEffect } from "react";

function buildCommentTree(flatComments) {
  const commentMap = {};
  const rootComments = [];

  flatComments.forEach((comment) => {
    comment.replies = [];
    commentMap[comment.id] = comment;
  });

  flatComments.forEach((comment) => {
    if (comment.parentId) {
      const parent = commentMap[comment.parentId];
      if (parent) {
        parent.replies.push(comment);
      }
    } else {
      rootComments.push(comment);
    }
  });

  return rootComments;
}

function CommentForm({ onCommentAdded, parentId = null }) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    // Simulim POST request, këtu duhet të ndryshosh me backend-in tënd!
    // Për testim, po kthejmë direkt komentin e ri me id random.
    const newComment = {
      id: Math.floor(Math.random() * 1000000),
      name,
      text: content,
      createdAt: new Date().toISOString(),
      parentId,
      replies: [],
    };

    // Në vend të fetch POST, thjesht thirr callback për demo
    onCommentAdded({ ...newComment, parentId });
    setName("");
    setContent("");
  };

  return (
    <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 mb-6 p-5 rounded bg-gray-800 text-white max-w-full"
        style={{ minWidth: "320px", maxWidth: "600px", width: "100%" }}
        >
        <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded border border-gray-600 bg-gray-900 w-full text-white"
        />
        <textarea
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="p-3 rounded border border-gray-600 bg-gray-900 w-full text-white resize-y"
            rows={4}
        />
        <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded mt-2 text-lg font-semibold"
        >
            Shto
        </button>
        </form>

  );
}

function Comment({ comment, onEdit, onDelete, onReplyAdded }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const saveEdit = () => {
    onEdit({ id: comment.id, text: editText });
    setEditing(false);
  };

  return (
    <div className="mb-5 ml-4 border-l border-gray-600 pl-3">
      <div className="bg-gray-700 p-5 rounded shadow flex justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400">{comment.name || "Anonim"}</p>
          {editing ? (
            <input
              className="bg-gray-800 border border-gray-600 rounded p-1 w-full text-white"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
          ) : (
            <p className="text-white">{comment.text}</p>
          )}
          <div className="text-xs text-gray-500 mt-1">{new Date(comment.createdAt).toLocaleString()}</div>
        </div>

        <div className="flex flex-col ml-4 gap-1 text-sm">
          {editing ? (
            <>
              <button onClick={saveEdit} className="text-green-400 hover:text-green-600">✔</button>
              <button onClick={() => setEditing(false)} className="text-red-400 hover:text-red-600">✖</button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="text-blue-400 hover:text-blue-600">✎</button>
              <button onClick={() => onDelete(comment.id)} className="text-red-400 hover:text-red-600">🗑</button>
              <button
                onClick={() => setShowReplyForm((v) => !v)}
                className="text-yellow-400 hover:text-yellow-600 mt-1"
              >
                Reply
              </button>
            </>
          )}
        </div>
      </div>

      {showReplyForm && (
        <div className="mt-2 ml-6">
          <CommentForm
            parentId={comment.id}
            onCommentAdded={(reply) => {
                onReplyAdded(reply);
                setShowReplyForm(false);
            }}
            />

        </div>
      )}

      {comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onEdit={onEdit}
              onDelete={onDelete}
              onReplyAdded={onReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentList({ comments, onEdit, onDelete, onReplyAdded }) {
  if (!comments.length) return <p className="text-gray-400">S’ka komente ende.</p>;

  return (
    <div>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onEdit={onEdit}
          onDelete={onDelete}
          onReplyAdded={onReplyAdded}
        />
      ))}
    </div>
  );
}

export default function CommentSection() {
  const [comments, setComments] = useState([]);

  // Simulim fetch, këtu duhet të bësh fetch nga backend-i yt
  useEffect(() => {
  async function fetchComments() {
    const res = await fetch('/api/comments');
    if (res.ok) {
      const data = await res.json();
      setComments(data);
    }
  }
  fetchComments();
}, []);

const handleNewComment = async (comment) => {
  try {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });

    if (res.ok) {
      const newCommentFromServer = await res.json();

      if (!newCommentFromServer.parentId) {
        setComments((prev) => [newCommentFromServer, ...prev]);
      } else {
        const addReply = (commentsList) => {
          return commentsList.map((c) => {
            if (c.id === newCommentFromServer.parentId) {
              return { ...c, replies: c.replies.concat(newCommentFromServer) };
            }
            if (c.replies.length > 0) {
              return { ...c, replies: addReply(c.replies) };
            }
            return c;
          });
        };

        setComments((prev) => addReply(prev));
      }
    } else {
      console.error("Failed to add comment");
    }
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};



  const handleEdit = async ({ id, text }) => {
  try {
    const res = await fetch(`/api/comments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      const updatedComment = await res.json();

      const editComment = (commentsList) => {
        return commentsList.map((c) => {
          if (c.id === id) {
            return { ...c, text: updatedComment.text };
          }
          if (c.replies.length > 0) {
            return { ...c, replies: editComment(c.replies) };
          }
          return c;
        });
      };

      setComments((prev) => editComment(prev));
    } else {
      console.error("Failed to update comment");
      // Optionally show error message to user
    }
  } catch (error) {
    console.error("Error updating comment:", error);
  }
};


  const handleDelete = async (id) => {
  try {
    const res = await fetch(`/api/comments/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      // Remove comment from React state only after backend deletion succeeds
      const removeComment = (commentsList) => {
        return commentsList
          .filter((c) => c.id !== id)
          .map((c) => ({ ...c, replies: removeComment(c.replies) }));
      };

      setComments((prev) => removeComment(prev));
    } else {
      console.error("Failed to delete comment");
      // Optionally show error message to user
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
};


  return (  
    <div className="max-w-lg mx-auto p-9 bg-gray-900 rounded-lg text-white mt-10">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <CommentForm onCommentAdded={handleNewComment} />
      <CommentList comments={comments} onEdit={handleEdit} onDelete={handleDelete} onReplyAdded={handleNewComment} />
    </div>
  );
}

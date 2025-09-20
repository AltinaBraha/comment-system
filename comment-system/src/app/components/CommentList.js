export default function CommentList({ comments }) {
  if (!comments.length) return <p>S’ka komente ende.</p>;

  return (
    <ul className="space-y-2 mt-4">
      {comments.map((comment) => (
        <li
          key={comment.id}
          className="p-2 border rounded bg-white shadow-sm"
        >
          {comment.text}
          <div className="text-xs text-black-500">
            {new Date(comment.createdAt).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  );
}

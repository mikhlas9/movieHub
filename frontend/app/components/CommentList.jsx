"use client"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"
import { Delete, DeleteIcon, Trash } from "lucide-react"

export default function CommentList({ comments, onCommentDeleted }) {
  const { user, isAdmin } = useAuth()

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return
    }

    try {
      await axios.delete(`${API_URL}/comments/${commentId}`)
      onCommentDeleted(commentId)
    } catch (error) {
      console.error("Error deleting comment:", error)
      alert("Error deleting comment. Please try again.")
    }
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment._id} className="card">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-medium">{comment.user_id.name}</span>
              <span className="text-gray-500 text-sm ml-2">{new Date(comment.created_at).toLocaleDateString()}</span>
            </div>

            {user && (user.id === comment.user_id._id || isAdmin) && (
              <button
                onClick={() => handleDeleteComment(comment._id)}
                className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
              >
                <Trash />
              </button>
            )}
          </div>

          <p className="text-gray-700">{comment.body}</p>
        </div>
      ))}
    </div>
  )
}

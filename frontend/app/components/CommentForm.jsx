"use client"
import { useState } from "react"
import axios from "axios"

export default function CommentForm({ movieId, onCommentAdded }) {
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!comment.trim()) {
      return
    }

    setSubmitting(true)

    try {
      const response = await axios.post(`${API_URL}/comments/${movieId}`, {
        body: comment,
      })

      onCommentAdded(response.data)
      setComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
      alert("Error adding comment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-6">
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Add a comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="input min-h-[100px] resize-vertical"
          placeholder="Share your thoughts about this movie..."
          disabled={submitting}
        />
      </div>

      <button type="submit" className="btn btn-primary cursor-pointer" disabled={submitting || !comment.trim()}>
        {submitting ? "Posting..." : "Post Comment"}
      </button>
    </form>
  )
}

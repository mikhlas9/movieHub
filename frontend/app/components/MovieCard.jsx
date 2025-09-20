"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"
import { ThumbsUp, ThumbsDown, User, Calendar, TrendingUp, MessageCircle, Check } from "lucide-react"

export default function MovieCard({ movie }) {
  const { isAuthenticated, logout, user } = useAuth()
  const [userVote, setUserVote] = useState(null)
  const [voteScore, setVoteScore] = useState(movie.vote_score)
  const [upvotes, setUpvotes] = useState(movie.upvotes || 0)
  const [downvotes, setDownvotes] = useState(movie.downvotes || 0)
  const [voting, setVoting] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserVote()
    }
  }, [isAuthenticated, movie._id])

  const fetchUserVote = async () => {
    try {
      const response = await axios.get(`${API_URL}/votes/${movie._id}/user-vote`)
      setUserVote(response.data.vote_type)
    } catch (error) {
      console.error("Error fetching user vote:", error)
      if (error.response?.status === 401) {
        logout()
      }
    }
  }

  const handleVote = async (e, voteType) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      alert("Please login to vote")
      return
    }

    if (voting) return

    setVoting(true)

    try {
      const response = await axios.post(`${API_URL}/votes/${movie._id}`, {
        voteType,
      })

      setUserVote(voteType)
      setVoteScore(response.data.vote_score)
      setUpvotes(response.data.upvotes)
      setDownvotes(response.data.downvotes)
    } catch (error) {
      console.error("Error voting:", error)
      
      if (error.response?.status === 401) {
        logout()
        alert("Your session has expired. Please login again.")
      } else {
        alert("Error voting. Please try again.")
      }
    } finally {
      setVoting(false)
    }
  }

  return (
    <div className="group">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:border-blue-200 hover:-translate-y-2">
        {/* Movie Content - Clickable Area */}
        <Link href={`/movie/${movie._id}`} className="block">
          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-3 line-clamp-2">
                {movie.title}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <div className="p-1 bg-blue-100 rounded-lg">
                    <User className="w-3 h-3 text-blue-600" />
                  </div>
                  <span>{movie.added_by.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="p-1 bg-purple-100 rounded-lg">
                    <Calendar className="w-3 h-3 text-purple-600" />
                  </div>
                  <span>{new Date(movie.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed line-clamp-4 mb-6">
                {movie.description}
              </p>

              {/* Net Score Display */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-blue-600">Score: {voteScore}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Voting Section - Non-clickable */}
        <div className="px-8 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Upvote Button */}
              <div className="relative">
                <button
                  onClick={(e) => handleVote(e, 1)}
                  disabled={voting || !isAuthenticated}
                  className={`relative flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-semibold ${
                    userVote === 1
                      ? "bg-green-500 text-white shadow-lg scale-105 ring-4 ring-green-200"
                      : "bg-green-50 text-green-700 hover:bg-green-100 hover:scale-105 border-2 border-green-200 hover:border-green-300"
                  } ${voting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${!isAuthenticated ? "opacity-60" : ""}`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{upvotes}</span>
                 
                </button>
                
              </div>

              {/* Downvote Button */}
              <div className="relative">
                <button
                  onClick={(e) => handleVote(e, -1)}
                  disabled={voting || !isAuthenticated}
                  className={`relative flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-semibold ${
                    userVote === -1
                      ? "bg-red-500 text-white shadow-lg scale-105 ring-4 ring-red-200"
                      : "bg-red-50 text-red-700 hover:bg-red-100 hover:scale-105 border-2 border-red-200 hover:border-red-300"
                  } ${voting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${!isAuthenticated ? "opacity-60" : ""}`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>{downvotes}</span>
                 
                </button>

              </div>
            </div>

            {/* View Details Link */}
            <Link 
              href={`/movie/${movie._id}`}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-semibold group/link"
            >
              <MessageCircle className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
              <span>Details</span>
            </Link>
          </div>

          {/* Login prompt for non-authenticated users */}
          {!isAuthenticated && (
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl">
              <p className="text-yellow-800 text-sm text-center">
                <Link 
                  href="/login" 
                  className="font-semibold hover:underline text-blue-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  Login
                </Link>{" "}
                to vote and join the discussion
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

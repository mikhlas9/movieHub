"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"
import { ThumbsUp, ThumbsDown, TrendingUp, Check } from "lucide-react"

export default function VotingComponent({ movie, onVoteUpdate, variant = "default" }) {
  const { isAuthenticated, logout, user } = useAuth()
  const [userVote, setUserVote] = useState(null)
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

  const handleVote = async (voteType) => {
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
      onVoteUpdate?.(response.data)
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

  const isMobile = variant !== "large"
  const buttonSize = variant === "large" ? "px-4 py-3 sm:px-6 sm:py-4" : "px-3 py-2"
  const iconSize = variant === "large" ? "w-5 h-5 sm:w-6 sm:h-6" : "w-4 h-4"
  const fontSize = variant === "large" ? "text-base sm:text-lg" : "text-sm sm:text-base"

  return (
    <div className={`flex items-center ${variant === "large" ? "flex-col sm:flex-row" : ""} gap-2 sm:gap-3`}>
      {/* Upvote Button */}
      <div className="relative">
        <button
          onClick={() => handleVote(1)}
          disabled={voting || !isAuthenticated}
          className={`flex items-center gap-2 ${buttonSize} rounded-lg transition-all duration-300 ${fontSize} font-medium relative ${
            userVote === 1
              ? variant === "large" 
                ? "bg-green-500 text-white shadow-xl scale-105 border-2 border-green-400 ring-2 ring-green-300"
                : "bg-green-500 text-white shadow-lg scale-105 ring-2 ring-green-300"
              : variant === "large"
                ? "bg-white/10 text-white hover:bg-white/20 hover:scale-105 border-2 border-white/30 hover:border-white/50"
                : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600 hover:scale-105 border border-gray-300 hover:border-green-300"
          } ${voting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${!isAuthenticated ? "opacity-60" : ""}`}
        >
          <ThumbsUp className={iconSize} />
          <span className="font-bold">{movie.upvotes || 0}</span>
          
        </button>
        
      </div>

      {/* Downvote Button */}
      <div className="relative">
        <button
          onClick={() => handleVote(-1)}
          disabled={voting || !isAuthenticated}
          className={`flex items-center gap-2 ${buttonSize} rounded-lg transition-all duration-300 ${fontSize} font-medium relative ${
            userVote === -1
              ? variant === "large" 
                ? "bg-red-500 text-white shadow-xl scale-105 border-2 border-red-400 ring-2 ring-red-300"
                : "bg-red-500 text-white shadow-lg scale-105 ring-2 ring-red-300"
              : variant === "large"
                ? "bg-white/10 text-white hover:bg-white/20 hover:scale-105 border-2 border-white/30 hover:border-white/50"
                : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:scale-105 border border-gray-300 hover:border-red-300"
          } ${voting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${!isAuthenticated ? "opacity-60" : ""}`}
        >
          <ThumbsDown className={iconSize} />
          <span className="font-bold">{movie.downvotes || 0}</span>
        
        </button>
       
      </div>

      {variant === "large" && (
        <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-white/20 text-white rounded-lg border-2 border-white/30 mt-2 sm:mt-0">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-bold text-base sm:text-lg">Score: {movie.vote_score}</span>
        </div>
      )}

      {!isAuthenticated && variant !== "large" && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
          Login to vote
        </div>
      )}
    </div>
  )
}

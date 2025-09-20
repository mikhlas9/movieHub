"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { useAuth } from "../../contexts/AuthContext"
import CommentForm from "../../components/CommentForm"
import CommentList from "../../components/CommentList"
import VotingComponent from "../../components/VotingComponent"
import { 
  Film, 
  User, 
  Calendar, 
  TrendingUp, 
  MessageCircle, 
  Award,
  Users,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

export default function MovieDetail() {
  const params = useParams()
  const { isAuthenticated, isAdmin, user } = useAuth()
  const [movie, setMovie] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    if (params.id) {
      fetchMovieDetails()
    }
  }, [params.id])

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/movies/${params.id}`)
      setMovie(response.data.movie)
      setComments(response.data.comments)
    } catch (error) {
      console.error("Error fetching movie details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommentAdded = (newComment) => {
    setComments([newComment, ...comments])
  }

  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter((comment) => comment._id !== commentId))
  }

  const handleVoteUpdate = (newVoteData) => {
    setMovie(prev => ({
      ...prev,
      vote_score: newVoteData.vote_score,
      upvotes: newVoteData.upvotes,
      downvotes: newVoteData.downvotes
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="ml-4 text-xl text-gray-700">Loading movie details...</div>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8 sm:py-16">
          <div className="text-center">
            <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-xl sm:text-2xl text-gray-600 mb-4">Movie not found</h1>
            <Link href="/movies" className="btn btn-primary">
              Back to Movies
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Back Navigation */}
        <div className="mb-4 sm:mb-6">
          <Link 
            href="/movies" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Movies
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-200 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-8 text-white">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-8">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                  <div className="p-2 sm:p-3 bg-white/20 rounded-full w-fit">
                    <Film className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{movie.title}</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-blue-100 text-sm sm:text-base">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>Added by {movie.added_by.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(movie.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voting Component */}
              <div className="flex justify-center lg:justify-end">
                <VotingComponent 
                  movie={movie} 
                  onVoteUpdate={handleVoteUpdate}
                  variant="large"
                />
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-8">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">Description</h3>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
              {movie.description}
            </p>

            {/* Stats Grid - Mobile Optimized */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl border border-green-200">
                <div className="flex justify-center mb-1 sm:mb-2">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-green-600">{movie.upvotes || 0}</div>
                <div className="text-xs sm:text-sm text-green-700">Upvotes</div>
              </div>

              <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg sm:rounded-xl border border-red-200">
                <div className="flex justify-center mb-1 sm:mb-2">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 rotate-180" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-red-600">{movie.downvotes || 0}</div>
                <div className="text-xs sm:text-sm text-red-700">Downvotes</div>
              </div>

              <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200">
                <div className="flex justify-center mb-1 sm:mb-2">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{movie.vote_score}</div>
                <div className="text-xs sm:text-sm text-blue-700">Net Score</div>
              </div>

              <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg sm:rounded-xl border border-purple-200">
                <div className="flex justify-center mb-1 sm:mb-2">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-purple-600">{comments.length}</div>
                <div className="text-xs sm:text-sm text-purple-700">Comments</div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Discussion ({comments.length})
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Share your thoughts about this movie
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {isAuthenticated ? (
              <>
                <div className="mb-6 sm:mb-8">
                  <CommentForm 
                    movieId={params.id} 
                    onCommentAdded={handleCommentAdded} 
                  />
                </div>
                <CommentList 
                  comments={comments} 
                  onCommentDeleted={handleCommentDeleted} 
                />
              </>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl p-6 sm:p-8 max-w-md mx-auto">
                  <Users className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-600 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-yellow-800 mb-2">
                    Join the Discussion
                  </h3>
                  <p className="text-yellow-700 mb-3 sm:mb-4 text-sm sm:text-base">
                    Login to share your thoughts and read what others are saying about this movie.
                  </p>
                  <Link 
                    href="/login" 
                    className="btn btn-primary text-sm sm:text-base"
                  >
                    Login to Comment
                  </Link>
                </div>

                {comments.length > 0 && (
                  <div className="mt-6 sm:mt-8">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">
                      What others are saying:
                    </h3>
                    <CommentList 
                      comments={comments} 
                      onCommentDeleted={handleCommentDeleted}
                      readOnly={true}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

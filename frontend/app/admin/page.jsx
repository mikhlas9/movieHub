"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"
import { 
  Trash2, 
  Crown, 
  Calendar, 
  User, 
  Film, 
  MessageCircle, 
  TrendingUp, 
  Users,
  AlertTriangle 
} from "lucide-react"

export default function Admin() {
  const router = useRouter()
  const { isAdmin, loading } = useAuth()
  const [movies, setMovies] = useState([])
  const [stats, setStats] = useState(null)
  const [loadingData, setLoadingData] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/")
      return
    }

    if (isAdmin) {
      fetchData()
    }
  }, [loading, isAdmin])

  const fetchData = async () => {
    try {
      const [moviesResponse, statsResponse] = await Promise.all([
        axios.get(`${API_URL}/admin/top-movies`),
        axios.get(`${API_URL}/admin/stats`).catch(() => ({ data: null })) // Stats is optional
      ]);
      
      setMovies(moviesResponse.data)
      setStats(statsResponse.data)
    } catch (error) {
      console.error("Error fetching data:", error)
      alert("Error loading admin data. Please refresh the page.")
    } finally {
      setLoadingData(false)
    }
  }

  const handleDeleteMovie = async (movieId, movieTitle) => {
    if (
      !confirm(
        `Are you sure you want to delete "${movieTitle}"?\n\nThis will permanently delete:\n• The movie\n• All votes on this movie\n• All comments on this movie\n\nThis action cannot be undone.`
      )
    ) {
      return
    }

    setDeleting(movieId)

    try {
      const response = await axios.delete(`${API_URL}/admin/movies/${movieId}`)
      
      // Remove movie from state
      setMovies(movies.filter((movie) => movie._id !== movieId))
      
      // Show success message with details
      alert(
        `Movie deleted successfully!\n\n• Movie: ${response.data.deletedMovie}\n• Comments deleted: ${response.data.deletedComments}\n• Votes deleted: ${response.data.deletedVotes}`
      )
      
      // Refresh stats
      if (stats) {
        setStats(prev => ({
          ...prev,
          movies: prev.movies - 1,
          comments: prev.comments - response.data.deletedComments,
          votes: prev.votes - response.data.deletedVotes
        }))
      }
    } catch (error) {
      console.error("Error deleting movie:", error)
      
      if (error.response?.status === 404) {
        alert("Movie not found. It may have already been deleted.")
        // Remove from UI anyway
        setMovies(movies.filter((movie) => movie._id !== movieId))
      } else {
        alert(`Error deleting movie: ${error.response?.data?.message || error.message}`)
      }
    } finally {
      setDeleting(null)
    }
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <div className="ml-4 text-xl">Loading admin dashboard...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">

          <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage movies and view the community leaderboard
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Film className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.movies}</div>
                  <div className="text-sm text-gray-600">Movies</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.users}</div>
                  <div className="text-sm text-gray-600">Users</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.votes}</div>
                  <div className="text-sm text-gray-600">Votes</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.comments}</div>
                  <div className="text-sm text-gray-600">Comments</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Movies Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-6 sm:px-8 py-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
              Top Movies Leaderboard
            </h2>
          </div>

          <div className="p-4 sm:p-8">
            {movies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="text-left py-3 sm:py-4 px-2 font-semibold text-gray-700 text-sm sm:text-base">Rank</th>
                      <th className="text-left py-3 sm:py-4 px-2 font-semibold text-gray-700 text-sm sm:text-base">Title</th>
                      <th className="text-left py-3 sm:py-4 px-2 font-semibold text-gray-700 text-sm sm:text-base">Added By</th>
                      <th className="text-left py-3 sm:py-4 px-2 font-semibold text-gray-700 text-sm sm:text-base">Score</th>
                      <th className="text-left py-3 sm:py-4 px-2 font-semibold text-gray-700 text-sm sm:text-base">Date</th>
                      <th className="text-left py-3 sm:py-4 px-2 font-semibold text-gray-700 text-sm sm:text-base">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movies.map((movie, index) => (
                      <tr 
                        key={movie._id} 
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-3 sm:py-4 px-2">
                          <div
                            className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full font-bold text-xs sm:text-sm ${
                              index === 0
                                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                                : index === 1
                                  ? "bg-gradient-to-r from-gray-300 to-gray-400 text-white"
                                  : index === 2
                                    ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-white"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {index + 1}
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-2">
                          <div className="font-medium text-gray-900 text-sm sm:text-base">
                            {movie.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 sm:hidden">
                            by {movie.added_by.name}
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-2 hidden sm:table-cell">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <User className="w-4 h-4" />
                            {movie.added_by.name}
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-2">
                          <span
                            className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                              movie.vote_score > 0
                                ? "bg-emerald-100 text-emerald-800"
                                : movie.vote_score < 0
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {movie.vote_score > 0 ? "+" : ""}
                            {movie.vote_score}
                          </span>
                        </td>
                        <td className="py-3 sm:py-4 px-2">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">
                              {new Date(movie.created_at).toLocaleDateString()}
                            </span>
                            <span className="sm:hidden">
                              {new Date(movie.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-2">
                          <button
                            onClick={() => handleDeleteMovie(movie._id, movie.title)}
                            disabled={deleting === movie._id}
                            className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deleting === movie._id ? (
                              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                            <span className="hidden sm:inline">
                              {deleting === movie._id ? "Deleting..." : "Delete"}
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No movies found</p>
                <p className="text-gray-400 text-sm mt-2">Movies will appear here once users start adding them</p>
              </div>
            )}
          </div>
        </div>

        {/* Warning Note */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-1">Admin Actions</h3>
              <p className="text-amber-700 text-sm">
                Deleting movies will permanently remove all associated votes and comments. 
                This action cannot be undone. Use with caution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

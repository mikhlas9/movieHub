"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import MovieCard from "../components/MovieCard"
import { 
  Search, 
  Filter, 
  Star, 
  Film, 
  TrendingUp, 
  Clock, 
  AlignLeft,
  Sparkles,
  Users,
  Award
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "../contexts/AuthContext"

export default function MoviesPage() {
  const { isAuthenticated } = useAuth()
  const [movies, setMovies] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("score") // score, newest, title

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    fetchMovies()
  }, [])

  useEffect(() => {
    handleSearch()
  }, [searchTerm, sortBy, movies])

  const fetchMovies = async () => {
    try {
      console.log("🎬 Fetching movies from:", `${API_URL}/movies`)
      const response = await axios.get(`${API_URL}/movies`)
      console.log("✅ Movies fetched successfully:", response.data)
      setMovies(response.data)
      setError(null)
    } catch (error) {
      console.error("❌ Error fetching movies:", error)
      setError(error.response?.data?.message || error.message || "Failed to fetch movies")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    let filtered = movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.added_by.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.vote_score - a.vote_score
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at)
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return b.vote_score - a.vote_score
      }
    })

    setFilteredMovies(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="ml-4 text-xl text-gray-700">Loading movies...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Film className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
            <p className="text-red-600 mb-6">{error}</p>
            <button onClick={fetchMovies} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getSortIcon = () => {
    switch (sortBy) {
      case "score":
        return <TrendingUp className="w-4 h-4" />
      case "newest":
        return <Clock className="w-4 h-4" />
      case "title":
        return <AlignLeft className="w-4 h-4" />
      default:
        return <TrendingUp className="w-4 h-4" />
    }
  }

  const getSortLabel = () => {
    switch (sortBy) {
      case "score":
        return "Top Rated"
      case "newest":
        return "Newest First"
      case "title":
        return "Alphabetical"
      default:
        return "Top Rated"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">

          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Movie <span className="text-blue-600">Recommendations</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing movies recommended by our community. Vote on your favorites and find your next great watch!
          </p>


        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search movies, descriptions, or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 shadow-sm"
              />
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Sort by:</span>
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-4 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm cursor-pointer"
                >
                  <option value="score">🏆 Top Rated</option>
                  <option value="newest">🕒 Newest First</option>
                  <option value="title">🔤 Alphabetical</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  {getSortIcon()}
                </div>
              </div>
            </div>
          </div>

          {/* Stats and Active Filters */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Star className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium">{filteredMovies.length} movies found</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    {getSortIcon()}
                  </div>
                  <span>Sorted by {getSortLabel()}</span>
                </div>
              </div>

              {searchTerm && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-200">
                  <Search className="w-4 h-4" />
                  <span className="text-sm font-medium">"{searchTerm}"</span>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => <MovieCard key={movie._id} movie={movie} />)
          ) : (
            <div className="col-span-full">
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 max-w-md mx-auto">
                  {searchTerm ? (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">No movies found</h3>
                      <p className="text-gray-600 mb-6">
                        We couldn't find any movies matching "{searchTerm}". Try a different search term or browse all movies.
                      </p>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="btn btn-primary"
                      >
                        Clear Search
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Film className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">No movies yet!</h3>
                      <p className="text-gray-600 mb-6">
                        Be the first to share a movie recommendation with the community.
                      </p>
                      {isAuthenticated ? (
                        <Link href="/add-movie" className="btn btn-primary">
                          Add First Movie
                        </Link>
                      ) : (
                        <div className="space-y-3">
                          <Link href="/login" className="btn btn-primary block">
                            Login to Add Movies
                          </Link>
                          <p className="text-sm text-gray-500">
                            Join our community to start sharing recommendations
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

     
      </div>
    </div>
  )
}

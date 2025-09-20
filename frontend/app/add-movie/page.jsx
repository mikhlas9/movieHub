"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"
import { Film, Plus, X, FileText } from "lucide-react"

export default function AddMovie() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in all fields")
      return
    }

    setSubmitting(true)

    try {
      await axios.post(`${API_URL}/movies`, formData)
      router.push("/")
    } catch (error) {
      console.error("Error adding movie:", error)
      alert("Error adding movie. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
      
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Movie Recommendation</h1>
          <p className="text-gray-600">Share a movie you love with the community</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Movie Title *
              </label>
              <div className="relative">
                <Film className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="Enter the movie title"
                  disabled={submitting}
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Why do you recommend this movie? *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 min-h-[120px] resize-vertical"
                  placeholder="Tell us what makes this movie special, memorable, or worth watching..."
                  disabled={submitting}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Share your thoughts, favorite scenes, or why others should watch it
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 btn btn-primary text-white font-semibold py-3 px-6 rounded-xl  transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 cursor-pointer"
                disabled={submitting}
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white crupo"></div>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add Movie
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex-1 sm:flex-initial bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 cursor-pointer"
                disabled={submitting}
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

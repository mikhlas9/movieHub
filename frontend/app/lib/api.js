// app/lib/api.js
import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API functions
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
}

export const moviesAPI = {
  getAll: (page = 1, limit = 10) => api.get(`/movies?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/movies/${id}`),
  create: (movieData) => api.post('/movies', movieData),
  delete: (id) => api.delete(`/movies/${id}`),
  search: (query, page = 1) => api.get(`/movies/search/${query}?page=${page}`),
}

export const votesAPI = {
  vote: (movieId, voteType) => api.post('/votes', { movie_id: movieId, vote_type: voteType }),
  getMovieVotes: (movieId) => api.get(`/votes/movie/${movieId}`),
  delete: (voteId) => api.delete(`/votes/${voteId}`),
}

export const commentsAPI = {
  getByMovie: (movieId, page = 1) => api.get(`/comments/movie/${movieId}?page=${page}`),
  create: (commentData) => api.post('/comments', commentData),
  update: (id, body) => api.put(`/comments/${id}`, { body }),
  delete: (id) => api.delete(`/comments/${id}`),
  getByUser: (userId, page = 1) => api.get(`/comments/user/${userId}?page=${page}`),
}

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (page = 1, search = '') => api.get(`/admin/users?page=${page}&search=${search}`),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getMovies: (page = 1, search = '') => api.get(`/admin/movies?page=${page}&search=${search}`),
  getComments: (page = 1) => api.get(`/admin/comments?page=${page}`),
}
"use client"
import Link from "next/link"
import { useAuth } from "../contexts/AuthContext"
import { Film, User, LogOut, Shield, Plus, Home, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container">
        <div className="flex justify-between items-center py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105"
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <Film className="w-6 h-6" />
            </div>
            MovieHub
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
                <Link
                  href="/movies"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                >
                  <Film className="w-4 h-4" />
                  Movies
                </Link>
                <Link
                  href="/add-movie"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Add Movie
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-200"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}

                <div className="h-6 w-px bg-border mx-2" />

                {user && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Hello, {user.name}</span>
                  </div>
                )}

                <button
                  onClick={logout}
                  className="btn btn-secondary  hover:text-destructive-foreground ml-2 cursor-pointer hover:border-r-red-600"
                >
                  <LogOut className="w-4 h-4 mr-1 cursor-pointer " />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/movies"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                >
                  <Film className="w-4 h-4" />
                  Browse Movies
                </Link>
                <Link href="/login" className="btn btn-primary ml-2">
                  <User className="w-4 h-4 mr-1" />
                  Login
                </Link>
                <Link href="/register" className="btn btn-accent">
                  <Plus className="w-4 h-4 mr-1" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="relative w-6 h-6">
              <Menu
                className={`w-6 h-6 absolute transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0 rotate-180" : "opacity-100 rotate-0"
                }`}
              />
              <X
                className={`w-6 h-6 absolute transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-180"
                }`}
              />
            </div>
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="w-5 h-5" />
                    Home
                  </Link>
                  <Link
                    href="/movies"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Film className="w-5 h-5" />
                    Movies
                  </Link>
                  <Link
                    href="/add-movie"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Plus className="w-5 h-5" />
                    Add Movie
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Shield className="w-5 h-5" />
                      Admin
                    </Link>
                  )}

                  {user && (
                    <div className="flex items-center gap-3 px-3 py-3 bg-muted rounded-lg mt-4">
                      <User className="w-5 h-5 text-primary" />
                      <span className="font-medium">Hello, {user.name}</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      logout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all duration-200 mt-2 cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/movies"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Film className="w-5 h-5" />
                    Browse Movies
                  </Link>
                  <Link
                    href="/login"
                    className="btn btn-primary justify-start gap-3 mt-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn-accent justify-start gap-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Plus className="w-5 h-5" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

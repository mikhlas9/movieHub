"use client"
import Link from "next/link"
import { useAuth } from "./contexts/AuthContext"
import { Film, Star, Users, TrendingUp, Play, LogIn, UserPlus, Sparkles } from "lucide-react"

export default function Home() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <div className="container section-padding">
        <div className="text-center mb-20">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="p-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl border border-primary/20 shadow-lg">
                <Film className="w-20 h-20 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-6 h-6 text-accent animate-pulse" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
            The Movie Platform for <span className="text-primary">Everyone</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed text-pretty">
            Discover amazing movies, share your recommendations, and connect with fellow movie enthusiasts. Vote on your
            favorites and help build the ultimate movie recommendation community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {isAuthenticated ? (
              <>
                <Link href="/movies" className="btn btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl">
                  <Play className="w-5 h-5 mr-2" />
                  Explore Movies
                </Link>
                <Link href="/add-movie" className="btn btn-accent text-lg px-8 py-4 shadow-xl hover:shadow-2xl">
                  <Film className="w-5 h-5 mr-2" />
                  Add Recommendation
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl">
                  <LogIn className="w-5 h-5 mr-2" />
                  Get Started
                </Link>
                <Link href="/register" className="btn btn-accent text-lg px-8 py-4 shadow-xl hover:shadow-2xl">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Join MovieHub
                </Link>
              </>
            )}
          </div>

          {isAuthenticated && user && (
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6 max-w-md mx-auto shadow-lg">
              <p className="text-foreground">
                Welcome back, <span className="font-semibold text-primary">{user.name}</span>! Ready to discover some
                great movies?
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="text-center p-8 bg-gradient-to-br from-card to-primary/5 rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 group hover:shadow-lg hover:-translate-y-1">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/20 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                <Star className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-foreground">Rate & Review</h3>
            <p className="text-muted-foreground leading-relaxed">
              Vote on movie recommendations and share your thoughts with detailed comments.
            </p>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-card to-accent/5 rounded-2xl border border-border hover:border-accent/30 transition-all duration-300 group hover:shadow-lg hover:-translate-y-1">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl border border-accent/20 group-hover:from-accent/30 group-hover:to-accent/20 transition-all duration-300">
                <Users className="w-8 h-8 text-accent" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-foreground">Community Driven</h3>
            <p className="text-muted-foreground leading-relaxed">
              Connect with movie lovers and build a community around great cinema.
            </p>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-card to-success/5 rounded-2xl border border-border hover:border-success/30 transition-all duration-300 group hover:shadow-lg hover:-translate-y-1">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-success/20 to-success/10 rounded-xl border border-success/20 group-hover:from-success/30 group-hover:to-success/20 transition-all duration-300">
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-foreground">Trending Picks</h3>
            <p className="text-muted-foreground leading-relaxed">
              Discover what&apos;s popular and find hidden gems recommended by the community.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/15 via-accent/10 to-primary/15 rounded-3xl p-8 lg:p-12 text-center border border-primary/20 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground text-balance">
            Join the Movie Revolution
          </h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto text-pretty">
            Be part of a growing community that&apos;s changing how we discover great movies
          </p>
          {!isAuthenticated && (
            <Link href="/register" className="btn btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl">
              <UserPlus className="w-5 h-5 mr-2" />
              Get Started Free
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

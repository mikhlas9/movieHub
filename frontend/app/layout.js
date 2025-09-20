import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './contexts/AuthContext'
import { Suspense } from "react"
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'MovieHub - Movie Recommendation Board',
  description: 'Discover, recommend, and discuss movies with the community',
  keywords: 'movies, recommendations, voting, community, film',
};

export default function RootLayout({ children }) {
  return (
     <html lang="en">
      <body>
          <AuthProvider>
        <Navbar />
          <Suspense fallback={null}>{children}</Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}

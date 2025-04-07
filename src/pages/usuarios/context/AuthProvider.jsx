import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import jwt_decode from "jwt-decode"
import { AuthContext } from "./AuthContext"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwt_decode(token)
        setUser(decoded)
      } catch (error) {
        console.error("Error decoding token:", error)
        logout()
      }
    }
    setLoading(false)
  }, [])

  const login = (token, userData) => {
    localStorage.setItem("token", token)
    setUser(userData)
    navigate("/")
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/login")
  }

  const isAuthenticated = () => {
    const token = localStorage.getItem("token")
    if (!token) return false

    try {
      const decoded = jwt_decode(token)
      return decoded.exp * 1000 > Date.now()
    } catch {
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

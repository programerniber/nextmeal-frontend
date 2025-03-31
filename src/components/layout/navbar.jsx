"use client"

import { useState, useEffect } from "react"
import { LogOut, X, Bell, Lock, Mail, Eye, EyeOff } from "lucide-react"
import { useSidebar } from "./sidebarUtils"


const Navbar = () => {
  const { isExpanded } = useSidebar()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [time, setTime] = useState(new Date())
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (email && password) {
      try {
        email === "admin@example.com" && password === "password"
          ? setShowLoginModal(false)
          : alert("Credenciales incorrectas")
      } catch (error) {
        console.error("Error de inicio de sesión", error)
        alert("Error en el inicio de sesión")
      }
    }
  }

  const closeModal = () => {
    setShowLoginModal(false)
    setEmail("")
    setPassword("")
  }

  const formatDateTime = (date, type) =>
    type === "time"
      ? date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      : date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

  return (
    <>
      <nav
        className={`
        fixed top-0 right-0 
        ${isExpanded ? "left-64" : "left-20"} 
        z-30 bg-gradient-to-r from-gray-900 to-gray-800 
        text-white shadow-2xl h-16 
        flex items-center justify-between px-6 
        border-b-4 border-orange-500 
        transition-all duration-300
      `}
      >
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <p className="font-medium">{formatDateTime(time)}</p>
            <p className="text-orange-400 font-bold">{formatDateTime(time, "time")}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative hover:text-orange-400 transition-colors">
            <Bell size={20} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              3
            </span>
          </button>

          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition-colors duration-300 flex items-center justify-center group"
          >
            <LogOut size={20} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </nav>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 relative border-4 border-orange-500 animate-bounce-in">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 hover:rotate-90 transition-all"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido</h2>
              <p className="text-gray-500">Inicia sesión en tu cuenta</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Correo electrónico"
                  required
                />
              </div>

              <div className="relative">
                <Lock size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {isPasswordVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors group"
              >
                <span className="group-hover:tracking-wider transition-all">Iniciar Sesión</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar


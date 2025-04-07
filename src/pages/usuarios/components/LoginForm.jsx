import { useState } from "react"
import { Mail, Lock } from "lucide-react"
import { loginUsuario } from "../api/usuarioService"
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
        const response = await loginUsuario(formData)
        // Verifica que response.token existe
        if (!response.token) {
          throw new Error("No se recibió token en la respuesta")
        }
        // Almacena el token
        localStorage.setItem("token", response.token)
        login(response.token, response.usuario)
        navigate("/")
      } catch (err) {
        // Manejo de errores mejorado
        const errorMsg = err.response?.data?.mensaje || 
                        err.message || 
                        "Error al iniciar sesión"
        setError(errorMsg)
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }

  return (
    <div className="max-w-md mx-auto bg-gray-900 rounded-xl shadow-md overflow-hidden md:max-w-2xl border border-gray-800 mt-10">
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Iniciar Sesión</h2>
          <p className="text-gray-400">Ingresa tus credenciales para acceder</p>
        </div>
        
        {error && (
          <div className="bg-red-900 text-white p-3 rounded-lg mb-6 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-gray-800 text-white pl-10 w-full p-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="tu@email.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                className="bg-gray-800 text-white pl-10 w-full p-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-gray-800"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Recordarme
              </label>
            </div>
            
            <div className="text-sm">
              <a href="/recuperar-contrasena" className="font-medium text-blue-500 hover:text-blue-400">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Iniciar Sesión
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            ¿No tienes una cuenta?{" "}
            <a href="/registrar" className="font-medium text-blue-500 hover:text-blue-400">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
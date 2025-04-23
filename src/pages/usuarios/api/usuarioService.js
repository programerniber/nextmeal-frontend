// import axios from "axios"

// Configura la URL base correctamente - Ajusta según tu entorno de Vite
const VITE_API_URL = "http://localhost:3000/api"
// Configurar axios para incluir cookies en las solicitudes
axios.defaults.withCredentials = true

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Limpiar estado de autenticación
      localStorage.removeItem('token');
    // Evitar redirección si ya estamos en la página de login
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
})

// Función para iniciar sesión
export const loginUsuario = async (credentials) => {
  try {
    const response = await axios.post(`${VITE_API_URL}/autenticacion/login`, credentials)
    return response.data
  } catch (error) {
    console.error("Error al iniciar sesión:", error)
    throw error
  }
}

// Función para cerrar sesión
export const logoutUsuario = async () => {
  try {
    const response = await axios.post(`${VITE_API_URL}/autenticacion/logout`)
    return response.data
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
    throw error
  }
}

// Función para obtener el usuario autenticado
export const getUsuarioAutenticado = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/autenticacion/usuario-autenticado`, {
      withCredentials: true
    });
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener usuario autenticado:", error);
    throw error;
  }
}

// Función para obtener un usuario por ID
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${VITE_API_URL}/autenticacion/usuarios/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${id}:`, error)
    throw error
  }
}

// Funciones para gestión de usuarios
export const fetchUsuarios = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/autenticacion/usuarios`)
    return response.data.usuarios
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    throw error
  }
}

export const createUsuario = async (usuarioData) => {
  try {
    const response = await axios.post(`${VITE_API_URL}/autenticacion/usuarios`, usuarioData)
    return response.data
  } catch (error) {
    console.error("Error al crear usuario:", error)
    throw error
  }
}

export const updateUsuario = async (id, usuarioData) => {
  try {
    const response = await axios.put(`${VITE_API_URL}/autenticacion/usuarios/${id}`, usuarioData)
    return response.data
  } catch (error) {
    console.error(`Error al actualizar usuario con ID ${id}:`, error)
    throw error
  }
}

export const deleteUsuario = async (id) => {
  try {
    const response = await axios.delete(`${VITE_API_URL}/autenticacion/usuarios/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error al eliminar usuario con ID ${id}:`, error)
    throw error
  }
}

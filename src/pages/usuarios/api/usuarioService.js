import axios from "axios"

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
      localStorage.removeItem("token")
      // Evitar redirección si ya estamos en la página de login
      if (error.response?.status === 401 && !window.location.pathname.includes("/login")) {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

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
      withCredentials: true,
    })
    return response.data.data
  } catch (error) {
    console.error("Error al obtener usuario autenticado:", error)
    throw error
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
    return response.data.usuarios || response.data
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
    // Intentar con PUT primero
    try {
      const response = await axios.put(`${VITE_API_URL}/autenticacion/usuarios/${id}`, usuarioData)
      return response.data
    } catch (putError) {
      console.log("PUT falló, intentando con PATCH como fallback:", putError.message)

      // Si falla el PUT, intentar con PATCH como fallback (solo para los campos proporcionados)
      const response = await axios.patch(`${VITE_API_URL}/autenticacion/usuarios/${id}`, usuarioData)
      return response.data
    }
  } catch (error) {
    console.error(`Error al actualizar usuario con ID ${id}:`, error)

    // Proporcionar un mensaje de error más descriptivo
    const errorMessage =
      error.response?.data?.mensaje ||
      error.response?.data?.error ||
      error.message ||
      "Error desconocido al actualizar usuario"

    const customError = new Error(errorMessage)
    customError.status = error.response?.status
    customError.details = error.response?.data
    throw customError
  }
}

export const deleteUsuario = async (id) => {
  try {
    // Verificar primero si el usuario existe
    try {
      await axios.get(`${VITE_API_URL}/autenticacion/usuarios/${id}`)
    } catch (getError) {
      if (getError.response?.status === 404) {
        // Si el usuario no existe, consideramos que ya está "eliminado"
        console.log(`Usuario con ID ${id} no encontrado, considerando como ya eliminado`)
        return { success: true, message: "Usuario no encontrado (considerado como eliminado)" }
      }
    }

    // Intentar eliminar el usuario
    const response = await axios.delete(`${VITE_API_URL}/autenticacion/usuarios/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error al eliminar usuario con ID ${id}:`, error)

    // Proporcionar un mensaje de error más descriptivo
    const errorMessage =
      error.response?.data?.mensaje ||
      error.response?.data?.error ||
      error.message ||
      "Error desconocido al eliminar usuario"

    const customError = new Error(errorMessage)
    customError.status = error.response?.status
    customError.details = error.response?.data
    throw customError
  }
}

// Función para cambiar el estado de un usuario
export const toggleUsuarioEstado = async (id, estadoActual) => {
  try {
    const nuevoEstado = estadoActual === "activo" ? "inactivo" : "activo"
    console.log(`Cambiando estado del usuario ${id} de ${estadoActual} a ${nuevoEstado}`)

    // Intentar con PATCH primero (método recomendado para actualizaciones parciales)
    try {
      const response = await axios.put(`${VITE_API_URL}/autenticacion/usuarios/${id}`, {
        estado: nuevoEstado,
      })
      console.log("Respuesta del servidor (PATCH):", response.data)
      return response.data
    } catch (patchError) {
      console.log("PATCH falló, intentando con PUT como fallback:", patchError.message)

      // Si falla el PATCH, intentar con PUT como fallback
      const response = await axios.put(`${VITE_API_URL}/autenticacion/usuarios/${id}`, {
        estado: nuevoEstado,
      })

      console.log("Respuesta del servidor (fallback):", response.data)
      return response.data
    }
  } catch (error) {
    console.error("Error al cambiar estado del usuario:", error)
    throw error
  }
}

// Función para obtener todos los roles
export const fetchRoles = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/rol`)
    return response.data.data || response.data
  } catch (error) {
    console.error("Error al obtener roles:", error)
    throw error
  }
}

// Añadir la función verificarDuplicado después de fetchRoles
// Función para verificar si existe un duplicado (cédula, email, etc.)
export const verificarDuplicado = async (campo, valor) => {
  try {
    // Primero intentamos con la ruta específica para verificar duplicados
    try {
      const response = await axios.get(`${VITE_API_URL}/autenticacion/verificar-duplicado`, {
        params: { campo, valor },
      })
      return response.data
    } catch (routeError) {
      console.log("Ruta específica no disponible, usando método alternativo:", routeError.message)

      // Si la ruta específica falla, hacemos una verificación manual obteniendo todos los usuarios
      // y verificando si existe alguno con el valor especificado para el campo dado
      const usuarios = await fetchUsuarios()

      // Verificar si existe algún usuario con el mismo valor para el campo especificado
      const duplicado = usuarios.some(
        (usuario) => usuario[campo] && usuario[campo].toString().toLowerCase() === valor.toString().toLowerCase(),
      )

      return {
        duplicado,
        mensaje: duplicado ? `Ya existe un usuario con este ${campo}` : `No existe un usuario con este ${campo}`,
      }
    }
  } catch (error) {
    console.error(`Error al verificar duplicado de ${campo}:`, error)
    // En caso de error, asumimos que no hay duplicado para no bloquear al usuario
    return { duplicado: false, mensaje: "No se pudo verificar duplicados" }
  }
}

// Función para obtener los permisos de un usuario
export const obtenerPermisosUsuario = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/autenticacion/permisos`)
    return response.data
  } catch (error) {
    console.error("Error al obtener permisos del usuario:", error)
    throw error
  }
}

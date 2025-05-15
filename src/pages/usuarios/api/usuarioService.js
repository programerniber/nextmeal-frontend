import axios from "axios"

// Configura la URL base correctamente - Ajusta según tu entorno de Vite
const VITE_API_URL = "http://localhost:3000/api"
// Configurar axios para incluir cookies en las solicitudes
axios.defaults.withCredentials = true

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo redirigir al login en caso de error 401 y si no estamos intentando obtener permisos
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/permisos") &&
      !error.config.url.includes("/permiso") &&
      !window.location.pathname.includes("/login")
    ) {
      console.log("Error 401 detectado, redirigiendo al login")
      localStorage.removeItem("token")
      window.location.href = "/login"
    }

    // Para errores 403, solo registrar el error pero no redirigir
    if (error.response?.status === 403) {
      console.log("Error 403 detectado: Acceso prohibido")
      // No redirigir al login para errores 403
    }

    return Promise.reject(error)
  },
)

// Función para iniciar sesión
export const loginUsuario = async (credentials) => {
  try {
    const response = await axios.post(`${VITE_API_URL}/autenticacion/register`, credentials)
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
    // Verificar si hay un token antes de hacer la solicitud
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("No hay token de autenticación")
    }

    const response = await axios.get(`${VITE_API_URL}/autenticacion/usuario-autenticado`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    const token = localStorage.getItem("token")
    const response = await axios.get(`${VITE_API_URL}/autenticacion/usuarios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${id}:`, error)
    throw error
  }
}

// Funciones para gestión de usuarios
export const fetchUsuarios = async () => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.get(`${VITE_API_URL}/autenticacion/usuarios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data.usuarios || response.data
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    throw error
  }
}

export const createUsuario = async (usuarioData) => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.post(`${VITE_API_URL}/autenticacion/usuarios`, usuarioData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error al crear usuario:", error)
    throw error
  }
}

export const updateUsuario = async (id, usuarioData) => {
  try {
    const token = localStorage.getItem("token")
    // Intentar con PUT primero
    try {
      const response = await axios.put(`${VITE_API_URL}/autenticacion/usuarios/${id}`, usuarioData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (putError) {
      console.log("PUT falló, intentando con PATCH como fallback:", putError.message)

      // Si falla el PUT, intentar con PATCH como fallback (solo para los campos proporcionados)
      const response = await axios.patch(`${VITE_API_URL}/autenticacion/usuarios/${id}`, usuarioData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
    const token = localStorage.getItem("token")
    // Verificar primero si el usuario existe
    try {
      await axios.get(`${VITE_API_URL}/autenticacion/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (getError) {
      if (getError.response?.status === 404) {
        // Si el usuario no existe, consideramos que ya está "eliminado"
        console.log(`Usuario con ID ${id} no encontrado, considerando como ya eliminado`)
        return { success: true, message: "Usuario no encontrado (considerado como eliminado)" }
      }
    }

    // Intentar eliminar el usuario
    const response = await axios.delete(`${VITE_API_URL}/autenticacion/usuarios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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
    const token = localStorage.getItem("token")
    // Manejar el caso cuando estadoActual es undefined
    let nuevoEstado
    if (estadoActual === undefined || estadoActual === null) {
      // Si el estado actual no está definido, establecerlo como "activo" por defecto
      nuevoEstado = "activo"
      console.log(`Cambiando estado del usuario ${id} a ${nuevoEstado} (estado anterior no definido)`)
    } else {
      // Cambiar entre "activo" e "inactivo"
      nuevoEstado = estadoActual === "activo" ? "inactivo" : "activo"
      console.log(`Cambiando estado del usuario ${id} de ${estadoActual} a ${nuevoEstado}`)
    }

    // Intentar con PATCH primero
    try {
      const res = await axios.patch(
        `${VITE_API_URL}/autenticacion/usuarios/${id}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      console.log("Respuesta del servidor (PATCH):", res.data)
      return res.data
    } catch (patchError) {
      // Si falla el PATCH, intentar con PUT como fallback
      console.log("PATCH falló, intentando con PUT como fallback:", patchError.message)

      const res = await axios.put(
        `${VITE_API_URL}/autenticacion/usuarios/${id}`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      console.log("Respuesta del servidor (fallback):", res.data)
      return res.data
    }
  } catch (error) {
    console.error("Error al cambiar estado del usuario:", error)
    if (error.response?.data?.mensaje) {
      error.message = error.response.data.mensaje
    }
    throw error
  }
}

// Función para obtener todos los roles
export const fetchRoles = async () => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.get(`${VITE_API_URL}/rol`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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
    const token = localStorage.getItem("token")
    // Primero intentamos con la ruta específica para verificar duplicados
    try {
      const response = await axios.get(`${VITE_API_URL}/autenticacion/verificar-duplicado`, {
        params: { campo, valor },
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    const token = localStorage.getItem("token")
    if (!token) {
      console.log("No hay token para obtener permisos")
      return { permisos: [] }
    }

    // Obtener el usuario del localStorage para conseguir su rol
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      console.log("No hay información de usuario almacenada")
      return { permisos: [] }
    }

    const userData = JSON.parse(storedUser)
    if (!userData || !userData.id_rol) {
      console.log("No se pudo obtener el rol del usuario")
      return { permisos: [] }
    }

    // Intentar con diferentes endpoints en orden de prioridad
    const endpoints = [
      // 1. Endpoint específico de permisos de usuario
      {
        url: `${VITE_API_URL}/autenticacion/permisos`,
        description: "Endpoint de permisos de usuario",
      },
      // 2. Endpoint de permisos por rol
      {
        url: `${VITE_API_URL}/permiso/rol/${userData.id_rol}`,
        description: "Endpoint de permisos por rol",
      },
      // 3. Endpoint genérico de permisos
      {
        url: `${VITE_API_URL}/permiso`,
        description: "Endpoint genérico de permisos",
      },
      // 4. Endpoint alternativo de permisos por rol
      {
        url: `${VITE_API_URL}/rol/${userData.id_rol}/permisos`,
        description: "Endpoint alternativo de permisos por rol",
      },
    ]

    // Intentar cada endpoint en orden hasta que uno funcione
    for (const endpoint of endpoints) {
      try {
        console.log(`Intentando obtener permisos desde: ${endpoint.description}`)
        const response = await axios.get(endpoint.url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // Importante: No redirigir al login si hay un error 403 o 404
          validateStatus: (status) => {
            return status < 500 // Resolver solo si el código de estado es menor que 500
          },
        })

        // Verificar si la respuesta contiene permisos
        if (response.status === 200) {
          const data = response.data
          if (data && (data.permisos || (Array.isArray(data) && data.length > 0))) {
            const permisosArray = data.permisos || data
            console.log(`Permisos obtenidos exitosamente desde: ${endpoint.description}`, permisosArray)

            // Asegurarse de que los permisos tengan el formato correcto
            const permisosFormateados = permisosArray.map((p) => {
              if (typeof p === "string") {
                // Si es un string, intentar convertirlo a objeto
                const [recurso, accion] = p.split(".")
                return accion ? { recurso, accion } : { recurso: p, accion: "ver" }
              }
              return p
            })

            return {
              permisos: permisosFormateados,
              source: endpoint.description,
            }
          }
        } else {
          console.log(`Respuesta no exitosa desde ${endpoint.description}: ${response.status}`)
        }
      } catch (error) {
        // No lanzar el error, solo registrarlo y continuar con el siguiente endpoint
        console.log(`Error al obtener permisos desde ${endpoint.description}: ${error.message}`)
      }
    }

    // Si llegamos aquí, ningún endpoint funcionó
    console.log("No se pudieron obtener permisos de ningún endpoint, usando permisos predeterminados")

    // Usar permisos predeterminados basados en el rol
    if (userData.id_rol === 1) {
      console.log("Usando permisos predeterminados para administrador")
      return {
        permisos: [
          { recurso: "usuarios", accion: "crear" },
          { recurso: "usuarios", accion: "editar" },
          { recurso: "usuarios", accion: "ver" },
          { recurso: "productos", accion: "crear" },
          { recurso: "productos", accion: "editar" },
          { recurso: "productos", accion: "ver" },
          { recurso: "categorias", accion: "crear" },
          { recurso: "categorias", accion: "editar" },
          { recurso: "categorias", accion: "ver" },
          { recurso: "ventas", accion: "crear" },
          { recurso: "ventas", accion: "editar" },
          { recurso: "ventas", accion: "ver" },
          { recurso: "pedidos", accion: "crear" },
          { recurso: "pedidos", accion: "editar" },
          { recurso: "pedidos", accion: "ver" },
          { recurso: "clientes", accion: "crear" },
          { recurso: "clientes", accion: "editar" },
          { recurso: "clientes", accion: "ver" },
        ],
        source: "permisos predeterminados para administrador",
      }
    }

    // Para otros roles, devolver un conjunto básico de permisos
    console.log("Usando permisos predeterminados para rol no administrador")
    return {
      permisos: [
        { recurso: "productos", accion: "ver" },
        { recurso: "categorias", accion: "ver" },
        { recurso: "ventas", accion: "ver" },
        { recurso: "pedidos", accion: "ver" },
        { recurso: "clientes", accion: "ver" },
      ],
      source: "permisos predeterminados para usuario",
    }
  } catch (error) {
    console.error("Error al obtener permisos del usuario:", error)
    // Devolver un objeto con permisos básicos para evitar errores y redirecciones
    return {
      permisos: [
        { recurso: "productos", accion: "ver" },
        { recurso: "categorias", accion: "ver" },
        { recurso: "ventas", accion: "ver" },
        { recurso: "pedidos", accion: "ver" },
        { recurso: "clientes", accion: "ver" },
      ],
      source: "permisos de emergencia por error",
    }
  }
}

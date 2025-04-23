// import axios from "axios"

// // Configura la URL base correctamente
// const VITE_API_URL = "http://localhost:3000/api"

// // Configuración de interceptores
// axios.interceptors.request.use(config => {
//   const token = localStorage.getItem("token")
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// axios.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token")
//       window.location.href = "/login"
//     }
//     return Promise.reject(error)
//   }
// )

// // Funciones corregidas
// export const fetchUsuarios = async () => {
//   try {
//     const response = await axios.get(VITE_API_URL)  // Sin la barra final
//     return response.data.data
//   } catch (error) {
//     console.error("Error al obtener usuarios:", error)
//     throw new Error(error.response?.data?.message || "Error al cargar usuarios")
//   }
// }

// // Las demás funciones mantienen la misma estructura pero con las rutas correctas
// export const createUsuario = async (usuarioData) => {
//   const response = await axios.post(`${VITE_API_URL}/registrar`, usuarioData)
//   return response.data.data
// }

// export const updateUsuario = async (id, usuarioData) => {
//   return await axios.put(`${VITE_API_URL}/${id}`, usuarioData)
// }

// export const deleteUsuario = async (id) => {
//   return await axios.delete(`${VITE_API_URL}/${id}`)
// }

// export const changeRolUsuario = async (id, nuevoRol) => {
//   return await axios.patch(`${VITE_API_URL}/${id}/rol`, { nuevoRol })
// }

// export const loginUsuario = async (credentials) => {
//   return await axios.post(`${VITE_API_URL}/login`, credentials)
// }
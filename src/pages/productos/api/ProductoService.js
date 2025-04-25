import axios from "axios"

const VITE_API_URL = "http://localhost:3000/api"

// ✅ Crear producto (POST)
export const createProducto = async (productoData) => {
  try {
    console.log("Enviando datos al servidor:", productoData)
    const res = await axios.post(`${VITE_API_URL}/productos`, productoData)
    console.log("Respuesta del servidor:", res.data)
    return res.data.data
  } catch (error) {
    if (error.response?.data?.errores) {
      console.error("Errores del backend:", error.response.data.errores)
      error.response.data.errores.forEach((err, index) => {
        console.error(`Error ${index + 1}:`, err)
      })
      const errorMessage = error.response.data.errores
        .map((err) => (typeof err === "string" ? err : err.mensaje || JSON.stringify(err)))
        .join(", ")
      error.message = errorMessage || error.message
    } else if (error.response?.data?.mensaje) {
      console.error("Mensaje de error del backend:", error.response.data.mensaje)
      error.message = error.response.data.mensaje
    } else {
      console.error("Error al crear producto:", error.message)
    }
    throw error
  }
}

// ✅ Obtener todos los productos (GET)
export const fetchProductos = async () => {
  try {
    const res = await axios.get(`${VITE_API_URL}/productos`)
    return res.data.data
  } catch (error) {
    console.error("Error al obtener productos", error)
    throw error
  }
}

// ✅ Obtener producto por ID (GET)
export const fetchProductoById = async (id) => {
  try {
    const res = await axios.get(`${VITE_API_URL}/productos/${id}`)
    return res.data.data
  } catch (error) {
    console.error("Error al obtener producto por ID", error)
    if (error.response?.data?.mensaje) {
      error.message = error.response.data.mensaje
    }
    throw error
  }
}

// ✅ Actualizar producto por ID (PUT)
export const updateProducto = async (id, productoData) => {
  try {
    console.log(`Actualizando producto con ID ${id}:`, productoData)
    const res = await axios.put(`${VITE_API_URL}/productos/${id}`, productoData)
    console.log("Respuesta del servidor:", res.data)
    return res.data.data
  } catch (error) {
    console.error("Error al actualizar producto", error)
    if (error.response?.data?.mensaje) {
      error.message = error.response.data.mensaje
    }
    throw error
  }
}

// ✅ Eliminar producto por ID (DELETE)
export const deleteProducto = async (id) => {
  try {
    console.log(`Eliminando producto con ID: ${id}`)
    const res = await axios.delete(`${VITE_API_URL}/productos/${id}`)
    console.log("Producto eliminado:", res.data.message || res.data)
    return res.data
  } catch (error) {
    console.error("Error al eliminar producto", error)
    if (error.response?.data?.mensaje) {
      error.message = error.response.data.mensaje
    }
    throw error
  }
}

// ✅ Cambiar estado del producto (PATCH)
export const toggleProductoEstado = async (id, estadoActual) => {
  try {
    const nuevoEstado = estadoActual === "activo" ? "inactivo" : "activo"
    console.log(`Cambiando estado del producto ${id} de ${estadoActual} a ${nuevoEstado}`)

    // Modificado para usar el endpoint correcto
    const res = await axios.patch(`${VITE_API_URL}/productos/${id}`, {
      estado: nuevoEstado,
    })

    console.log("Estado del producto actualizado:", res.data.data)
    return res.data.data
  } catch (error) {
    console.error("Error al cambiar estado del producto", error)
    if (error.response?.data?.mensaje) {
      error.message = error.response.data.mensaje
    }
    throw error
  }
}

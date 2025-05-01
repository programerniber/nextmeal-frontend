// Servicio para manejar las operaciones de ventas
import axios from "axios"

const VITE_API_URL = "http://localhost:3000/api" 
// URL base para obtener todas las ventas
export const fetchVentas = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/ventas`,)
    
    return response.data.data
  } catch (error) {
    console.error("Error al obtener ventas:", error)
    throw error
  }
}

// Obtener una venta por ID
export const fetchVentaById = async (id) => {
  try {
    const response = await axios.get(`${VITE_API_URL}/ventas/${id}`)
    return response.data.data
  } catch (error) {
    console.error(`Error al obtener venta con ID ${id}:`, error)
    throw error
  }
}

// Crear una nueva venta
export const createVenta = async (ventaData) => {
  try {
    const response = await axios.post(`${VITE_API_URL}/ventas`, ventaData)
    
    return response?.data?.data;

  } catch (error) {
    console.error("Error al crear venta:", error)
    throw error.response?.data || error
  }
}

// Actualizar una venta existente
export const updateVenta = async (id, ventaData) => {
  try {
    const response = await axios.put(`${VITE_API_URL}/ventas/${id}`, ventaData)
    return response?.data?.data
  } catch (error) {
    console.error(`Error al actualizar venta con ID ${id}:`, error)
    throw error.response?.data || error
  }
}

// Eliminar una venta
export const deleteVenta = async (id) => {
  try {
    const response = await axios.delete(`${VITE_API_URL}/ventas/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error al eliminar venta con ID ${id}:`, error)
    throw error
  }
}

// Obtener pedidos en estado "terminado" para crear ventas
export const fetchPedidosTerminados = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/pedidos/pedido?estado=terminado`)
    return response.data.data
  } catch (error) {
    console.error("Error al obtener pedidos terminados:", error)
    throw error
  }
}


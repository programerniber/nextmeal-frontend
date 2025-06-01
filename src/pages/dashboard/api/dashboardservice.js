import axios from "axios"

const VITE_API_URL = "http://localhost:3000/api"

export const obtenerResumenDashboard = async () => {
  try {
    const token = localStorage.getItem("token")
    const res = await axios.get(`${VITE_API_URL}/dashboard/resumen`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data.data
  } catch (error) {
    console.log(error)
    return null
  }
}

export const obtenerVentasRecientes = async () => {
  try {
    const token = localStorage.getItem("token")
    const res = await axios.get(`${VITE_API_URL}/dashboard/ventas-recientes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data.data
  } catch (error) {
    console.log(error)
    return []
  }
}

export const obtenerEstadisticasPorPeriodo = async (periodo = "mensual") => {
  try {
    const token = localStorage.getItem("token")
    const res = await axios.get(`${VITE_API_URL}/dashboard/estadisticas/${periodo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data.data
  } catch (error) {
    console.log(error)
    return {}
  }
}

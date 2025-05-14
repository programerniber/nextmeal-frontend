import axios from "axios"

const VITE_API_URL = "http://localhost:3000/api"

export const obtenerResumenDashboard = async() => {
    try{
        const res = await axios.get(`${VITE_API_URL}/dashboard/resumen`)
        return res.data.data
        
    }catch(error){
        console.log(error)
        return null
    }
}

export const obtenerVentasRecientes = async() => {
    try{
        const res = await axios.get(`${VITE_API_URL}/dashboard/ventas-recientes`)
        return res.data.data
    }catch(error){
        console.log(error)
        return []
    }
}

export const obtenerEstadisticasPorPeriodo = async(periodo = 'mensual') => {
    try{
        const res = await axios.get(`${VITE_API_URL}/dashboard/estadisticas/${periodo}`)
        return res.data.data
    }catch(error){
        console.log(error)
        return {}
    }
}


import axios from "axios";

// Configuración centralizada de la API
const API_CONFIG = {
  baseURL: "http://localhost:3000/api",
  timeout: 10000, // 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
};

// Crear instancia de axios con configuración centralizada
const apiClient = axios.create(API_CONFIG);

// Interceptor para manejo global de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en API Dashboard:", {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Función helper para manejar errores de manera consistente
const handleApiError = (error, defaultValue, operation) => {
  console.error(`Error en ${operation}:`, {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
  });
  return defaultValue;
};

// 🔧 FUNCIÓN CORREGIDA - Obtener resumen general del dashboard
export const obtenerResumenDashboard = async () => {
  try {
    const response = await apiClient.get("/dashboard/resumen");

    // Validar estructura de datos esperada
    const data = response.data?.data || response.data;

    // ✅ LOGS MEJORADOS PARA DEBUG
    console.log("=== RESUMEN DASHBOARD DEBUG ===");
    console.log("Respuesta completa:", response.data);
    console.log("Data extraída:", data);
    console.log("Ventas Hoy recibida:", data?.ventasHoy);
    console.log("Total Ventas recibida:", data?.totalVentas);
    console.log("Estructura completa de data:", JSON.stringify(data, null, 2));
    console.log("===============================");

    // 🔧 CORRECCIÓN: Mejorar la extracción de datos con múltiples alternativas
    const ventasHoy = 
      Number(data?.ventasHoy) || 
      Number(data?.ventas_hoy) || 
      Number(data?.ventasDelDia) || 
      Number(data?.ventas_dia) ||
      Number(data?.hoy) || 0;

    const totalVentas = 
      Number(data?.totalVentas) || 
      Number(data?.total_ventas) ||
      Number(data?.ventasSemanales) || 
      Number(data?.ventas_semanales) ||
      Number(data?.ventasSemana) ||
      Number(data?.ventas_semana) ||
      Number(data?.total) || 0;

    // 🔧 NUEVO: Verificar si los datos son arrays y sumar
    let ventasHoyCalculadas = ventasHoy;
    let totalVentasCalculadas = totalVentas;

    // Si ventasHoy es un array, sumar todos los valores
    if (Array.isArray(data?.ventasHoy)) {
      ventasHoyCalculadas = data.ventasHoy.reduce((sum, item) => 
        sum + (Number(item?.monto) || Number(item?.total) || Number(item) || 0), 0
      );
    }

    // Si totalVentas es un array, sumar todos los valores
    if (Array.isArray(data?.totalVentas) || Array.isArray(data?.ventasSemanales)) {
      const arrayData = data?.totalVentas || data?.ventasSemanales;
      totalVentasCalculadas = arrayData.reduce((sum, item) => 
        sum + (Number(item?.monto) || Number(item?.total) || Number(item) || 0), 0
      );
    }

    const resultado = {
      ventasHoy: ventasHoyCalculadas,
      totalVentas: totalVentasCalculadas,
      metodoPago: {
        efectivo: Number(data?.metodoPago?.efectivo) || Number(data?.efectivo?.monto) || 0,
        transferencia: Number(data?.metodoPago?.transferencia) || Number(data?.transferencia?.monto) || 0,
      },
      fechaActualizacion: data?.fechaActualizacion || new Date(),
    };

    console.log("=== RESULTADO FINAL RESUMEN ===");
    console.log("Ventas Hoy calculadas:", resultado.ventasHoy);
    console.log("Total Ventas calculadas:", resultado.totalVentas);
    console.log("===============================");

    return resultado;
  } catch (error) {
    return handleApiError(
      error,
      {
        ventasHoy: 0,
        totalVentas: 0,
        metodoPago: {
          efectivo: 0,
          transferencia: 0,
        },
        fechaActualizacion: new Date(),
      },
      "obtenerResumenDashboard"
    );
  }
};

// 🆕 FUNCIÓN MEJORADA - Obtener ventas del día específicamente
export const obtenerVentasDelDia = async () => {
  try {
    // Probar múltiples endpoints posibles
    const endpoints = [
      "/dashboard/ventas/hoy",
      "/dashboard/ventas/dia",
      "/dashboard/ventas-hoy",
      "/ventas/hoy",
      "/dashboard/resumen/hoy"
    ];

    let response = null;
    let data = null;

    for (const endpoint of endpoints) {
      try {
        response = await apiClient.get(endpoint);
        data = response.data?.data || response.data;
        if (data && (Number(data.total) > 0 || Number(data.ventasHoy) > 0 || Array.isArray(data))) {
          console.log(`✅ Datos encontrados en endpoint: ${endpoint}`, data);
          break;
        }
      } catch  {
        console.log(`❌ Endpoint ${endpoint} no disponible`);
        continue;
      }
    }

    if (!data) {
      throw new Error("No se pudieron obtener datos de ventas del día");
    }

    // Procesar los datos según su estructura
    let ventasHoy = 0;

    if (Array.isArray(data)) {
      // Si es un array de ventas, sumar todos los totales
      ventasHoy = data.reduce((sum, venta) => 
        sum + (Number(venta.total_pagar) || Number(venta.total) || Number(venta.monto) || 0), 0
      );
    } else if (typeof data === 'object') {
      // Si es un objeto con propiedades
      ventasHoy = 
        Number(data.ventasHoy) || 
        Number(data.total) || 
        Number(data.monto) || 
        Number(data.ventas_hoy) || 0;
    }

    console.log("=== VENTAS DEL DÍA DEBUG ===");
    console.log("Ventas del día calculadas:", ventasHoy);
    console.log("============================");

    return {
      ventasHoy,
      fecha: new Date().toISOString().split('T')[0],
      fechaActualizacion: new Date(),
    };
  } catch (error) {
    return handleApiError(
      error,
      {
        ventasHoy: 0,
        fecha: new Date().toISOString().split('T')[0],
        fechaActualizacion: new Date(),
      },
      "obtenerVentasDelDia"
    );
  }
};

// 🆕 FUNCIÓN MEJORADA - Obtener ventas semanales específicamente
export const obtenerVentasSemanales = async () => {
  try {
    // Probar múltiples endpoints posibles
    const endpoints = [
      "/dashboard/ventas/semanales",
      "/dashboard/ventas/semana",
      "/dashboard/estadisticas/semanal",
      "/ventas/semanales",
      "/dashboard/resumen/semanal"
    ];

    let response = null;
    let data = null;

    for (const endpoint of endpoints) {
      try {
        response = await apiClient.get(endpoint);
        data = response.data?.data || response.data;
        if (data && (Number(data.total) > 0 || Number(data.ventasSemanales) > 0 || Array.isArray(data))) {
          console.log(`✅ Datos semanales encontrados en endpoint: ${endpoint}`, data);
          break;
        }
      } catch  {
        console.log(`❌ Endpoint semanal ${endpoint} no disponible`);
        continue;
      }
    }

    let ventasSemanales = 0;

    if (data) {
      if (Array.isArray(data)) {
        // Si es un array de estadísticas diarias, sumar todos
        ventasSemanales = data.reduce((sum, dia) => 
          sum + (Number(dia.monto) || Number(dia.total) || Number(dia.ventas) || 0), 0
        );
      } else if (typeof data === 'object') {
        // Si es un objeto con propiedades
        ventasSemanales = 
          Number(data.ventasSemanales) || 
          Number(data.total) || 
          Number(data.monto) || 
          Number(data.ventas_semanales) || 0;
      }
    }

    // Si no obtuvimos datos, intentar calcular desde estadísticas semanales
    if (ventasSemanales === 0) {
      try {
        const estadisticas = await obtenerEstadisticasSemanal();
        if (Array.isArray(estadisticas) && estadisticas.length > 0) {
          ventasSemanales = estadisticas.reduce((total, dia) => total + (Number(dia.monto) || 0), 0);
          console.log("✅ Ventas semanales calculadas desde estadísticas:", ventasSemanales);
        }
      } catch  {
        console.log("❌ No se pudieron obtener estadísticas semanales");
      }
    }

    console.log("=== VENTAS SEMANALES DEBUG ===");
    console.log("Ventas semanales calculadas:", ventasSemanales);
    console.log("==============================");

    return {
      ventasSemanales,
      fechaInicio: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      fechaFin: new Date(),
    };
  } catch (error) {
    return handleApiError(
      error,
      {
        ventasSemanales: 0,
        fechaInicio: new Date(),
        fechaFin: new Date(),
      },
      "obtenerVentasSemanales"
    );
  }
};

// Obtener estadísticas semanales (para el gráfico de barras)
export const obtenerEstadisticasSemanal = async () => {
  try {
    const response = await apiClient.get("/dashboard/estadisticas/semanal");
    const data = response.data?.data || response.data;

    console.log("=== ESTADÍSTICAS SEMANALES DEBUG ===");
    console.log("Respuesta estadísticas:", data);
    console.log("Es array:", Array.isArray(data));
    console.log("====================================");

    // Validar que sea un array y tenga la estructura correcta
    if (Array.isArray(data)) {
      return data.map((item) => ({
        dia: item.dia || item.fecha || item.day || "N/A",
        fecha: item.fecha || item.dia || item.date || new Date().toISOString(),
        monto: Number(item.monto) || Number(item.total) || Number(item.ventas) || 0,
        cantidad: Number(item.cantidad) || Number(item.count) || 0,
      }));
    }

    return [];
  } catch (error) {
    return handleApiError(error, [], "obtenerEstadisticasSemanal");
  }
};

// Obtener métodos de pago del día (para el gráfico de dona)
export const obtenerMetodosPagoHoy = async () => {
  try {
    const response = await apiClient.get("/dashboard/metodos-pago/hoy");
    const data = response.data?.data || response.data;

    // ✅ LOGS PARA DEBUG MÉTODOS DE PAGO
    console.log("=== MÉTODOS DE PAGO DEBUG ===");
    console.log("Respuesta métodos pago:", data);
    console.log("Estructura completa:", JSON.stringify(data, null, 2));
    console.log("=============================");

    return {
      efectivo: {
        cantidad: Number(data?.efectivo?.cantidad) || 0,
        monto: Number(data?.efectivo?.monto) || 0,
        porcentaje: Number(data?.efectivo?.porcentaje) || 0,
      },
      transferencia: {
        cantidad: Number(data?.transferencia?.cantidad) || 0,
        monto: Number(data?.transferencia?.monto) || 0,
        porcentaje: Number(data?.transferencia?.porcentaje) || 0,
      },
      total: {
        cantidad: Number(data?.total?.cantidad) || 0,
        monto: Number(data?.total?.monto) || 0,
      },
    };
  } catch (error) {
    return handleApiError(
      error,
      {
        efectivo: { cantidad: 0, monto: 0, porcentaje: 0 },
        transferencia: { cantidad: 0, monto: 0, porcentaje: 0 },
        total: { cantidad: 0, monto: 0, porcentaje: 0 },
      },
      "obtenerMetodosPagoHoy"
    );
  }
};

// Obtener ventas recientes
export const obtenerVentasRecientes = async () => {
  try {
    const response = await apiClient.get("/dashboard/ventas/tiempo-real");
    const data = response.data?.data || response.data;

    console.log("=== VENTAS RECIENTES DEBUG ===");
    console.log("Respuesta ventas recientes:", response.data);
    console.log("Data de ventas:", data);
    console.log("Es array:", Array.isArray(data));
    console.log("==============================");

    // Validar que sea un array y sanitizar datos
    if (Array.isArray(data)) {
      return data.map((venta) => ({
        id: venta.id || venta.venta_id || "N/A",
        cliente_id: venta.cliente_id || venta.id_cliente || venta.cliente || "Cliente Anónimo",
        total_pagar: Number(venta.total_pagar) || Number(venta.total) || Number(venta.monto) || 0,
        createdAt: venta.createdAt || venta.fecha || venta.created_at || new Date().toISOString(),
        metodo_pago: venta.metodo_pago || venta.metodoPago || "No especificado",
        estado: venta.estado || venta.status || "Completado",
      }));
    }

    return [];
  } catch (error) {
    return handleApiError(error, [], "obtenerVentasRecientes");
  }
};

// 🔧 FUNCIÓN COMPLETAMENTE REESCRITA - Obtener todos los datos del dashboard
export const obtenerDatosDashboardCompleto = async () => {
  try {
    console.log("🚀 Iniciando carga completa del dashboard...");

    // Cargar datos en paralelo con manejo individual de errores
    const [resumenResult, estadisticasResult, metodosPagoResult, ventasResult, ventasHoyResult, ventasSemanalesResult] =
      await Promise.allSettled([
        obtenerResumenDashboard(),
        obtenerEstadisticasSemanal(),
        obtenerMetodosPagoHoy(),
        obtenerVentasRecientes(),
        obtenerVentasDelDia(), // 🆕 Nueva función específica
        obtenerVentasSemanales(), // 🆕 Función mejorada
      ]);

    // Procesar resumen base
    let resumenFinal = resumenResult.status === "fulfilled" 
      ? resumenResult.value 
      : { ventasHoy: 0, totalVentas: 0, metodoPago: { efectivo: 0, transferencia: 0 } };

    // 🔧 CORRECCIÓN: Priorizar datos específicos sobre datos generales
    if (ventasHoyResult.status === "fulfilled" && ventasHoyResult.value.ventasHoy > 0) {
      resumenFinal.ventasHoy = ventasHoyResult.value.ventasHoy;
      console.log("✅ Ventas hoy actualizadas desde endpoint específico:", resumenFinal.ventasHoy);
    }

    if (ventasSemanalesResult.status === "fulfilled" && ventasSemanalesResult.value.ventasSemanales > 0) {
      resumenFinal.totalVentas = ventasSemanalesResult.value.ventasSemanales;
      console.log("✅ Ventas semanales actualizadas desde endpoint específico:", resumenFinal.totalVentas);
    }

    // 🔧 NUEVO: Si aún tenemos 0 en ventas, intentar calcular desde ventas recientes
    if (resumenFinal.ventasHoy === 0 && ventasResult.status === "fulfilled") {
      const ventasRecientes = ventasResult.value;
      if (Array.isArray(ventasRecientes) && ventasRecientes.length > 0) {
        const hoy = new Date().toISOString().split('T')[0];
        const ventasDelDia = ventasRecientes.filter(venta => 
          venta.createdAt && venta.createdAt.startsWith(hoy)
        );
        
        if (ventasDelDia.length > 0) {
          resumenFinal.ventasHoy = ventasDelDia.reduce((sum, venta) => 
            sum + (Number(venta.total_pagar) || 0), 0
          );
          console.log("✅ Ventas hoy calculadas desde ventas recientes:", resumenFinal.ventasHoy);
        }
      }
    }

    const resultado = {
      resumen: resumenFinal,
      estadisticasSemana: estadisticasResult.status === "fulfilled" ? estadisticasResult.value : [],
      metodosPago: metodosPagoResult.status === "fulfilled" 
        ? metodosPagoResult.value 
        : {
            efectivo: { cantidad: 0, monto: 0, porcentaje: 0 },
            transferencia: { cantidad: 0, monto: 0, porcentaje: 0 },
            total: { cantidad: 0, monto: 0 },
          },
      ventasRecientes: ventasResult.status === "fulfilled" ? ventasResult.value : [],
      ventasHoyDetalle: ventasHoyResult.status === "fulfilled" ? ventasHoyResult.value : null,
      ventasSemanalesDetalle: ventasSemanalesResult.status === "fulfilled" ? ventasSemanalesResult.value : null,
      errores: [
        resumenResult.status === "rejected" ? "resumen" : null,
        estadisticasResult.status === "rejected" ? "estadisticas" : null,
        metodosPagoResult.status === "rejected" ? "metodosPago" : null,
        ventasResult.status === "rejected" ? "ventas" : null,
        ventasHoyResult.status === "rejected" ? "ventasHoy" : null,
        ventasSemanalesResult.status === "rejected" ? "ventasSemanales" : null,
      ].filter(Boolean),
    };

    console.log("🎉 Dashboard completo cargado:", {
      ventasHoy: resultado.resumen.ventasHoy,
      totalVentas: resultado.resumen.totalVentas,
      errores: resultado.errores
    });

    return resultado;
  } catch (error) {
    console.error("💥 Error crítico obteniendo datos completos del dashboard:", error);
    return {
      resumen: { ventasHoy: 0, totalVentas: 0, metodoPago: { efectivo: 0, transferencia: 0 } },
      estadisticasSemana: [],
      metodosPago: {
        efectivo: { cantidad: 0, monto: 0, porcentaje: 0 },
        transferencia: { cantidad: 0, monto: 0, porcentaje: 0 },
        total: { cantidad: 0, monto: 0 },
      },
      ventasRecientes: [],
      ventasHoyDetalle: null,
      ventasSemanalesDetalle: null,
      errores: ["error_critico"],
    };
  }
};

// Función para verificar conectividad con la API
export const verificarConectividadAPI = async () => {
  try {
    const response = await apiClient.get("/dashboard/health");
    return {
      conectado: true,
      estado: response.data?.status || "OK",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      conectado: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

// 🆕 NUEVA FUNCIÓN - Debug completo de endpoints
export const debugEndpoints = async () => {
  const endpoints = [
    "/dashboard/resumen",
    "/dashboard/ventas/hoy",
    "/dashboard/ventas/semanales",
    "/dashboard/estadisticas/semanal",
    "/dashboard/metodos-pago/hoy",
    "/dashboard/ventas/tiempo-real"
  ];

  console.log("🔍 === DEBUG COMPLETO DE ENDPOINTS ===");
  
  for (const endpoint of endpoints) {
    try {
      const response = await apiClient.get(endpoint);
      console.log(`✅ ${endpoint}:`, response.data);
    } catch (error) {
      console.log(`❌ ${endpoint}:`, error.message);
    }
  }
  
  console.log("🔍 === FIN DEBUG ENDPOINTS ===");
};

// Exportar configuración para uso en testing
export { API_CONFIG, apiClient };
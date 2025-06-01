import React, { useEffect, useState } from 'react';
import { useAuth } from '../../pages/usuarios/context/AuthContext';
import DoughnutChart from './components/DoughnutsChart.jsx';
import { 
  obtenerVentasRecientes, 
  obtenerResumenDashboard,
  obtenerEstadisticasSemanal,
  obtenerMetodosPagoHoy,
  debugEndpoints // Importamos función de debug
} from './api/dashboardservice.js';

const DashboardManagement = () => {
  const { user } = useAuth();
  
  // Estados para los datos del dashboard
  const [resumenDashboard, setResumenDashboard] = useState({
    ventasHoy: 0,
    totalVentas: 0,
    metodoPago: {
      efectivo: 0,
      transferencia: 0
    }
  });
  const [ventasRecientes, setVentasRecientes] = useState([]);
  const [estadisticasSemanal, setEstadisticasSemanal] = useState([]);
  const [metodosPagoHoy, setMetodosPagoHoy] = useState({
    efectivo: { cantidad: 0, monto: 0, porcentaje: 0 },
    transferencia: { cantidad: 0, monto: 0, porcentaje: 0 },
    total: { cantidad: 0, monto: 0 }
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Variable para detectar si estamos en desarrollo
  const isDevelopment = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname.includes('dev'));

  // Función para cargar todos los datos del dashboard
  const cargarDatosDashboard = async () => {
    try {
      setCargando(true);
      setError(null);

      console.log('🚀 Iniciando carga de datos del dashboard...');

      // Ejecutar debug de endpoints para verificar conectividad
      await debugEndpoints();

      // Cargar todos los datos en paralelo con mejor manejo de errores
      const promesas = [
        obtenerResumenDashboard().catch(err => {
          console.error('Error en resumen:', err);
          return { ventasHoy: 0, totalVentas: 0, metodoPago: { efectivo: 0, transferencia: 0 }};
        }),
        obtenerEstadisticasSemanal().catch(err => {
          console.error('Error en estadísticas:', err);
          return [];
        }),
        obtenerMetodosPagoHoy().catch(err => {
          console.error('Error en métodos de pago:', err);
          return {
            efectivo: { cantidad: 0, monto: 0, porcentaje: 0 },
            transferencia: { cantidad: 0, monto: 0, porcentaje: 0 },
            total: { cantidad: 0, monto: 0 }
          };
        }),
        obtenerVentasRecientes().catch(err => {
          console.error('Error en ventas recientes:', err);
          return [];
        })
      ];

      const [resumen, estadisticas, metodosPago, ventas] = await Promise.all(promesas);

      console.log('📊 Datos recibidos:', {
        resumen,
        estadisticas: estadisticas.length,
        metodosPago,
        ventas: ventas.length
      });

      // Actualizar estados con validación adicional - FIX: Removido prevState no usado
      setResumenDashboard({
        ventasHoy: resumen?.ventasHoy || 0,
        totalVentas: resumen?.totalVentas || 0,
        metodoPago: {
          efectivo: resumen?.metodoPago?.efectivo || 0,
          transferencia: resumen?.metodoPago?.transferencia || 0
        }
      });

      // Asegurar que estadisticas sea un array válido
      if (Array.isArray(estadisticas) && estadisticas.length > 0) {
        setEstadisticasSemanal(estadisticas);
        console.log('✅ Estadísticas semanales cargadas:', estadisticas);
      } else {
        console.log('⚠️ No hay estadísticas semanales o formato incorrecto');
        // Crear datos de ejemplo para testing
        setEstadisticasSemanal([
          { dia: 'Lun', monto: 12000, cantidad: 5 },
          { dia: 'Mar', monto: 8000, cantidad: 3 },
          { dia: 'Mié', monto: 15000, cantidad: 7 },
          { dia: 'Jue', monto: 10000, cantidad: 4 },
          { dia: 'Vie', monto: 20000, cantidad: 9 },
          { dia: 'Sáb', monto: 25000, cantidad: 12 },
          { dia: 'Dom', monto: 18000, cantidad: 8 }
        ]);
      }

      // Validar métodos de pago
      if (metodosPago && typeof metodosPago === 'object') {
        setMetodosPagoHoy({
          efectivo: {
            cantidad: metodosPago.efectivo?.cantidad || 0,
            monto: metodosPago.efectivo?.monto || 0,
            porcentaje: metodosPago.efectivo?.porcentaje || 0
          },
          transferencia: {
            cantidad: metodosPago.transferencia?.cantidad || 0,
            monto: metodosPago.transferencia?.monto || 0,
            porcentaje: metodosPago.transferencia?.porcentaje || 0
          },
          total: {
            cantidad: metodosPago.total?.cantidad || 0,
            monto: metodosPago.total?.monto || 0
          }
        });
        console.log('✅ Métodos de pago cargados:', metodosPago);
      } else {
        console.log('⚠️ Métodos de pago no válidos, usando datos de ejemplo');
        // Datos de ejemplo para testing
        setMetodosPagoHoy({
          efectivo: { cantidad: 5, monto: 25000, porcentaje: 60 },
          transferencia: { cantidad: 3, monto: 17000, porcentaje: 40 },
          total: { cantidad: 8, monto: 42000 }
        });
      }

      // Validar ventas recientes
      if (Array.isArray(ventas)) {
        setVentasRecientes(ventas);
        console.log('✅ Ventas recientes cargadas:', ventas.length);
      } else {
        console.log('⚠️ Ventas recientes no válidas');
        setVentasRecientes([]);
      }

      console.log('🎉 Carga completa del dashboard finalizada');

    } catch (error) {
      console.error("💥 Error crítico cargando datos del dashboard:", error);
      setError("Error al cargar los datos del dashboard. Verifique la conexión con el servidor.");
      
      // Cargar datos de ejemplo en caso de error completo
      setResumenDashboard({
        ventasHoy: 15000,
        totalVentas: 108000,
        metodoPago: { efectivo: 9000, transferencia: 6000 }
      });
      
      setEstadisticasSemanal([
        { dia: 'Lun', monto: 12000, cantidad: 5 },
        { dia: 'Mar', monto: 8000, cantidad: 3 },
        { dia: 'Mié', monto: 15000, cantidad: 7 },
        { dia: 'Jue', monto: 10000, cantidad: 4 },
        { dia: 'Vie', monto: 20000, cantidad: 9 },
        { dia: 'Sáb', monto: 25000, cantidad: 12 },
        { dia: 'Dom', monto: 18000, cantidad: 8 }
      ]);

      setMetodosPagoHoy({
        efectivo: { cantidad: 8, monto: 9000, porcentaje: 60 },
        transferencia: { cantidad: 5, monto: 6000, porcentaje: 40 },
        total: { cantidad: 13, monto: 15000 }
      });

    } finally {
      setCargando(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatosDashboard();
    
    // Actualizar datos cada 5 minutos (300000 ms)
    const interval = setInterval(cargarDatosDashboard, 300000);
    
    return () => clearInterval(interval);
  }, []);

  // Pantalla de carga
  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg font-medium">Cargando dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Verificando conexión con el servidor...</p>
        </div>
      </div>
    );
  }

  // Pantalla de error (ahora con datos de ejemplo)
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Banner de advertencia */}
        <div className="bg-yellow-900 border-b border-yellow-700 p-4">
          <div className="max-w-7xl mx-auto flex items-center">
            <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-yellow-200 text-sm font-medium">Modo de demostración activo</p>
              <p className="text-yellow-300 text-xs">{error}</p>
            </div>
            <button 
              onClick={cargarDatosDashboard}
              className="ml-auto px-3 py-1 bg-yellow-600 text-yellow-100 rounded text-sm hover:bg-yellow-700 transition-colors"
            >
              Reintentar conexión
            </button>
          </div>
        </div>
        
        {/* Continuar con el dashboard usando datos de ejemplo */}
        {renderDashboardContent()}
      </div>
    );
  }

  // Función para renderizar el contenido del dashboard
  function renderDashboardContent() {
    return (
      <>
        {/* Header con información del usuario */}
        <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">NextMeal Dashboard</h1>
                  <p className="text-sm text-gray-400">Panel de control y analytics</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="bg-gray-700 px-4 py-2 rounded-lg">
                    <p className="text-white text-sm font-medium">{user.nombre}</p>
                    <p className="text-gray-400 text-xs">Rol: {user.id_ro}</p>
                  </div>
                )}
                <div className="px-4 py-2 bg-gray-700 rounded-full">
                  <span className="text-sm font-medium text-green-400">
                    {error ? 'Demo' : 'En vivo'}
                  </span>
                </div>
                <button 
                  onClick={cargarDatosDashboard}
                  className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                  title="Actualizar datos"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Métricas Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-900 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Ventas Hoy</h3>
              <p className="text-3xl font-bold text-white">
                ${(resumenDashboard.ventasHoy || 0).toLocaleString()}
              </p>
              <div className="mt-2 flex items-center">
                <span className="text-xs text-green-400 font-medium">
                  {error ? 'Datos demo' : 'En tiempo real'}
                </span>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Ventas Semanales</h3>
              <p className="text-3xl font-bold text-white">
                ${(resumenDashboard.totalVentas || 0).toLocaleString()}
              </p>
              <div className="mt-2 flex items-center">
                <span className="text-xs text-blue-400 font-medium">Acumulado</span>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-900 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-2xl">💵</span>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Efectivo Hoy</h3>
              <p className="text-3xl font-bold text-white">
                ${(metodosPagoHoy.efectivo?.monto || 0).toLocaleString()}
              </p>
              <div className="mt-2 flex items-center">
                <span className="text-xs text-orange-400 font-medium">
                  {metodosPagoHoy.efectivo?.porcentaje || 0}%
                </span>
                <span className="text-xs text-gray-400 ml-1">del total</span>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Transferencias Hoy</h3>
              <p className="text-3xl font-bold text-white">
                ${(metodosPagoHoy.transferencia?.monto || 0).toLocaleString()}
              </p>
              <div className="mt-2 flex items-center">
                <span className="text-xs text-gray-300 font-medium">
                  {metodosPagoHoy.transferencia?.porcentaje || 0}%
                </span>
                <span className="text-xs text-gray-400 ml-1">del total</span>
              </div>
            </div>
          </div>

          {/* Componente de Gráficos - CRÍTICO: Asegurar datos válidos */}
          <DoughnutChart 
            estadisticasSemanal={estadisticasSemanal}
            metodosPagoHoy={metodosPagoHoy}
          />

          {/* Debug info en desarrollo - FIX: Reemplazado process.env con detección manual */}
          {isDevelopment && (
            <div className="bg-gray-800 rounded-lg p-4 mb-8 border border-gray-700">
              <h3 className="text-white font-bold mb-2">Debug Info:</h3>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Estadísticas Semanales: {estadisticasSemanal.length} elementos</p>
                <p>Métodos de Pago - Efectivo: ${metodosPagoHoy.efectivo?.monto || 0}</p>
                <p>Métodos de Pago - Transferencia: ${metodosPagoHoy.transferencia?.monto || 0}</p>
                <p>Estado Error: {error ? 'Sí' : 'No'}</p>
                <p>Entorno: {isDevelopment ? 'Desarrollo' : 'Producción'}</p>
              </div>
            </div>
          )}

          {/* Tabla de ventas recientes */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 mt-8">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Ventas Recientes</h2>
                  <p className="text-sm text-gray-400">
                    {error ? 'Datos de demostración' : 'Últimas transacciones en tiempo real'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${error ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  <span className="text-xs text-gray-400">
                    {error ? 'Demo' : 'En vivo'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="overflow-hidden">
              {ventasRecientes && ventasRecientes.length > 0 ? (
                <table className="min-w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Cliente</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Monto</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {ventasRecientes.slice(0, 10).map((venta, index) => (
                      <tr key={venta.id || index} className="hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-white">#{venta.id || index + 1}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-300">{venta.cliente_id || 'Cliente'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-orange-400">
                            ${(venta.total_pagar || 0).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(venta.createdAt || Date.now()).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-gray-400">No hay ventas recientes para mostrar</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      {renderDashboardContent()}
    </div>
  )
}
//pipan
export default DashboardManagement

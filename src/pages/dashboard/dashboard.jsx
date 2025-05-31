import React, { useEffect, useState } from 'react';
import { useAuth } from '../../pages/usuarios/context/AuthContext';
import DoughnutChart from './components/DoughnutsChart.jsx';
import { 
  obtenerVentasRecientes, 
  obtenerResumenDashboard,
  obtenerEstadisticasSemanal,
  obtenerMetodosPagoHoy
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

  // Función para cargar todos los datos del dashboard
  const cargarDatosDashboard = async () => {
    try {
      setCargando(true);
      setError(null);

      // Cargar todos los datos en paralelo
      const [resumen, estadisticas, metodosPago, ventas] = await Promise.all([
        obtenerResumenDashboard(),
        obtenerEstadisticasSemanal(),
        obtenerMetodosPagoHoy(),
        obtenerVentasRecientes()
      ]);

      // Actualizar estados con los datos reales
      setResumenDashboard(resumen);
      setEstadisticasSemanal(estadisticas);
      setMetodosPagoHoy(metodosPago);
      setVentasRecientes(ventas);

    } catch (error) {
      console.error("Error cargando datos del dashboard:", error);
      setError("Error al cargar los datos del dashboard");
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
        </div>
      </div>
    );
  }

  // Pantalla de error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-300 text-lg font-medium mb-4">{error}</p>
          <button 
            onClick={cargarDatosDashboard}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
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
                <span className="text-sm font-medium text-green-400">En vivo</span>
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
            <p className="text-3xl font-bold text-white">${resumenDashboard.ventasHoy?.toLocaleString() || 0}</p>
            <div className="mt-2 flex items-center">
              <span className="text-xs text-green-400 font-medium">En tiempo real</span>
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
            <h3 className="text-sm font-medium text-gray-400 mb-1">ventas semanales</h3>
            <p className="text-3xl font-bold text-white">${resumenDashboard.totalVentas?.toLocaleString() || 0}</p>
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
            <p className="text-3xl font-bold text-white">${metodosPagoHoy.efectivo?.monto?.toLocaleString() || 0}</p>
            <div className="mt-2 flex items-center">
              <span className="text-xs text-orange-400 font-medium">{metodosPagoHoy.efectivo?.porcentaje || 0}%</span>
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
            <p className="text-3xl font-bold text-white">${metodosPagoHoy.transferencia?.monto?.toLocaleString() || 0}</p>
            <div className="mt-2 flex items-center">
              <span className="text-xs text-gray-300 font-medium">{metodosPagoHoy.transferencia?.porcentaje || 0}%</span>
              <span className="text-xs text-gray-400 ml-1">del total</span>
            </div>
          </div>
        </div>

        {/* Componente de Gráficos */}
        <DoughnutChart 
          estadisticasSemanal={estadisticasSemanal}
          metodosPagoHoy={metodosPagoHoy}
        />

        {/* Tabla de ventas recientes */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 mt-8">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Ventas Recientes</h2>
                <p className="text-sm text-gray-400">Últimas transacciones en tiempo real</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">En vivo</span>
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
                  {ventasRecientes.slice(0, 10).map((venta) => (
                    <tr key={venta.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-white">#{venta.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">{venta.cliente_id || 'Cliente'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-orange-400">
                          ${venta.total_pagar?.toLocaleString() || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(venta.createdAt).toLocaleDateString('es-ES', {
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
    </div>
  );
};

export default DashboardManagement;
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../pages/usuarios/context/AuthContext';
import DoughnutChart from './components/DoughnutsChart.jsx';
import { obtenerVentasRecientes, obtenerEstadisticasPorPeriodo } from '../dashboard/api/dashboardservice.js';

const DashboardManagement = () => {
    const { user } = useAuth();
    const [ventasRecientes, setVentasRecientes] = useState([]);
    const [estadisticas, setEstadisticas] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setCargando(true);
                
                // Obtenemos las ventas recientes
                const ventas = await obtenerVentasRecientes();
                if (ventas && Array.isArray(ventas)) {
                    setVentasRecientes(ventas);
                }
                
                // Obtenemos estadísticas
                const stats = await obtenerEstadisticasPorPeriodo();
                if (stats) {
                    setEstadisticas(stats);
                }
            } catch (error) {
                console.error("Error al cargar datos del dashboard:", error);
            } finally {
                setCargando(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-gray-900 min-h-screen p-6">
            <div className="mb-6 bg-gray-800 rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-white mb-4">Dashboard</h1>
                {user && (
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <p className="text-white text-lg">Bienvenido, {user.nombre}</p>
                        <p className="text-gray-300">Rol: {user.id_rol}</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Gráfico Dona */}
                <div className="md:col-span-2">
                    <DoughnutChart />
                </div>

                {/* Panel de información */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4">Información General</h2>
                    
                    {cargando ? (
                        <p className="text-gray-300">Cargando información...</p>
                    ) : (
                        <div className="space-y-4">
                            {estadisticas.length > 0 && estadisticas.map((estMes, index) => (
                                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                                    <h3 className="text-gray-300 text-sm">{estMes.mes} {estMes.año}</h3>
                                    <p className="text-white text-xl font-bold">Ventas: {estMes.cantidad}</p>
                                    <p className="text-white text-xl font-bold">Monto: ${estMes.monto}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Ventas Recientes */}
            <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Ventas Recientes</h2>
                
                {cargando ? (
                    <p className="text-gray-300">Cargando ventas recientes...</p>
                ) : ventasRecientes.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Monto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-700 divide-y divide-gray-600">
                                {ventasRecientes.map((venta) => (
                                    <tr key={venta.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{venta.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{venta.cliente_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">${venta.total_pagar}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{new Date(venta.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-300">No hay ventas recientes para mostrar.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardManagement;
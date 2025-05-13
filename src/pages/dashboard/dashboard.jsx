import React from 'react';
import { useAuth } from '../../pages/usuarios/context/AuthContext';
import RadarChart from './components/DoughnutsChart.jsx';

const DashboardManagement = () => {
    const { user } = useAuth();

    return (
        <div>
            <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-white mb-4">Dashboard</h1>
                {user && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-white">Bienvenido, {user.nombre}</p>
                        <p className="text-gray-400">Rol: {user.id_rol}</p>
                    </div>
                )}
            </div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <RadarChart />
                </div>
            </div>
        </div>
    );
};

export default DashboardManagement;

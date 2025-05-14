import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2'; // <--- este es el correcto
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { obtenerResumenDashboard } from '../../dashboard/api/dashboardservice.js';
    
// Registrar componentes de ChartJS
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const [chartData, setChartData] = useState({
    labels: ['Total Ventas', 'Ventas de Hoy', 'Efectivo', 'Transferencia'],
    datasets: [
      {
        label: 'Resumen',
        data: [0, 0, 0, 0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerResumenDashboard();
        if (data) {
          setChartData({
            labels: ['Total Ventas', 'Ventas de Hoy', 'Efectivo', 'Transferencia'],
            datasets: [
              {
                label: 'Resumen',
                data: [
                  data.totalVentas || 0,
                  data.ventasHoy || 0,
                  data.metodoPago?.efectivo || 0,
                  data.metodoPago?.transferencia || 0,
                ],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.7)',
                  'rgba(54, 162, 235, 0.7)',
                  'rgba(255, 206, 86, 0.7)',
                  'rgba(75, 192, 192, 0.7)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error al obtener datos para el gráfico:", error);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
        text: 'Resumen General',
        color: 'white',
        font: {
          size: 16,
        },
      },
    },
    cutout: '70%',
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Estadísticas Generales</h2>
      <div className="h-64">
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </div>
  );

  //hola carechima
};

export default DoughnutChart;
   
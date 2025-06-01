import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

// Registrar componentes de ChartJS
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const DoughnutChart = ({ estadisticasSemanal = [], metodosPagoHoy = {} }) => {
  // Preparar datos para el gráfico de dona (métodos de pago)
  const datosDonut = {
    labels: ['Efectivo', 'Transferencia'],
    datasets: [{
      data: [
        metodosPagoHoy.efectivo?.monto || 0,
        metodosPagoHoy.transferencia?.monto || 0
      ],
      backgroundColor: [
        '#FF6B35',  // Naranja principal
        '#6B7280',  // Gris para tema oscuro
      ],
      borderColor: [
        '#FF6B35',
        '#6B7280',
      ],
      borderWidth: 3,
      hoverOffset: 10,
      hoverBorderWidth: 4
    }]
  };

  // Preparar datos para el gráfico de barras (ventas semanales)
  const datosBarras = {
    labels: estadisticasSemanal.map(item => item.dia || item.fecha) || ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [{
      label: 'Ventas por Día',
      data: estadisticasSemanal.map(item => item.monto || 0) || [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: '#FF6B35',
      borderColor: '#FF6B35',
      borderWidth: 0,
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  // Configuraciones de gráficos (tema oscuro)
  const opcionesDonut = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#E5E7EB', // Texto claro para tema oscuro
          padding: 20,
          font: {
            size: 14,
            weight: '600',
            family: 'Inter, system-ui, sans-serif'
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#1F2937', // Fondo oscuro
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#FF6B35',
        borderWidth: 2,
        cornerRadius: 8,
        padding: 12,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '75%',
  };

  const opcionesBarras = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#FF6B35',
        borderWidth: 2,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context) {
            return `Ventas: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        border: {
          display: false
        },
        ticks: {
          color: '#9CA3AF', // Texto gris claro
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          },
          callback: function(value) {
            return '$' + (value / 1000) + 'K';
          }
        },
        grid: {
          color: '#374151', // Líneas de grid más oscuras
          lineWidth: 1
        }
      },
      x: {
        border: {
          display: false
        },
        ticks: {
          color: '#D1D5DB', // Texto claro
          font: {
            size: 12,
            weight: '500',
            family: 'Inter, system-ui, sans-serif'
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      {/* Gráfico de barras */}
      <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-8 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Ventas Semanales</h2>
            <p className="text-sm text-gray-400">Últimos 7 días</p>
          </div>
          <div className="w-10 h-10 bg-orange-900 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div className="h-80">
          <Bar data={datosBarras} options={opcionesBarras} />
        </div>
      </div>

      {/* Gráfico de dona */}
      <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Métodos de Pago</h2>
            <p className="text-sm text-gray-400">Hoy</p>
          </div>
          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
        </div>
        <div className="h-80">
          <Doughnut data={datosDonut} options={opcionesDonut} />
        </div>
      </div>
    </div>
  );
};

export default DoughnutChart;
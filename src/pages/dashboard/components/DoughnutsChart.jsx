import React, { useEffect, useRef } from 'react';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

// Registrar los componentes necesarios para el gráfico radar
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend);

const RadarChart = () => {
  const canvasRef = useRef(null);
  let chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy(); // destruye el gráfico anterior si existe
    }

    const ctx = canvasRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'radar', // Especificar que es un gráfico radar
      data: {
        labels: ['Rojo', 'Azul', 'Amarillo'], // Etiquetas de las líneas del radar
        datasets: [
          {
            label: 'Cantidad',
            data: [10, 20, 30], // Los valores que se muestran en el radar
            backgroundColor: 'rgba(60, 179, 113, 0.2)', // Color de fondo (transparente)
            borderColor: '#3CB371', // Color de la línea
            borderWidth: 2, // Grosor de la línea
            pointBackgroundColor: '#3CB371', // Color de los puntos
            pointBorderColor: '#fff', // Color del borde de los puntos
            pointBorderWidth: 2, // Grosor del borde de los puntos
            pointRadius: 5 // Radio de los puntos
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true, // Inicia desde 0
            angleLines: {
              display: true // Muestra las líneas de ángulo
            },
            suggestedMin: 0, // Valor mínimo sugerido
            suggestedMax: 40 // Valor máximo sugerido
          }
        },
        plugins: {
          legend: {
            position: 'top' // Coloca la leyenda en la parte superior
          },
          tooltip: {
            enabled: true // Habilita las tooltips
          }
        }
      }
    });
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Gráfico de Radar (Chart.js directo)</h2>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default RadarChart;

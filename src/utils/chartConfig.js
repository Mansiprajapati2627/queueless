import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const chartConfig = {
  revenueChart: {
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => `₹${context.raw.toLocaleString()}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `₹${value}`
          }
        }
      }
    },
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      success: '#4CAF50',
      warning: '#FFC107',
      danger: '#f44336',
      info: '#2196F3'
    },
    gradients: {
      primary: (ctx) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(102, 126, 234, 0.5)');
        gradient.addColorStop(1, 'rgba(102, 126, 234, 0)');
        return gradient;
      }
    }
  },

  orderChart: {
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      cutout: '70%'
    }
  },

  categoryChart: {
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  },

  createRevenueData: (labels, data, label = 'Revenue') => ({
    labels,
    datasets: [{
      label,
      data,
      borderColor: chartConfig.revenueChart.colors.primary,
      backgroundColor: chartConfig.revenueChart.gradients.primary,
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  }),

  createPieData: (labels, data) => ({
    labels,
    datasets: [{
      data,
      backgroundColor: [
        chartConfig.revenueChart.colors.primary,
        chartConfig.revenueChart.colors.secondary,
        chartConfig.revenueChart.colors.success,
        chartConfig.revenueChart.colors.warning,
        chartConfig.revenueChart.colors.danger,
        chartConfig.revenueChart.colors.info
      ],
      borderWidth: 0
    }]
  }),

  createBarData: (labels, datasets) => ({
    labels,
    datasets: datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: dataset.color || chartConfig.revenueChart.colors.primary,
      borderColor: 'transparent',
      borderRadius: 4
    }))
  })
};
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { cardAPI } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { data: cards, isLoading, error } = useQuery({
    queryKey: ['cards'],
    queryFn: async () => {
      return await cardAPI.getCards();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">Dashboard yüklenirken bir hata oluştu.</div>
      </div>
    );
  }

  const totalDebt = cards?.reduce((sum: number, card: any) => sum + card.balance, 0) || 0;
  const totalMinimumPayment = cards?.reduce((sum: number, card: any) => sum + card.minimumPayment, 0) || 0;

  const chartData = {
    labels: cards?.map((card: any) => card.name) || [],
    datasets: [
      {
        label: 'Bakiye',
        data: cards?.map((card: any) => card.balance) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Kredi Kartı Bakiyeleri',
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Toplam Borç</h2>
          <p className="text-3xl font-bold text-red-600">
            {totalDebt.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Toplam Minimum Ödeme</h2>
          <p className="text-3xl font-bold text-blue-600">
            {totalMinimumPayment.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <Line options={chartOptions} data={chartData} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Yaklaşan Ödemeler</h2>
        <div className="space-y-4">
          {cards?.map((card: any) => (
            <div key={card.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <h3 className="font-medium">{card.name}</h3>
                <p className="text-sm text-gray-500">
                  Son Ödeme: {new Date(card.dueDate).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {card.balance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </p>
                <p className="text-sm text-gray-500">
                  Min. Ödeme: {card.minimumPayment.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
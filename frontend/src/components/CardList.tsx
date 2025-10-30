import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { cardAPI } from '../services/api';

const CardList = () => {
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
        <div className="text-red-600">Kartlar yüklenirken bir hata oluştu.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kredi Kartlarım</h1>
        <Link
          to="/add-card"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Yeni Kart Ekle
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards?.map((card: any) => (
          <div key={card.id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">{card.name}</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Bakiye:</span>
                <span className="font-medium">
                  {card.balance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Faiz Oranı:</span>
                <span className="font-medium">%{card.interestRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Son Ödeme:</span>
                <span className="font-medium">
                  {new Date(card.dueDate).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Minimum Ödeme:</span>
                <span className="font-medium">
                  {card.minimumPayment.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                Ödeme Yap
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardList; 
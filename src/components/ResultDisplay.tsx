import { RecommendationResult, NutriliteProduct } from '../types';

interface ResultDisplayProps {
  result: RecommendationResult;
  onRestart: () => void;
}

const nutritionTypeLabels: { [key: string]: { label: string; color: string; icon: string } } = {
  'protein': { label: 'Đạm (Protein)', color: 'bg-green-100 border-green-500 text-green-800', icon: '💪' },
  'fat': { label: 'Chất béo (Omega-3)', color: 'bg-blue-100 border-blue-500 text-blue-800', icon: '🐟' },
  'vitamin-mineral': { label: 'Vitamin & Khoáng chất', color: 'bg-purple-100 border-purple-500 text-purple-800', icon: '✨' },
  'complete-nutrition': { label: 'Dinh dưỡng toàn diện', color: 'bg-orange-100 border-orange-500 text-orange-800', icon: '🍽️' }
};

export default function ResultDisplay({ result, onRestart }: ResultDisplayProps) {
  // Lấy tất cả sản phẩm duy nhất để hiển thị chi tiết
  const uniqueProducts = result.products.filter((product, index, self) =>
    index === self.findIndex(p => p.id === product.id)
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Thực Đơn Dinh Dưỡng Của Bạn</h1>
        <p className="text-blue-100">Được tùy chỉnh dựa trên 3 dưỡng chất cơ bản</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Tóm tắt</h2>
        <p className="text-gray-700 leading-relaxed">{result.summary}</p>
      </div>

      {/* Thực đơn hàng ngày - Ưu tiên hiển thị */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800">📅 Thực đơn hàng ngày</h2>
        <p className="text-sm text-gray-600 mb-4 italic">
          Các sản phẩm được chia đều cho 3 bữa để tối ưu hấp thu dinh dưỡng
        </p>
        
        {result.dailyPlan.morning.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-orange-600 flex items-center">
              <span className="mr-2">🌅</span> Buổi sáng
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.dailyPlan.morning.map((product, idx) => (
                <MealProductCard key={`${product.id}-morning-${idx}`} product={product} />
              ))}
            </div>
          </div>
        )}

        {result.dailyPlan.afternoon.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-600 flex items-center">
              <span className="mr-2">☀️</span> Buổi trưa
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.dailyPlan.afternoon.map((product, idx) => (
                <MealProductCard key={`${product.id}-afternoon-${idx}`} product={product} />
              ))}
            </div>
          </div>
        )}

        {result.dailyPlan.evening.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-indigo-600 flex items-center">
              <span className="mr-2">🌙</span> Buổi tối
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.dailyPlan.evening.map((product, idx) => (
                <MealProductCard key={`${product.id}-evening-${idx}`} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chi tiết sản phẩm với hình ảnh */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800">📦 Chi tiết sản phẩm</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {uniqueProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Lưu ý:</strong> Đây là đề xuất dựa trên thông tin bạn cung cấp. 
          Vui lòng tham khảo ý kiến bác sĩ hoặc chuyên gia dinh dưỡng trước khi sử dụng 
          bất kỳ sản phẩm bổ sung nào, đặc biệt nếu bạn đang mang thai, cho con bú, 
          hoặc đang dùng thuốc.
        </p>
      </div>

      <button
        onClick={onRestart}
        className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
      >
        Làm lại khảo sát
      </button>
    </div>
  );
}

function MealProductCard({ product }: { product: NutriliteProduct }) {
  const typeInfo = nutritionTypeLabels[product.nutritionType] || { 
    label: product.category, 
    color: 'bg-gray-100 border-gray-500 text-gray-800', 
    icon: '📦' 
  };

  return (
    <div className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-20 h-20 object-contain rounded-lg bg-gray-50"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Nutrilite';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-1 border ${typeInfo.color}`}>
            {typeInfo.icon}
          </div>
          <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">{product.name}</h4>
          <p className="text-xs text-gray-600">{product.dosage}</p>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: NutriliteProduct }) {
  const typeInfo = nutritionTypeLabels[product.nutritionType] || { 
    label: product.category, 
    color: 'bg-gray-100 border-gray-500 text-gray-800', 
    icon: '📦' 
  };

  return (
    <div className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
      <div className="flex flex-col md:flex-row items-start mb-4">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 w-full md:w-48">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 md:w-48 md:h-48 object-contain rounded-lg bg-gray-50 border border-gray-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Nutrilite';
            }}
          />
          {product.officialLink && (
            <a
              href={product.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-center text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Xem chi tiết trên Amway Vietnam
            </a>
          )}
        </div>
        <div className="flex-1">
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 border-2 ${typeInfo.color}`}>
            {typeInfo.icon} {typeInfo.label}
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{product.description}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">Lợi ích:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          {product.benefits.map((benefit: string, idx: number) => (
            <li key={idx}>{benefit}</li>
          ))}
        </ul>
      </div>
      
      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">Phù hợp cho:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          {product.recommendedFor.slice(0, 3).map((item: string, idx: number) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
      
      <div className="bg-blue-50 rounded p-4 border-l-4 border-blue-500">
        <h4 className="font-semibold text-gray-800 mb-2">💊 Liều lượng khuyến nghị:</h4>
        <p className="text-sm text-gray-700">{product.dosage}</p>
      </div>
    </div>
  );
}

import { RecommendationResult } from '../types';

interface ResultDisplayProps {
  result: RecommendationResult;
  onRestart: () => void;
}

export default function ResultDisplay({ result, onRestart }: ResultDisplayProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Thực Đơn Dinh Dưỡng Của Bạn</h1>
        <p className="text-blue-100">Được tùy chỉnh dựa trên thông tin bạn cung cấp</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Tóm tắt</h2>
        <p className="text-gray-700 leading-relaxed">{result.summary}</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Thực đơn hàng ngày</h2>
        
        {result.dailyPlan.morning.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-orange-600">🌅 Buổi sáng</h3>
            <div className="space-y-3">
              {result.dailyPlan.morning.map(product => (
                <div key={product.id} className="border-l-4 border-orange-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-800">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.dosage}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.dailyPlan.afternoon.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-yellow-600">☀️ Buổi trưa</h3>
            <div className="space-y-3">
              {result.dailyPlan.afternoon.map(product => (
                <div key={product.id} className="border-l-4 border-yellow-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-800">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.dosage}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.dailyPlan.evening.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-indigo-600">🌙 Buổi tối</h3>
            <div className="space-y-3">
              {result.dailyPlan.evening.map(product => (
                <div key={product.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-800">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.dosage}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Chi tiết sản phẩm</h2>
        <div className="space-y-6">
          {result.products.map(product => (
            <div key={product.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{product.description}</p>
              <div className="mb-3">
                <h4 className="font-semibold text-gray-800 mb-2">Lợi ích:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {product.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Liều lượng:</h4>
                <p className="text-gray-700">{product.dosage}</p>
              </div>
            </div>
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


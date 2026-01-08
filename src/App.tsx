import { useState } from 'react';
import QuestionForm from './components/QuestionForm';
import ResultDisplay from './components/ResultDisplay';
import { UserAnswers, RecommendationResult } from './types';
import { generateRecommendations } from './utils/recommendation';

function App() {
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleComplete = (answers: UserAnswers) => {
    try {
      const recommendation = generateRecommendations(answers);
      setResult(recommendation);
      setShowWelcome(false);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      alert('Có lỗi xảy ra khi tạo thực đơn. Vui lòng thử lại.');
    }
  };

  const handleRestart = () => {
    setResult(null);
    setShowWelcome(true);
  };

  if (showWelcome && !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Nutrilite - Lên Thực Đơn Dinh Dưỡng
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Chúng tôi sẽ giúp bạn tạo một thực đơn dinh dưỡng cá nhân hóa 
              dựa trên 3 dưỡng chất cơ bản: <strong>Đạm (Protein)</strong>, 
              <strong> Chất béo (Omega-3)</strong>, và <strong>Vitamin & Khoáng chất</strong>.
            </p>
            <p className="text-gray-500 mb-8">
              Khảo sát sẽ mất khoảng 5-10 phút. Chúng tôi sẽ đánh giá nhu cầu của bạn về:
            </p>
            <ul className="text-left text-gray-600 mb-8 space-y-2 max-w-md mx-auto">
              <li>💪 <strong>Đạm (Protein):</strong> Thói quen ăn uống và mức độ vận động</li>
              <li>🐟 <strong>Chất béo (Omega-3):</strong> Tần suất ăn cá và sức khỏe tim mạch</li>
              <li>✨ <strong>Vitamin & Khoáng chất:</strong> Chế độ ăn rau củ quả và mức độ mệt mỏi</li>
            </ul>
            <button
              onClick={() => setShowWelcome(false)}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold text-lg"
            >
              Bắt đầu khảo sát
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <ResultDisplay result={result} onRestart={handleRestart} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <QuestionForm onComplete={handleComplete} />
    </div>
  );
}

export default App;


import { useState } from 'react';
import { UserAnswers } from '../types';

interface QuestionFormProps {
  onComplete: (answers: UserAnswers) => void;
}

const questions = [
  {
    id: 'age',
    question: 'Bạn bao nhiêu tuổi?',
    type: 'number',
    required: true
  },
  {
    id: 'gender',
    question: 'Giới tính của bạn?',
    type: 'select',
    options: [
      { value: 'male', label: 'Nam' },
      { value: 'female', label: 'Nữ' }
    ],
    required: true
  },
  {
    id: 'proteinIntake',
    question: 'Bạn đánh giá mức độ tiêu thụ đạm (protein) của mình như thế nào?',
    subtitle: 'Đạm có trong thịt, cá, trứng, đậu hũ, các loại đậu...',
    type: 'select',
    options: [
      { value: 'low', label: 'Thấp (ít ăn thịt, cá, trứng, đậu)' },
      { value: 'medium', label: 'Trung bình (ăn vừa phải)' },
      { value: 'high', label: 'Cao (ăn đầy đủ các nguồn đạm)' }
    ],
    required: true
  },
  {
    id: 'exerciseFrequency',
    question: 'Bạn tập thể dục hoặc vận động thể chất bao nhiêu lần mỗi tuần?',
    type: 'select',
    options: [
      { value: 'none', label: 'Không tập (ít vận động)' },
      { value: 'low', label: '1-2 lần/tuần' },
      { value: 'medium', label: '3-4 lần/tuần' },
      { value: 'high', label: '5 lần/tuần trở lên' }
    ],
    required: true
  },
  {
    id: 'fishConsumption',
    question: 'Bạn ăn cá biển (cá hồi, cá thu, cá ngừ...) bao nhiêu lần mỗi tuần?',
    subtitle: 'Cá biển là nguồn Omega-3 tự nhiên quan trọng',
    type: 'select',
    options: [
      { value: 'never', label: 'Không bao giờ' },
      { value: 'rare', label: 'Hiếm khi (dưới 1 lần/tuần)' },
      { value: 'weekly', label: '1-2 lần/tuần' },
      { value: 'daily', label: '3 lần/tuần trở lên' }
    ],
    required: true
  },
  {
    id: 'heartHealthConcern',
    question: 'Bạn có lo ngại về sức khỏe tim mạch hoặc có tiền sử gia đình về vấn đề tim mạch không?',
    type: 'select',
    options: [
      { value: 'false', label: 'Không' },
      { value: 'true', label: 'Có' }
    ],
    required: true
  },
  {
    id: 'vegetableFruitIntake',
    question: 'Bạn ăn rau xanh và trái cây như thế nào?',
    subtitle: 'Rau xanh và trái cây cung cấp vitamin và khoáng chất',
    type: 'select',
    options: [
      { value: 'poor', label: 'Kém (ít ăn, không đều)' },
      { value: 'fair', label: 'Trung bình (ăn một số loại)' },
      { value: 'good', label: 'Tốt (ăn đa dạng, thường xuyên)' },
      { value: 'excellent', label: 'Rất tốt (ăn đầy đủ, đa dạng mỗi ngày)' }
    ],
    required: true
  },
  {
    id: 'fatigueLevel',
    question: 'Bạn thường xuyên cảm thấy mệt mỏi như thế nào?',
    type: 'select',
    options: [
      { value: 'none', label: 'Không mệt mỏi' },
      { value: 'low', label: 'Ít khi mệt mỏi' },
      { value: 'medium', label: 'Thỉnh thoảng mệt mỏi' },
      { value: 'high', label: 'Thường xuyên mệt mỏi' }
    ],
    required: true
  },
  {
    id: 'healthGoals',
    question: 'Mục tiêu sức khỏe của bạn là gì? (có thể chọn nhiều)',
    type: 'multiselect',
    options: [
      { value: 'tăng cường miễn dịch', label: 'Tăng cường miễn dịch, sức đề kháng' },
      { value: 'tăng cơ bắp', label: 'Tăng cường cơ bắp' },
      { value: 'tim mạch', label: 'Hỗ trợ tim mạch' },
      { value: 'não bộ', label: 'Tăng cường chức năng não bộ' },
      { value: 'năng lượng', label: 'Tăng cường năng lượng, giảm mệt mỏi' },
      { value: 'cân nặng', label: 'Kiểm soát cân nặng' },
      { value: 'lão hóa', label: 'Chống lão hóa, bảo vệ tế bào' },
      { value: 'mắt', label: 'Hỗ trợ sức khỏe mắt' }
    ],
    required: false
  },
  {
    id: 'hasAllergies',
    question: 'Bạn có dị ứng với thực phẩm nào không?',
    type: 'select',
    options: [
      { value: 'false', label: 'Không' },
      { value: 'true', label: 'Có' }
    ],
    required: true
  }
];

export default function QuestionForm({ onComplete }: QuestionFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<UserAnswers>>({
    healthGoals: [],
    allergies: []
  });

  const currentQuestion = questions[currentStep];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleMultiSelect = (value: string) => {
    const currentValues = (answers[currentQuestion.id as keyof UserAnswers] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    handleChange(newValues);
  };

  const handleSubmit = () => {
    // Convert string 'true'/'false' to boolean
    const getBooleanValue = (value: any): boolean => {
      if (typeof value === 'boolean') return value;
      if (value === 'true') return true;
      if (value === 'false') return false;
      return false;
    };

    const completeAnswers: UserAnswers = {
      age: answers.age as number | null,
      gender: answers.gender as 'male' | 'female' | null,
      proteinIntake: answers.proteinIntake as 'low' | 'medium' | 'high' | null,
      exerciseFrequency: answers.exerciseFrequency as 'none' | 'low' | 'medium' | 'high' | null,
      fishConsumption: answers.fishConsumption as 'never' | 'rare' | 'weekly' | 'daily' | null,
      heartHealthConcern: getBooleanValue(answers.heartHealthConcern),
      vegetableFruitIntake: answers.vegetableFruitIntake as 'poor' | 'fair' | 'good' | 'excellent' | null,
      fatigueLevel: answers.fatigueLevel as 'none' | 'low' | 'medium' | 'high' | null,
      healthGoals: (answers.healthGoals as string[]) || [],
      hasAllergies: getBooleanValue(answers.hasAllergies),
      allergies: (answers.allergies as string[]) || []
    };
    onComplete(completeAnswers);
  };

  const canProceed = (): boolean => {
    if (!currentQuestion.required) {
      return true;
    }

    const value = answers[currentQuestion.id as keyof UserAnswers];
    
    // For multiselect, check if array has items
    if (currentQuestion.type === 'multiselect') {
      return Array.isArray(value) && value.length > 0;
    }
    
    // For number type, check if it's a valid positive number
    if (currentQuestion.type === 'number') {
      if (typeof value === 'number') {
        return !isNaN(value) && value > 0;
      }
      return false;
    }
    
    // For other types (select), check if value is not null/undefined
    // Since select values are always valid strings from options, we just need to check existence
    if (value === null || value === undefined) {
      return false;
    }
    
    return true;
  };

  const renderInput = () => {
    switch (currentQuestion.type) {
      case 'number':
        return (
          <input
            type="number"
            value={answers[currentQuestion.id as keyof UserAnswers] as number || ''}
            onChange={(e) => handleChange(parseInt(e.target.value) || null)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập số"
            min="1"
            max="120"
          />
        );
      case 'select':
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange(option.value)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                  answers[currentQuestion.id as keyof UserAnswers] === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        );
      case 'multiselect':
        const currentValues = (answers[currentQuestion.id as keyof UserAnswers] as string[]) || [];
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleMultiSelect(option.value)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                  currentValues.includes(option.value)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Câu hỏi {currentStep + 1} / {questions.length}
          </span>
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          {currentQuestion.question}
        </h2>
        {currentQuestion.subtitle && (
          <p className="text-sm text-gray-600 mb-6 italic">{currentQuestion.subtitle}</p>
        )}
        {renderInput()}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Quay lại
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentStep === questions.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
        </button>
      </div>
    </div>
  );
}

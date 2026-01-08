import { UserAnswers, NutriliteProduct, RecommendationResult } from '../types';
import { nutriliteProducts } from '../data/products';

export function generateRecommendations(answers: UserAnswers): RecommendationResult {
  const recommendedProducts: NutriliteProduct[] = [];
  
  // Đánh giá nhu cầu về 3 dưỡng chất cơ bản
  const needsProtein = evaluateProteinNeed(answers);
  const needsOmega3 = evaluateOmega3Need(answers);
  const needsVitamins = evaluateVitaminsNeed(answers);

  // Luôn đề xuất Triple X thay vì Daily
  const tripleX = nutriliteProducts.find(p => p.id === 'triple-x');
  if (tripleX) recommendedProducts.push(tripleX);

  // Đề xuất sản phẩm dựa trên nhu cầu
  if (needsProtein) {
    const protein = nutriliteProducts.find(p => p.id === 'all-plant-protein');
    if (protein) recommendedProducts.push(protein);
  }

  if (needsOmega3) {
    const omega3 = nutriliteProducts.find(p => p.id === 'advanced-triple-omega-3');
    if (omega3) recommendedProducts.push(omega3);
  }

  // Bodykey cho buổi sáng - luôn được khuyến nghị
  const bodykey = nutriliteProducts.find(p => p.id === 'bodykey');
  if (bodykey) {
    recommendedProducts.push(bodykey);
  }
  
  // Phân bổ sản phẩm theo 3 bữa để tối ưu hấp thu
  const morning: NutriliteProduct[] = [];
  const afternoon: NutriliteProduct[] = [];
  const evening: NutriliteProduct[] = [];

  // Buổi sáng: Bodykey (đầy đủ dinh dưỡng và vitamin, khoáng chất)
  if (bodykey) {
    morning.push(bodykey);
  }

  // Chia đều Protein, Omega-3 và Triple X ra 3 bữa
  const protein = recommendedProducts.find(p => p.nutritionType === 'protein');
  const omega3 = recommendedProducts.find(p => p.nutritionType === 'fat');
  const tripleXProduct = recommendedProducts.find(p => p.id === 'triple-x');

  // Buổi sáng: 1/3 Triple X (nếu có Bodykey thì chỉ Triple X, không có thì thêm 1/3 protein)
  if (tripleXProduct) {
    const tripleXMorning = { ...tripleXProduct, dosage: '1/3 liều lượng (chia từ 1 viên/ngày)' };
    morning.push(tripleXMorning as NutriliteProduct);
  }
  if (protein && !bodykey) {
    const proteinMorning = { ...protein, dosage: '1/3 liều lượng (chia từ liều khuyến nghị)' };
    morning.push(proteinMorning as NutriliteProduct);
  }

  // Buổi trưa: 1/3 Protein, 1/3 Omega-3, 1/3 Triple X
  if (protein) {
    const proteinAfternoon = { ...protein, dosage: '1/3 liều lượng (chia từ liều khuyến nghị)' };
    afternoon.push(proteinAfternoon as NutriliteProduct);
  }
  if (omega3) {
    const omega3Afternoon = { ...omega3, dosage: '1/3 liều lượng (chia từ 1-2 viên/ngày)' };
    afternoon.push(omega3Afternoon as NutriliteProduct);
  }
  if (tripleXProduct) {
    const tripleXAfternoon = { ...tripleXProduct, dosage: '1/3 liều lượng (chia từ 1 viên/ngày)' };
    afternoon.push(tripleXAfternoon as NutriliteProduct);
  }

  // Buổi tối: 1/3 Protein, 1/3 Omega-3, 1/3 Triple X
  if (protein) {
    const proteinEvening = { ...protein, dosage: '1/3 liều lượng (chia từ liều khuyến nghị)' };
    evening.push(proteinEvening as NutriliteProduct);
  }
  if (omega3) {
    const omega3Evening = { ...omega3, dosage: '1/3 liều lượng (chia từ 1-2 viên/ngày)' };
    evening.push(omega3Evening as NutriliteProduct);
  }
  if (tripleXProduct) {
    const tripleXEvening = { ...tripleXProduct, dosage: '1/3 liều lượng (chia từ 1 viên/ngày)' };
    evening.push(tripleXEvening as NutriliteProduct);
  }

  // Tạo tóm tắt
  const summary = generateSummary(answers, recommendedProducts, {
    needsProtein,
    needsOmega3,
    needsVitamins,
    hasBodykey: !!bodykey
  });

  return {
    products: recommendedProducts,
    summary,
    dailyPlan: {
      morning,
      afternoon,
      evening
    }
  };
}

function evaluateProteinNeed(answers: UserAnswers): boolean {
  // Cần protein nếu:
  // - Ăn ít protein
  // - Tập thể dục thường xuyên
  // - Mục tiêu tăng cơ hoặc kiểm soát cân nặng
  
  if (answers.proteinIntake === 'low') return true;
  if (answers.exerciseFrequency === 'high' || answers.exerciseFrequency === 'medium') return true;
  
  if (answers.healthGoals.some(goal => 
    goal.includes('cơ bắp') || goal.includes('cân nặng') || goal.includes('năng lượng')
  )) {
    return true;
  }

  return false;
}

function evaluateOmega3Need(answers: UserAnswers): boolean {
  // Cần Omega-3 nếu:
  // - Ít ăn cá (ít hơn 2 lần/tuần)
  // - Có vấn đề về tim mạch
  // - Mục tiêu tim mạch hoặc não bộ
  
  if (answers.fishConsumption === 'never' || answers.fishConsumption === 'rare') return true;
  if (answers.heartHealthConcern === true) return true;
  
  if (answers.healthGoals.some(goal => 
    goal.includes('tim mạch') || goal.includes('não bộ') || goal.includes('mắt')
  )) {
    return true;
  }

  return false;
}

function evaluateVitaminsNeed(answers: UserAnswers): boolean {
  // Luôn cần vitamin và khoáng chất
  return true;
}

function generateSummary(
  answers: UserAnswers, 
  products: NutriliteProduct[],
  needs: { needsProtein: boolean; needsOmega3: boolean; needsVitamins: boolean; hasBodykey: boolean }
): string {
  let summary = 'Dựa trên thông tin bạn cung cấp, chúng tôi đã xây dựng một thực đơn dinh dưỡng tối ưu dựa trên 3 dưỡng chất cơ bản: ';
  
  const nutritionTypes: string[] = [];
  if (needs.needsProtein) nutritionTypes.push('Đạm (Protein)');
  if (needs.needsOmega3) nutritionTypes.push('Chất béo (Omega-3)');
  if (needs.needsVitamins) nutritionTypes.push('Vitamin và Khoáng chất (Triple X)');
  
  summary += nutritionTypes.join(', ') + '. ';
  
  if (needs.hasBodykey) {
    summary += 'Buổi sáng, chúng tôi khuyến nghị BodyKey để cung cấp đầy đủ dinh dưỡng và vitamin, khoáng chất cho một ngày mới. ';
  }
  
  if (needs.needsProtein) {
    summary += 'Protein được chia đều cho 3 bữa để cơ thể hấp thu tối ưu. ';
  }
  
  if (needs.needsOmega3) {
    summary += 'Omega-3 được phân bổ đều trong ngày để hỗ trợ sức khỏe tim mạch và não bộ. ';
  }
  
  summary += 'Triple X được chia làm 3 lần trong ngày để đảm bảo cơ thể hấp thu vitamin và khoáng chất một cách tối ưu nhất. ';
  
  summary += 'Hãy tuân thủ liều lượng khuyến nghị và kết hợp với chế độ ăn uống cân bằng để đạt kết quả tốt nhất.';
  
  return summary;
}

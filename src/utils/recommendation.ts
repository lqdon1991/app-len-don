import { UserAnswers, NutriliteProduct, RecommendationResult, NutritionAnalysis, NutritionNeeds } from '../types';
import { nutriliteProducts } from '../data/products';

export function generateRecommendations(answers: UserAnswers): RecommendationResult {
  const recommendedProducts: NutriliteProduct[] = [];
  const nutritionAnalysis = calculateNutritionAnalysis(answers);
  
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
  }, nutritionAnalysis);

  return {
    products: recommendedProducts,
    summary,
    dailyPlan: {
      morning,
      afternoon,
      evening
    },
    nutritionAnalysis
  };
}

function calculateNutritionAnalysis(answers: UserAnswers): NutritionAnalysis {
  // Nhu cầu chuẩn ước tính cho người trưởng thành
  const isMale = answers.gender === 'male';
  const age = answers.age ?? 30;

  // Ước lượng cân nặng và nhu cầu năng lượng cơ bản
  const estimatedWeightKg = isMale ? 70 : 55;
  const baseCalories = isMale ? 2400 : 2000;

  // Điều chỉnh theo mức độ vận động
  const activityFactor =
    answers.exerciseFrequency === 'high'
      ? 1.2
      : answers.exerciseFrequency === 'medium'
        ? 1.1
        : 1.0;

  const caloriesKcal = Math.round(baseCalories * activityFactor);

  // Nhu cầu nước: 35 ml/kg
  const waterMl = Math.round(estimatedWeightKg * 35);

  // Nhu cầu protein: 1.4 g/kg (tăng nếu vận động nhiều)
  const proteinPerKg =
    answers.exerciseFrequency === 'high'
      ? 1.8
      : answers.exerciseFrequency === 'medium'
        ? 1.5
        : 1.2;
  const proteinG = Math.round(estimatedWeightKg * proteinPerKg);

  // Carb ~50% năng lượng, fat ~30%
  const carbsG = Math.round((caloriesKcal * 0.5) / 4);
  const fatG = Math.round((caloriesKcal * 0.3) / 9);

  // Omega‑3 (EPA + DHA) mục tiêu: 800–1000 mg
  const omega3Mg = isMale ? 1000 : 800;

  const needs: NutritionNeeds = {
    waterMl,
    caloriesKcal,
    proteinG,
    carbsG,
    fatG,
    omega3Mg
  };

  // Ước lượng lượng hiện tại từ khảo sát
  let proteinCoverage = 0.8;
  if (answers.proteinIntake === 'low') proteinCoverage = 0.6;
  if (answers.proteinIntake === 'high') proteinCoverage = 1.0;

  // Nếu tập nhiều mà ăn đạm thấp thì thực tế còn thiếu hơn
  if (answers.exerciseFrequency === 'high' && answers.proteinIntake === 'low') {
    proteinCoverage = 0.5;
  }

  const estimatedProteinG = Math.round(proteinG * proteinCoverage);

  let omega3Coverage = 0.3;
  if (answers.fishConsumption === 'weekly') omega3Coverage = 0.6;
  if (answers.fishConsumption === 'daily') omega3Coverage = 1.0;
  if (answers.heartHealthConcern) {
    omega3Coverage = Math.min(omega3Coverage, 0.7);
  }
  const estimatedOmega3Mg = Math.round(omega3Mg * omega3Coverage);

  let micronutrientCoverage = 0.8;
  if (answers.vegetableFruitIntake === 'poor') micronutrientCoverage = 0.4;
  if (answers.vegetableFruitIntake === 'fair') micronutrientCoverage = 0.6;
  if (answers.vegetableFruitIntake === 'good') micronutrientCoverage = 0.8;
  if (answers.vegetableFruitIntake === 'excellent') micronutrientCoverage = 1.0;

  // Căng thẳng, mệt mỏi cao → thực tế nhu cầu tăng, coi như đang thiếu nhiều hơn
  if (answers.fatigueLevel === 'high') {
    micronutrientCoverage = Math.max(0.3, micronutrientCoverage - 0.1);
  }

  const estimatedFromDiet = {
    proteinG: estimatedProteinG,
    omega3Mg: estimatedOmega3Mg,
    micronutrientCoveragePercent: Math.round(micronutrientCoverage * 100)
  };

  const gaps = {
    proteinG: Math.max(0, proteinG - estimatedProteinG),
    omega3Mg: Math.max(0, omega3Mg - estimatedOmega3Mg),
    micronutrientCoveragePercent: Math.max(
      0,
      100 - Math.round(micronutrientCoverage * 100)
    )
  };

  const notes: string[] = [];

  notes.push(
    `Ở độ tuổi khoảng ${age}, nhu cầu ước tính: ~${caloriesKcal} kcal/ngày, khoảng ${proteinG}g đạm, ${carbsG}g tinh bột, ${fatG}g chất béo và ${omega3Mg}mg Omega-3.`
  );

  if (gaps.proteinG > 0) {
    notes.push(
      `Chế độ ăn hiện tại có thể đang thiếu khoảng ${gaps.proteinG}g đạm mỗi ngày so với nhu cầu.`
    );
  } else {
    notes.push('Lượng đạm từ khẩu phần ăn có vẻ tương đối đủ so với nhu cầu.');
  }

  if (gaps.omega3Mg > 0) {
    notes.push(
      `Bạn có thể chưa đạt đủ chuẩn Omega-3 (thiếu khoảng ${gaps.omega3Mg}mg mỗi ngày).`
    );
  } else {
    notes.push('Lượng Omega-3 ước tính từ chế độ ăn khá tốt.');
  }

  if (gaps.micronutrientCoveragePercent > 0) {
    notes.push(
      `Rau và trái cây hiện tại chỉ đáp ứng khoảng ${estimatedFromDiet.micronutrientCoveragePercent}% nhu cầu vitamin và khoáng chất.`
    );
  } else {
    notes.push('Lượng vitamin và khoáng chất từ rau/trái cây tương đối đầy đủ.');
  }

  return {
    needs,
    estimatedFromDiet,
    gaps,
    notes
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
  needs: { needsProtein: boolean; needsOmega3: boolean; needsVitamins: boolean; hasBodykey: boolean },
  nutritionAnalysis?: NutritionAnalysis
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

export interface UserAnswers {
  age: number | null;
  gender: 'male' | 'female' | null;
  // Protein related
  proteinIntake: 'low' | 'medium' | 'high' | null;
  exerciseFrequency: 'none' | 'low' | 'medium' | 'high' | null;
  // Omega-3 related
  fishConsumption: 'never' | 'rare' | 'weekly' | 'daily' | null;
  heartHealthConcern: boolean | null;
  // Vitamin & Mineral related
  vegetableFruitIntake: 'poor' | 'fair' | 'good' | 'excellent' | null;
  fatigueLevel: 'none' | 'low' | 'medium' | 'high' | null;
  // General
  healthGoals: string[];
  hasAllergies: boolean | null;
  allergies: string[];
}

export interface NutriliteProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  recommendedFor: string[];
  dosage: string;
  imageUrl: string;
  nutritionType: 'protein' | 'fat' | 'vitamin-mineral' | 'complete-nutrition';
  officialLink?: string;
}

export interface RecommendationResult {
  products: NutriliteProduct[];
  summary: string;
  dailyPlan: {
    morning: NutriliteProduct[];
    afternoon: NutriliteProduct[];
    evening: NutriliteProduct[];
  };
}


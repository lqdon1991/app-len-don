import { NutriliteProduct } from '../types';

export const nutriliteProducts: NutriliteProduct[] = [
  {
    id: 'all-plant-protein',
    name: 'Nutrilite All Plant Protein Powder',
    category: 'Đạm (Protein)',
    description: 'Bổ sung protein thực vật chất lượng cao từ đậu nành, lúa mì và đậu Hà Lan. Sản phẩm cung cấp nguồn đạm hoàn chỉnh, hỗ trợ xây dựng và duy trì cơ bắp, tăng cường sức khỏe tổng thể.',
    benefits: [
      'Hỗ trợ xây dựng và duy trì cơ bắp',
      'Cung cấp năng lượng cho các hoạt động hàng ngày',
      'Hỗ trợ phục hồi sau tập luyện',
      'Kiểm soát cân nặng và cảm giác no'
    ],
    recommendedFor: [
      'Người tập thể dục thường xuyên',
      'Người ăn chay hoặc thiếu protein',
      'Người cần tăng cường cơ bắp',
      'Người muốn kiểm soát cân nặng'
    ],
    dosage: 'Pha 1 muỗng (10g) với nước hoặc đồ uống yêu thích. Sử dụng 1-2 lần mỗi ngày, tốt nhất sau khi tập luyện hoặc giữa các bữa ăn.',
    imageUrl: '/images/products/all-plant-protein.jpg',
    nutritionType: 'protein',
    officialLink: 'https://www.amway.com.vn/vn/Categories/Dinh-D%C6%B0%E1%BB%A1ng-V%C3%A0-S%E1%BB%A9c-Kh%E1%BB%8Fe/Dinh-D%C6%B0%E1%BB%A1ng-Thi%E1%BA%BFt-Y%E1%BA%BFu-H%E1%BA%B1ng-Ng%C3%A0y/TPBVSK-Nutrilite%E2%84%A2-All-Plant-Protein-Powder/p/110415'
  },
  {
    id: 'advanced-triple-omega-3',
    name: 'Nutrilite Advanced Triple Omega-3',
    category: 'Chất béo (Omega-3)',
    description: 'Cung cấp axit béo omega-3 thiết yếu như EPA, DHA từ dầu cá biển sâu và ALA từ dầu hạt chia trắng. Ứng dụng công nghệ Aquacelle® giúp tăng cường khả năng hấp thu EPA và DHA gấp 3 lần so với các sản phẩm không chứa công nghệ này.',
    benefits: [
      'Hỗ trợ sức khỏe tim mạch',
      'Cải thiện chức năng não bộ và thị lực',
      'Hỗ trợ sức khỏe khớp và giảm viêm',
      'Tốt cho da và mắt'
    ],
    recommendedFor: [
      'Người ít ăn cá biển (ít hơn 2 lần/tuần)',
      'Người có nguy cơ hoặc vấn đề về tim mạch',
      'Người làm việc trí óc nhiều',
      'Người muốn tăng cường sức khỏe não bộ'
    ],
    dosage: 'Uống 1-2 viên mỗi ngày, tốt nhất là ngay sau bữa ăn để tăng cường hấp thu.',
    imageUrl: '/images/products/advanced-triple-omega-3.jpg',
    nutritionType: 'fat',
    officialLink: 'https://www.amway.com.vn/vn/Categories/Dinh-D%C6%B0%E1%BB%A1ng-V%C3%A0-S%E1%BB%A9c-Kh%E1%BB%8Fe/Dinh-D%C6%B0%E1%BB%A1ng-Thi%E1%BA%BFt-Y%E1%BA%BFu-H%E1%BA%B1ng-Ng%C3%A0y/TPBVSK-Nutrilite%E2%84%A2-Advanced-Triple-Omega-3/p/126136'
  },
  {
    id: 'daily',
    name: 'Nutrilite Daily',
    category: 'Vitamin và Khoáng chất',
    description: 'Bổ sung 11 vitamin và 7 khoáng chất thiết yếu hàng ngày, hỗ trợ tăng cường sức khỏe tổng thể và hệ miễn dịch. Sản phẩm được thiết kế để bổ sung các dưỡng chất cần thiết mà cơ thể không thể tự sản xuất hoặc không nhận đủ từ chế độ ăn uống.',
    benefits: [
      'Bổ sung 11 vitamin và 7 khoáng chất thiết yếu',
      'Hỗ trợ tăng cường sức đề kháng và hệ miễn dịch',
      'Tốt cho mắt và sức khỏe tổng thể',
      'Hỗ trợ chuyển hóa năng lượng'
    ],
    recommendedFor: [
      'Người có chế độ ăn thiếu rau củ quả',
      'Người thường xuyên mệt mỏi hoặc căng thẳng',
      'Người muốn tăng cường sức đề kháng',
      'Người trên 18 tuổi cần bổ sung dinh dưỡng cơ bản'
    ],
    dosage: 'Uống 1 viên mỗi ngày cùng với bữa ăn để tăng cường hấp thu.',
    imageUrl: '/images/products/double-x.png',
    nutritionType: 'vitamin-mineral'
  },
  {
    id: 'double-x',
    name: 'Nutrilite Double X',
    category: 'Vitamin và Khoáng chất',
    description: 'Bổ sung 12 vitamin, 10 khoáng chất và dưỡng chất thực vật từ 22 loại trái cây, rau củ, thảo mộc. Sản phẩm cao cấp hơn Daily, cung cấp dinh dưỡng toàn diện từ nguồn thực vật tự nhiên.',
    benefits: [
      'Bổ sung 12 vitamin, 10 khoáng chất và dưỡng chất thực vật',
      'Nguồn gốc từ 22 loại trái cây, rau củ, thảo mộc tự nhiên',
      'Hỗ trợ tăng cường sức khỏe và sức đề kháng',
      'Chống oxy hóa và bảo vệ tế bào'
    ],
    recommendedFor: [
      'Người muốn bổ sung dinh dưỡng toàn diện hơn',
      'Người có chế độ ăn thiếu dinh dưỡng nghiêm trọng',
      'Người trên 40 tuổi cần tăng cường sức khỏe',
      'Người muốn chống lão hóa và bảo vệ tế bào'
    ],
    dosage: 'Uống 2 lần mỗi ngày, mỗi lần 1 viên của mỗi loại cùng với bữa ăn.',
    imageUrl: '/images/products/double-x.png',
    nutritionType: 'vitamin-mineral',
    officialLink: 'https://www.amway.com.vn/vn/Categories/Dinh-D%C6%B0%E1%BB%A1ng-V%C3%A0-S%E1%BB%A9c-Kh%E1%BB%8Fe/Dinh-D%C6%B0%E1%BB%A1ng-Thi%E1%BA%BFt-Y%E1%BA%BFu-H%E1%BA%B1ng-Ng%C3%A0y/TP-BVSK-Nutrilite-Double-X/p/120843'
  },
  {
    id: 'bodykey',
    name: 'BodyKey by Nutrilite',
    category: 'Dinh dưỡng toàn diện',
    description: 'Sản phẩm dinh dưỡng thay thế bữa ăn, cung cấp đầy đủ protein, vitamin, khoáng chất và chất xơ. BodyKey giúp kiểm soát cân nặng hiệu quả đồng thời đảm bảo cung cấp đủ dinh dưỡng cho cơ thể. Đặc biệt phù hợp cho bữa sáng để khởi đầu ngày mới đầy năng lượng.',
    benefits: [
      'Cung cấp đầy đủ protein, vitamin và khoáng chất',
      'Hỗ trợ kiểm soát cân nặng hiệu quả',
      'Thay thế bữa ăn tiện lợi và dinh dưỡng',
      'Cung cấp chất xơ hỗ trợ tiêu hóa',
      'Khởi đầu ngày mới đầy năng lượng'
    ],
    recommendedFor: [
      'Người muốn kiểm soát cân nặng',
      'Người cần bữa sáng dinh dưỡng nhanh chóng',
      'Người muốn đảm bảo đủ dinh dưỡng mỗi ngày',
      'Người có lối sống bận rộn'
    ],
    dosage: 'Pha 2 muỗng (khoảng 40g) với 250ml nước hoặc sữa. Sử dụng thay thế bữa sáng để cung cấp đầy đủ dinh dưỡng và vitamin, khoáng chất.',
    imageUrl: '/images/products/bodykey.jpg',
    nutritionType: 'complete-nutrition',
    officialLink: 'https://www.amway.com.vn/vn/Categories/Dinh-D%C6%B0%E1%BB%A1ng-V%C3%A0-S%E1%BB%A9c-Kh%E1%BB%8Fe/H%E1%BB%97-Tr%E1%BB%A3-Qu%E1%BA%A3n-L%C3%BD-C%C3%A2n-N%E1%BA%B7ng/Th%E1%BB%B1c-ph%E1%BA%A9m-d%C3%B9ng-cho-ch%E1%BA%BF-%C4%91%E1%BB%99-%C4%83n-%C4%91%E1%BA%B7c-bi%E1%BB%87t-BodyKey-By-Nutrilite%E2%84%A2-%E2%80%93-V%E1%BB%8B-Tr%C3%A0-S%E1%BB%AFa/p/124499'
  }
];

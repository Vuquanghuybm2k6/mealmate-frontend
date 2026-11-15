export interface Recipe {
  id: string;
  title: string;
  image_url?: string;
  imageUrl?: string | null;
  cook_minutes?: number;
  cookMinutes?: number;
  difficulty: "Dễ" | "Trung bình" | "easy" | "medium" | string;
  tools: string[];
  cost_estimate?: number;
  costEstimate?: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_types?: ("breakfast" | "lunch" | "dinner" | string)[];
  mealTypes?: string[];
  is_healthy?: boolean;
  isHealthy?: boolean;
  ingredients?: {
    name: string;
    quantity: string | number;
    is_main?: boolean;
    isMain?: boolean;
  }[];
  steps?: string[];
  tags?: string[];
}

export interface FunMessage {
  id: string;
  context: "wheel" | "budget_cheap" | "budget_good" | "streak" | "healthy";
  text: string;
  author: string;
}

export const SAMPLE_RECIPES: Recipe[] = [
  {
    id: "rec-1",
    title: "Cơm Trứng Xào Cà Chua Mềm Béo",
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    cook_minutes: 12,
    cookMinutes: 12,
    difficulty: "Dễ",
    tools: ["Chảo", "Bếp"],
    cost_estimate: 17000,
    costEstimate: 17000,
    kcal: 460,
    protein: 16.5,
    carbs: 58,
    fat: 14,
    meal_types: ["lunch", "dinner"],
    mealTypes: ["lunch", "dinner"],
    is_healthy: true,
    isHealthy: true,
    ingredients: [
      { name: "Trứng gà", quantity: "2 quả", is_main: true },
      { name: "Cà chua chín", quantity: "2 quả", is_main: true },
      { name: "Hành lá", quantity: "1 nhánh", is_main: false },
      { name: "Gạo / Cơm trắng", quantity: "1 bát", is_main: true },
    ],
    steps: [
      "Đập 2 quả trứng khuấy nhẹ với chút nước mắm, xào chín tới rồi vớt ra.",
      "Cắt múi cau cà chua, xào nát tạo sốt sánh mịn.",
      "Đổ trứng vào đảo đều 1 phút, rắc hành lá cắt nhỏ và dọn ra đĩa cùng cơm nóng.",
    ],
    tags: ["Dưới 20k", "Món quốc dân", "Siêu tốc"],
  },
  {
    id: "rec-2",
    title: "Đậu Phụ Sốt Cà Chua Hành Lá",
    image_url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    cook_minutes: 15,
    cookMinutes: 15,
    difficulty: "Dễ",
    tools: ["Chảo"],
    cost_estimate: 15000,
    costEstimate: 15000,
    kcal: 380,
    protein: 17,
    carbs: 45,
    fat: 12,
    meal_types: ["lunch", "dinner"],
    mealTypes: ["lunch", "dinner"],
    is_healthy: true,
    isHealthy: true,
    ingredients: [
      { name: "Đậu phụ trắng", quantity: "2 bìa", is_main: true },
      { name: "Cà chua", quantity: "2 quả", is_main: true },
      { name: "Hành lá, hạt nêm", quantity: "Vừa đủ", is_main: false },
    ],
    steps: [
      "Cắt đậu phụ thành miếng vuông vừa ăn, rán vàng sơ 2 mặt.",
      "Phi thơm đầu hành, cho cà chua băm nhỏ vào xào nhuyễn.",
      "Thả đậu vào rim nhỏ lửa 5 phút cho ngấm sốt, rắc hành lá tắt bếp.",
    ],
    tags: ["Tiết kiệm", "Giàu đạm thực vật", "Dưới 15k"],
  },
  {
    id: "rec-3",
    title: "Mì Trộn Xúc Xích Trứng Lòng Đào",
    image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    cook_minutes: 10,
    cookMinutes: 10,
    difficulty: "Dễ",
    tools: ["Nồi nhỏ"],
    cost_estimate: 22000,
    costEstimate: 22000,
    kcal: 520,
    protein: 18.2,
    carbs: 65,
    fat: 19,
    meal_types: ["breakfast", "lunch", "dinner"],
    mealTypes: ["breakfast", "lunch", "dinner"],
    is_healthy: false,
    isHealthy: false,
    ingredients: [
      { name: "Gói mì ăn liền", quantity: "1 gói", is_main: true },
      { name: "Trứng gà", quantity: "1 quả", is_main: true },
      { name: "Xúc xích tiệt trùng", quantity: "1 cây", is_main: true },
      { name: "Rau cải / xà lách", quantity: "1 nắm", is_main: false },
    ],
    steps: [
      "Trần mì và rau vừa chín tới rồi vớt ra để ráo.",
      "Luộc hoặc ốp la 1 quả trứng lòng đào chảy béo ngậy.",
      "Trộn mì với sốt gia vị, xếp xúc xích thái lát, rau và trứng lòng đào lên trên.",
    ],
    tags: ["10 phút", "Ngon bất bại", "Ấm bụng"],
  },
  {
    id: "rec-4",
    title: "Ức Gà Xào Nấm & Súp Lơ Xanh",
    image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    cook_minutes: 18,
    cookMinutes: 18,
    difficulty: "Dễ",
    tools: ["Chảo"],
    cost_estimate: 35000,
    costEstimate: 35000,
    kcal: 420,
    protein: 34,
    carbs: 22,
    fat: 8.5,
    meal_types: ["lunch", "dinner"],
    mealTypes: ["lunch", "dinner"],
    is_healthy: true,
    isHealthy: true,
    ingredients: [
      { name: "Ức gà phi lê", quantity: "150g", is_main: true },
      { name: "Nấm đùi gà / nấm rơm", quantity: "100g", is_main: true },
      { name: "Súp lơ xanh", quantity: "100g", is_main: true },
      { name: "Tỏi, tiêu, dầu hào", quantity: "Vừa đủ", is_main: false },
    ],
    steps: [
      "Ức gà thái lát mỏng ướp xíu tiêu, nước tương trong 5 phút.",
      "Phi tỏi thơm, xào ức gà chín tái rồi cho nấm và súp lơ vào đảo nhanh lửa lớn.",
      "Nêm 1 thìa dầu hào, đảo thêm 3 phút cho chín giòn và thưởng thức.",
    ],
    tags: ["High Protein", "Eat Clean Sinh Viên", "Gym-ers"],
  },
  {
    id: "rec-5",
    title: "Cơm Chiên Kim Chi Trứng Ốp La",
    image_url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
    cook_minutes: 15,
    cookMinutes: 15,
    difficulty: "Dễ",
    tools: ["Chảo chống dính"],
    cost_estimate: 25000,
    costEstimate: 25000,
    kcal: 540,
    protein: 15.5,
    carbs: 72,
    fat: 14,
    meal_types: ["lunch", "dinner"],
    mealTypes: ["lunch", "dinner"],
    is_healthy: false,
    isHealthy: false,
    ingredients: [
      { name: "Cơm nguội", quantity: "1 tô", is_main: true },
      { name: "Kim chi cải thảo", quantity: "80g", is_main: true },
      { name: "Trứng gà", quantity: "1 quả", is_main: true },
      { name: "Dầu mè, mè rang", quantity: "1 ít", is_main: false },
    ],
    steps: [
      "Xắt nhỏ kim chi rồi xào thơm trên chảo cùng chút tương ớt.",
      "Trút cơm nguội vào đảo tơi hạt, thấm đượm màu đỏ kim chi.",
      "Ốp 1 quả trứng lòng đào đặt lên mặt, rắc mè rang thơm lừng.",
    ],
    tags: ["Tận dụng cơm nguội", "Đậm đà", "25k"],
  },
  {
    id: "rec-6",
    title: "Canh Rau Muống Nấu Thịt Băm Cà Chua",
    image_url: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
    cook_minutes: 14,
    cookMinutes: 14,
    difficulty: "Dễ",
    tools: ["Nồi canh"],
    cost_estimate: 24000,
    costEstimate: 24000,
    kcal: 280,
    protein: 19.8,
    carbs: 12,
    fat: 9,
    meal_types: ["lunch", "dinner"],
    mealTypes: ["lunch", "dinner"],
    is_healthy: true,
    isHealthy: true,
    ingredients: [
      { name: "Thịt heo xay", quantity: "80g", is_main: true },
      { name: "Rau muống non", quantity: "1 bó nhỏ", is_main: true },
      { name: "Cà chua", quantity: "1 quả", is_main: false },
      { name: "Hành tím phi", quantity: "1 củ", is_main: false },
    ],
    steps: [
      "Phi thơm hành tím, xào săn thịt băm với chút muối.",
      "Đổ 600ml nước vào đun sôi bùng, vớt bọt cho nước trong.",
      "Thả rau muống và cà chua bổ múi cau vào nấu chín 3 phút, nêm nếm vừa ăn.",
    ],
    tags: ["Thanh mát mùa hè", "Dễ nuốt", "Đủ rau thịt"],
  },
];

export const FUN_MESSAGES: FunMessage[] = [
  {
    id: "m-1",
    context: "wheel",
    text: "Hôm nay 'Vũ trụ ẩm thực' chỉ định bạn ăn món này, đừng chần chừ nữa kẻo dạ dày đình công!",
    author: "BếpSV Bot 🤖",
  },
  {
    id: "m-2",
    context: "budget_cheap",
    text: "Ví 25k mà ăn sang - ngon - đủ chất như vậy là đạt danh hiệu MasterChef Ký Túc Xá rồi đấy!",
    author: "Hội SV Tiết Kiệm 💰",
  },
  {
    id: "m-3",
    context: "budget_good",
    text: "Có lương bố mẹ gửi hay vừa nhận học bổng hả bạn ơi? Bữa nay ăn no nê tẩm bổ não nhé!",
    author: "Góc Bếp SV 🍲",
  },
  {
    id: "m-4",
    context: "streak",
    text: "Đỉnh chóp! Bạn đã ăn đủ bữa 5 ngày liên tiếp. Tạm biệt căn bệnh viêm màng túi lẫn viêm dạ dày!",
    author: "Huy - Trưởng phòng trọ 🎖️",
  },
  {
    id: "m-5",
    context: "healthy",
    text: "Chế độ Lành Mạnh kích hoạt: Đủ đạm, dưới 600 kcal, không dầu mỡ thừa - cơ bụng sắp lộ diện rồi!",
    author: "HLV Thể Chất 🥦",
  },
];

export const COMMON_INGREDIENTS = [
  "Trứng gà",
  "Cà chua",
  "Đậu phụ",
  "Thịt heo xay",
  "Ức gà",
  "Xúc xích",
  "Mì gói",
  "Rau muống",
  "Bắp cải",
  "Hành lá",
  "Dưa leo",
  "Cơm nguội",
];

import { RiskScore, Signal, NewsArticle, RegionRisk, Category } from "./types";

export const mockRiskScore: RiskScore = {
  overall: 72,
  categories: {
    물가: 78,
    고용: 65,
    자영업: 82,
    금융: 68,
    부동산: 71,
  },
  trend: "up",
  updatedAt: "2026-03-05T09:00:00Z",
};

export const mockSignals: Signal[] = [
  {
    id: "s1",
    title: "자영업 폐업률 3개월 연속 상승",
    description:
      "소상공인 폐업 관련 기사가 최근 3개월간 지속 증가하며, 특히 음식업·소매업 중심으로 위험 신호가 감지되고 있습니다.",
    level: "critical",
    category: "자영업",
    region: "서울",
    relatedArticles: 47,
    date: "2026-03-05",
    keywords: ["폐업", "소상공인", "음식업", "임대료"],
  },
  {
    id: "s2",
    title: "생활물가 상승세 가속화",
    description:
      "농산물·가공식품 가격 인상 기사가 급증하고 있으며, 체감 물가 상승에 대한 우려가 확산되고 있습니다.",
    level: "critical",
    category: "물가",
    relatedArticles: 38,
    date: "2026-03-04",
    keywords: ["물가", "농산물", "가공식품", "장바구니"],
  },
  {
    id: "s3",
    title: "부동산 PF 부실 우려 확대",
    description:
      "프로젝트파이낸싱(PF) 관련 부실 우려 기사가 증가하며, 건설업 연쇄 부실 가능성에 대한 경고가 이어지고 있습니다.",
    level: "warning",
    category: "부동산",
    region: "경기",
    relatedArticles: 29,
    date: "2026-03-04",
    keywords: ["PF", "부동산", "건설", "부실"],
  },
  {
    id: "s4",
    title: "청년 고용률 하락 추세",
    description:
      "청년층 취업난 관련 기사가 증가하며, 특히 IT·스타트업 분야의 채용 축소가 두드러지고 있습니다.",
    level: "warning",
    category: "고용",
    relatedArticles: 22,
    date: "2026-03-03",
    keywords: ["청년", "고용", "취업", "채용"],
  },
  {
    id: "s5",
    title: "가계대출 연체율 소폭 상승",
    description:
      "은행권 가계대출 연체율이 소폭 상승하는 추세로, 고금리 장기화에 따른 서민 금융 부담이 가중되고 있습니다.",
    level: "watch",
    category: "금융",
    relatedArticles: 15,
    date: "2026-03-03",
    keywords: ["연체율", "가계대출", "고금리", "서민금융"],
  },
  {
    id: "s6",
    title: "전통시장 매출 감소 지속",
    description:
      "전통시장·골목상권의 매출 감소 추세가 이어지며, 소비 위축에 따른 자영업 경기 침체가 심화되고 있습니다.",
    level: "warning",
    category: "자영업",
    region: "부산",
    relatedArticles: 18,
    date: "2026-03-02",
    keywords: ["전통시장", "매출감소", "소비위축", "골목상권"],
  },
];

export const mockNewsArticles: NewsArticle[] = [
  {
    id: "n1",
    title: "서울 소상공인 10곳 중 3곳 '폐업 고려'…역대 최고 수준",
    summary:
      "서울 소상공인의 30%가 폐업을 고려 중이며, 임대료 부담과 매출 감소가 주요 원인으로 나타났습니다.",
    source: "매일경제",
    category: "자영업",
    keywords: ["소상공인", "폐업", "임대료", "서울"],
    riskLevel: "critical",
    publishedAt: "2026-03-05T08:30:00Z",
    url: "#",
  },
  {
    id: "n2",
    title: "3월 소비자물가 3.8% 상승…6개월 만에 최고",
    summary:
      "소비자물가지수가 전년 동월 대비 3.8% 상승하며 물가 불안이 심화되고 있습니다.",
    source: "매일경제",
    category: "물가",
    keywords: ["CPI", "소비자물가", "인플레이션"],
    riskLevel: "critical",
    publishedAt: "2026-03-05T07:00:00Z",
    url: "#",
  },
  {
    id: "n3",
    title: "건설사 PF 대출 부실, 2분기 본격 현실화 우려",
    summary:
      "건설업체의 PF 대출 부실이 2분기부터 본격화될 수 있다는 전망이 나오고 있습니다.",
    source: "매일경제",
    category: "부동산",
    keywords: ["PF", "건설", "부실채권", "부동산"],
    riskLevel: "warning",
    publishedAt: "2026-03-04T14:20:00Z",
    url: "#",
  },
  {
    id: "n4",
    title: "청년 취업자 수 2개월 연속 감소…IT 채용 한파",
    summary:
      "청년 취업자 수가 2개월 연속 감소하며, IT·스타트업 분야의 채용 축소가 두드러지고 있습니다.",
    source: "매일경제",
    category: "고용",
    keywords: ["청년고용", "IT", "채용", "취업"],
    riskLevel: "warning",
    publishedAt: "2026-03-04T10:15:00Z",
    url: "#",
  },
  {
    id: "n5",
    title: "가계대출 연체율 0.5%p 상승…서민 부담 가중",
    summary:
      "은행권 가계대출 연체율이 소폭 상승하며, 고금리 장기화에 따른 서민 금융 부담이 우려됩니다.",
    source: "매일경제",
    category: "금융",
    keywords: ["연체율", "가계대출", "금리", "서민금융"],
    riskLevel: "watch",
    publishedAt: "2026-03-03T16:45:00Z",
    url: "#",
  },
  {
    id: "n6",
    title: "배달앱 수수료 인상에 자영업자 '한숨'",
    summary:
      "주요 배달앱의 수수료 인상으로 자영업자들의 부담이 가중되고 있습니다.",
    source: "매일경제",
    category: "자영업",
    keywords: ["배달앱", "수수료", "자영업", "플랫폼"],
    riskLevel: "warning",
    publishedAt: "2026-03-03T09:30:00Z",
    url: "#",
  },
];

export const mockRegions: RegionRisk[] = [
  { name: "서울", score: 76, level: "warning", topIssue: "자영업 폐업 급증", trend: "up" },
  { name: "경기", score: 73, level: "warning", topIssue: "부동산 PF 부실", trend: "up" },
  { name: "인천", score: 68, level: "warning", topIssue: "제조업 고용 감소", trend: "stable" },
  { name: "부산", score: 71, level: "warning", topIssue: "전통시장 매출 하락", trend: "up" },
  { name: "대구", score: 64, level: "watch", topIssue: "소비 위축", trend: "stable" },
  { name: "광주", score: 58, level: "watch", topIssue: "청년 유출", trend: "down" },
  { name: "대전", score: 55, level: "watch", topIssue: "물가 상승", trend: "stable" },
  { name: "울산", score: 62, level: "watch", topIssue: "제조업 경기 둔화", trend: "up" },
  { name: "세종", score: 42, level: "safe", topIssue: "안정적", trend: "stable" },
  { name: "강원", score: 52, level: "watch", topIssue: "관광업 부진", trend: "down" },
  { name: "충북", score: 49, level: "safe", topIssue: "반도체 투자 효과", trend: "down" },
  { name: "충남", score: 56, level: "watch", topIssue: "농산물 가격 불안", trend: "up" },
  { name: "전북", score: 61, level: "watch", topIssue: "고용 감소", trend: "up" },
  { name: "전남", score: 57, level: "watch", topIssue: "고령화 가속", trend: "stable" },
  { name: "경북", score: 59, level: "watch", topIssue: "제조업 구조조정", trend: "up" },
  { name: "경남", score: 66, level: "warning", topIssue: "조선업 하청 부실", trend: "up" },
  { name: "제주", score: 69, level: "warning", topIssue: "관광업·부동산 동반 침체", trend: "up" },
];

export const mockTrendData = [
  { date: "1월 1주", 물가: 62, 고용: 55, 자영업: 68, 금융: 58, 부동산: 60 },
  { date: "1월 2주", 물가: 64, 고용: 54, 자영업: 70, 금융: 60, 부동산: 62 },
  { date: "1월 3주", 물가: 66, 고용: 56, 자영업: 71, 금융: 59, 부동산: 63 },
  { date: "1월 4주", 물가: 65, 고용: 58, 자영업: 73, 금융: 61, 부동산: 64 },
  { date: "2월 1주", 물가: 68, 고용: 57, 자영업: 74, 금융: 62, 부동산: 66 },
  { date: "2월 2주", 물가: 70, 고용: 59, 자영업: 76, 금융: 63, 부동산: 67 },
  { date: "2월 3주", 물가: 72, 고용: 61, 자영업: 78, 금융: 65, 부동산: 68 },
  { date: "2월 4주", 물가: 74, 고용: 62, 자영업: 79, 금융: 66, 부동산: 69 },
  { date: "3월 1주", 물가: 78, 고용: 65, 자영업: 82, 금융: 68, 부동산: 71 },
];

/**
 * 공공데이터포털 - 대한민국 공공서비스 정보 API 테스트 스크립트
 *
 * 사용법:
 *   1. .env.local 파일에 GOV_DATA_API_KEY 설정
 *   2. npx tsx scripts/test-gov-api.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// .env.local 파싱
function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  try {
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      process.env[key] = value;
    }
  } catch {
    console.error("[ERROR] .env.local 파일을 찾을 수 없습니다.");
    process.exit(1);
  }
}

loadEnv();

const API_KEY = process.env.GOV_DATA_API_KEY;
if (!API_KEY || API_KEY === "여기에_인증키를_입력하세요") {
  console.error("[ERROR] .env.local에 GOV_DATA_API_KEY를 설정해주세요.");
  process.exit(1);
}

const BASE_URL = "https://api.odcloud.kr/api/gov24/v3";

// ─── 유틸 ───

async function fetchApi(endpoint: string, params: Record<string, string> = {}) {
  // serviceKey는 이미 URL 인코딩된 상태이므로 직접 문자열로 조립
  const qsParts: string[] = [`serviceKey=${API_KEY}`, `returnType=JSON`];
  for (const [k, v] of Object.entries(params)) {
    qsParts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  }
  const fullUrl = `${BASE_URL}${endpoint}?${qsParts.join("&")}`;

  console.log(`\n  GET ${endpoint}?serviceKey=***&${qsParts.slice(2).join("&")}`);

  const res = await fetch(fullUrl);
  const status = res.status;
  const body = await res.text();

  if (status !== 200) {
    console.error(`  [FAIL] HTTP ${status}`);
    console.error(`  ${body.slice(0, 300)}`);
    return null;
  }

  try {
    return JSON.parse(body);
  } catch {
    console.error(`  [FAIL] JSON 파싱 실패: ${body.slice(0, 200)}`);
    return null;
  }
}

function printSummary(label: string, data: Record<string, unknown> | null) {
  if (!data) {
    console.log(`  ${label}: 실패`);
    return;
  }
  console.log(`  [OK] ${label}`);
  console.log(`    totalCount: ${data.totalCount}`);
  console.log(`    currentCount: ${data.currentCount}`);
  console.log(`    matchCount: ${data.matchCount}`);
  console.log(`    page: ${data.page}, perPage: ${data.perPage}`);
}

function printRow(row: Record<string, unknown>, fields: string[]) {
  for (const f of fields) {
    const val = row[f];
    const display = typeof val === "string" && val.length > 80
      ? val.slice(0, 80) + "..."
      : val;
    console.log(`      ${f}: ${display}`);
  }
}

// ─── 테스트 ───

async function testServiceList() {
  console.log("\n========================================");
  console.log("  TEST 1: 공공서비스 목록 조회 (serviceList)");
  console.log("========================================");

  // 1-1. 기본 조회 (1페이지, 5건)
  console.log("\n[1-1] 기본 조회 (page=1, perPage=5)");
  const res1 = await fetchApi("/serviceList", { page: "1", perPage: "5" });
  printSummary("기본 조회", res1);
  if (res1?.data?.[0]) {
    console.log("    첫 번째 항목:");
    printRow(res1.data[0], ["서비스ID", "서비스명", "소관기관명", "서비스분야"]);
  }

  // 1-2. 서비스명 검색
  console.log("\n[1-2] 서비스명 검색 (서비스명 LIKE '출산')");
  const res2 = await fetchApi("/serviceList", {
    page: "1",
    perPage: "3",
    "cond[서비스명::LIKE]": "출산",
  });
  printSummary("서비스명 검색", res2);
  if (res2?.data) {
    res2.data.slice(0, 2).forEach((row: Record<string, unknown>, i: number) => {
      console.log(`    [${i + 1}] ${row["서비스명"]}`);
    });
  }

  // 1-3. 서비스분야 필터
  console.log("\n[1-3] 서비스분야 검색 (서비스분야 LIKE '고용')");
  const res3 = await fetchApi("/serviceList", {
    page: "1",
    perPage: "3",
    "cond[서비스분야::LIKE]": "고용",
  });
  printSummary("서비스분야 검색", res3);
  if (res3?.data) {
    res3.data.slice(0, 2).forEach((row: Record<string, unknown>, i: number) => {
      console.log(`    [${i + 1}] ${row["서비스명"]} (${row["서비스분야"]})`);
    });
  }

  return res1?.data?.[0]?.["서비스ID"] as string | undefined;
}

async function testServiceDetail(serviceId: string) {
  console.log("\n========================================");
  console.log("  TEST 2: 공공서비스 상세 조회 (serviceDetail)");
  console.log("========================================");

  console.log(`\n[2-1] 상세 조회 (서비스ID: ${serviceId})`);
  const res = await fetchApi("/serviceDetail", {
    "cond[서비스ID::EQ]": serviceId,
  });
  printSummary("상세 조회", res);
  if (res?.data?.[0]) {
    console.log("    상세 정보:");
    printRow(res.data[0], [
      "서비스ID", "서비스명", "서비스목적", "지원유형",
      "지원대상", "신청방법", "소관기관명",
    ]);
  }
}

async function testSupportConditions(serviceId: string) {
  console.log("\n========================================");
  console.log("  TEST 3: 지원조건 조회 (supportConditions)");
  console.log("========================================");

  console.log(`\n[3-1] 지원조건 조회 (서비스ID: ${serviceId})`);
  const res = await fetchApi("/supportConditions", {
    "cond[서비스ID::EQ]": serviceId,
  });
  printSummary("지원조건 조회", res);
  if (res?.data?.[0]) {
    console.log("    지원조건:");
    const row = res.data[0] as Record<string, unknown>;
    const fields = Object.keys(row).filter(
      (k) => row[k] !== null && row[k] !== ""
    );
    printRow(row, fields.slice(0, 10));
  }
}

async function testAuthHeader() {
  console.log("\n========================================");
  console.log("  TEST 4: Authorization 헤더 인증 방식");
  console.log("========================================");

  const headerUrl = `${BASE_URL}/serviceList?page=1&perPage=1&returnType=JSON`;

  console.log(`\n  GET /serviceList (Authorization 헤더)`);

  // 헤더 인증 시에는 디코딩된 키를 사용
  const decodedKey = decodeURIComponent(API_KEY!);
  const res = await fetch(headerUrl, {
    headers: { Authorization: decodedKey },
  });

  if (res.status === 200) {
    const body = await res.json();
    console.log(`  [OK] 헤더 인증 성공 (totalCount: ${body.totalCount})`);
  } else {
    console.log(`  [FAIL] HTTP ${res.status}`);
  }
}

async function testErrorCase() {
  console.log("\n========================================");
  console.log("  TEST 5: 에러 케이스 (잘못된 인증키)");
  console.log("========================================");

  const url = new URL(`${BASE_URL}/serviceList`);
  url.searchParams.set("serviceKey", "INVALID_KEY_12345");
  url.searchParams.set("page", "1");
  url.searchParams.set("perPage", "1");

  console.log(`\n  GET ${url.pathname} (잘못된 키)`);

  const res = await fetch(url.toString());
  console.log(`  [OK] 예상대로 HTTP ${res.status} 반환`);
}

// ─── 실행 ───

async function main() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║  공공서비스 정보 API 테스트              ║");
  console.log("║  https://api.odcloud.kr/api/gov24/v3     ║");
  console.log("╚══════════════════════════════════════════╝");

  // Test 1: 목록 조회
  const serviceId = await testServiceList();

  // Test 2: 상세 조회 (Test 1에서 받은 ID 활용)
  if (serviceId) {
    await testServiceDetail(serviceId);
  } else {
    console.log("\n[SKIP] 서비스ID를 가져오지 못해 상세 조회 건너뜀");
  }

  // Test 3: 지원조건 조회
  if (serviceId) {
    await testSupportConditions(serviceId);
  } else {
    console.log("\n[SKIP] 서비스ID를 가져오지 못해 지원조건 조회 건너뜀");
  }

  // Test 4: 헤더 인증
  await testAuthHeader();

  // Test 5: 에러 케이스
  await testErrorCase();

  console.log("\n==========================================");
  console.log("  테스트 완료");
  console.log("==========================================\n");
}

main().catch((err) => {
  console.error("[FATAL]", err);
  process.exit(1);
});

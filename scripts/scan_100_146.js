/**
 * scan_100_146.js
 * Unit 100~146의 practical 스테이지에서 잘린 정답을 스캔합니다.
 * practiceB의 정답을 참조해 비교합니다.
 */

const fs = require('fs');
const path = require('path');

const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');
const START = 100;
const END = 146;

const results = [];

// 잘린 패턴 감지
function isTruncated(answer) {
  if (!answer || answer.length < 5) return { truncated: false };

  // 1. 전치사/접속사/관사로 끝나는 경우
  if (/\b(the|a|an|to|of|in|on|at|for|is|was|are|were|my|his|her|its|our|your|their|and|or|but|that|which|who|whom|whose|when|where|if|as|than|more|most|very|so|too|not|can|could|would|should|will|had|has|have|been|be|do|does|did|with|from|by|about|into|over|after|before|→)\s*$/i.test(answer) && answer.length > 20) {
    return { truncated: true, reason: '전치사/접속사/관사로 끝남' };
  }

  // 2. 콤마로 끝나는 경우
  if (/,\s*$/.test(answer) && answer.length > 15) {
    return { truncated: true, reason: '콤마로 끝남' };
  }

  // 3. 열린 괄호가 닫히지 않은 경우
  const openP = (answer.match(/\(/g) || []).length;
  const closeP = (answer.match(/\)/g) || []).length;
  if (openP > closeP) {
    return { truncated: true, reason: '괄호 미닫힘' };
  }

  // 4. 문장 중간 단어로 끝나는 경우 (영어 문장이 완결되지 않음)
  // 마침표, ?, ! 없이 끝나면서 비교적 짧은 경우
  if (answer.length > 15 && !/[.?!]$/.test(answer) && /^[A-Z]/.test(answer)) {
    // 단어 수가 3개 이상인 긴 문장인데 구두점이 없는 경우
    const words = answer.trim().split(/\s+/);
    if (words.length >= 4) {
      return { truncated: true, reason: '구두점 없이 끝남 (문장 불완전)' };
    }
  }

  return { truncated: false };
}

// practiceB에서 동일 번호 정답 찾기
function findPracticeBAnswer(practiceBContent, qNum) {
  if (!practiceBContent) return null;
  const lines = practiceBContent.split('\n');
  const paddedNum = String(qNum).padStart(2, '0');

  for (let i = 0; i < lines.length; i++) {
    // 문제 번호 패턴 찾기
    if (lines[i].match(new RegExp(`\\*\\*${paddedNum}\\.\\*\\*`))) {
      // 그 이후에서 정답 찾기
      for (let j = i + 1; j < Math.min(lines.length, i + 25); j++) {
        if (lines[j].includes('정답')) {
          const m = lines[j].match(/정답[^\S\n]*[*:：\s]*(.+)/);
          if (m) return m[1].trim();
        }
      }
    }
  }
  return null;
}

for (let i = START; i <= END; i++) {
  const unitNum = String(i).padStart(3, '0');
  const filePath = path.join(UNITS_DIR, `${unitNum}.json`);

  if (!fs.existsSync(filePath)) {
    console.warn(`파일 없음: ${unitNum}.json`);
    continue;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const practicalContent = data.stages?.practical;
  const practiceBContent = data.stages?.practiceB;

  if (!practicalContent) continue;

  const lines = practicalContent.split('\n');

  for (let j = 0; j < lines.length; j++) {
    const line = lines[j];
    if (!line.includes('정답')) continue;

    const match = line.match(/정답[^\S\n]*[*:：\s]*(.+)/);
    if (!match) continue;
    const answer = match[1].trim();
    if (!answer) continue;

    const { truncated, reason } = isTruncated(answer);
    if (!truncated) continue;

    // 문제 번호 찾기 (위로 탐색)
    let qNum = null;
    for (let k = j; k >= Math.max(0, j - 20); k--) {
      const qm = lines[k].match(/\*\*(\d{2})\.\*\*/);
      if (qm) { qNum = parseInt(qm[1]); break; }
    }

    // practiceB 정답 비교
    let bAnswer = null;
    if (qNum) {
      bAnswer = findPracticeBAnswer(practiceBContent, qNum);
    }

    results.push({
      unit: unitNum,
      qNum,
      lineIndex: j,
      truncatedAnswer: answer,
      reason,
      bAnswer: bAnswer || '(없음)',
      lineContent: line.substring(0, 120)
    });
  }
}

// 결과 출력
console.log(`\n=== Unit ${START}~${END} 잘린 정답 스캔 결과 ===\n`);
console.log(`총 ${results.length}건 발견\n`);

const byUnit = {};
results.forEach(r => {
  byUnit[r.unit] = (byUnit[r.unit] || 0) + 1;
});

console.log('【유닛별 통계】');
Object.entries(byUnit).sort((a, b) => parseInt(a[0]) - parseInt(b[0])).forEach(([u, c]) => {
  console.log(`  Unit ${u}: ${c}건`);
});

console.log('\n【상세 목록】');
results.forEach(r => {
  console.log(`\nUnit ${r.unit} Q${r.qNum !== null ? String(r.qNum).padStart(2,'0') : '??'} (L${r.lineIndex + 1})`);
  console.log(`  잘린 정답: ${r.truncatedAnswer}`);
  console.log(`  이유: ${r.reason}`);
  if (r.bAnswer !== '(없음)') {
    console.log(`  ▶ practiceB 정답: ${r.bAnswer}`);
  }
});

// JSON 저장
const outPath = path.join(__dirname, '..', 'scan_100_146.json');
fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');
console.log(`\n결과 저장: ${outPath}`);

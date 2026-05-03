/**
 * fix_100_146.js
 * scan_100_146.json 결과를 토대로 Unit 100~146의 잘린 정답을 수정합니다.
 * practiceB 정답을 참조해 자동 수정하되, practiceB 정답이 없으면 건너뜁니다.
 */

const fs = require('fs');
const path = require('path');

const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');
const SCAN_FILE = path.join(__dirname, '..', 'scan_100_146.json');

const scanResults = JSON.parse(fs.readFileSync(SCAN_FILE, 'utf-8'));

// practiceB에서 동일 번호 정답 찾기
function findPracticeBAnswer(practiceBContent, qNum) {
  if (!practiceBContent) return null;
  const lines = practiceBContent.split('\n');
  const paddedNum = String(qNum).padStart(2, '0');

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(new RegExp(`\\*\\*${paddedNum}\\.\\*\\*`))) {
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

// 유닛별로 그룹핑
const byUnit = {};
scanResults.forEach(r => {
  if (!byUnit[r.unit]) byUnit[r.unit] = [];
  byUnit[r.unit].push(r);
});

let totalFixed = 0;
let totalSkipped = 0;
const fixLog = [];

for (const [unitNum, issues] of Object.entries(byUnit)) {
  const filePath = path.join(UNITS_DIR, `${unitNum}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  let practicalContent = data.stages?.practical;
  const practiceBContent = data.stages?.practiceB;

  if (!practicalContent) continue;

  let lines = practicalContent.split('\n');
  let modified = false;

  for (const issue of issues) {
    const { qNum, lineIndex, truncatedAnswer } = issue;

    // practiceB에서 정답 가져오기
    const bAnswer = qNum ? findPracticeBAnswer(practiceBContent, qNum) : null;

    if (!bAnswer) {
      console.log(`[SKIP] Unit ${unitNum} Q${qNum} - practiceB 정답 없음`);
      totalSkipped++;
      continue;
    }

    // lineIndex의 줄을 찾아서 수정
    const targetLine = lines[lineIndex];
    if (!targetLine || !targetLine.includes('정답')) {
      console.log(`[SKIP] Unit ${unitNum} Q${qNum} - 라인 불일치 (L${lineIndex + 1})`);
      totalSkipped++;
      continue;
    }

    // 정답 부분만 교체
    // 패턴: "> 정답: ..." 또는 "정답: ..."
    const newLine = targetLine.replace(
      /(\> )?정답[^\S\n]*[*:：\s]*.+/,
      `$1정답: ${bAnswer}`
    );

    if (newLine === targetLine) {
      console.log(`[SKIP] Unit ${unitNum} Q${qNum} - 교체 실패 (패턴 미일치)`);
      totalSkipped++;
      continue;
    }

    lines[lineIndex] = newLine;
    modified = true;
    totalFixed++;

    fixLog.push({
      unit: unitNum,
      qNum,
      before: truncatedAnswer,
      after: bAnswer
    });

    console.log(`[FIX] Unit ${unitNum} Q${String(qNum).padStart(2,'0')}`);
    console.log(`  이전: ${truncatedAnswer.substring(0, 80)}`);
    console.log(`  이후: ${bAnswer.substring(0, 80)}`);
  }

  if (modified) {
    data.stages.practical = lines.join('\n');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`\n✅ Unit ${unitNum} 저장 완료\n`);
  }
}

console.log('\n==============================');
console.log(`수정 완료: ${totalFixed}건`);
console.log(`건너뜀:   ${totalSkipped}건`);
console.log('==============================\n');

// 수정 로그 저장
fs.writeFileSync(
  path.join(__dirname, '..', 'fix_100_146_log.json'),
  JSON.stringify(fixLog, null, 2),
  'utf-8'
);
console.log('로그 저장: fix_100_146_log.json');

/**
 * fix_skipped_100_146.js
 * fix_100_146.js에서 SKIP된 항목들을 처리합니다.
 * 패턴 미일치 원인 분석 및 수동 패턴 수정
 */

const fs = require('fs');
const path = require('path');

const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');

// 각 유닛의 SKIP 항목들 - 패턴 미일치 이유: 정답이 여러 줄에 걸친 경우 또는 다른 형식
// scan_100_146.json에서 SKIP된 항목들
const SKIPPED = [
  { unit: '100', qNum: 16 }, { unit: '100', qNum: 18 },
  { unit: '101', qNum: 3 }, { unit: '101', qNum: 14 },
  { unit: '103', qNum: 12 }, { unit: '103', qNum: 13 },
  { unit: '104', qNum: 11 },
  { unit: '105', qNum: 6 }, { unit: '105', qNum: 11 },
  { unit: '106', qNum: 9 }, { unit: '106', qNum: 11 }, { unit: '106', qNum: 16 },
  { unit: '109', qNum: 7 }, { unit: '109', qNum: 15 },
  { unit: '111', qNum: 20 },
  { unit: '112', qNum: 4 }, { unit: '112', qNum: 11 }, { unit: '112', qNum: 12 },
  { unit: '112', qNum: 13 }, { unit: '112', qNum: 14 }, { unit: '112', qNum: 15 },
  { unit: '112', qNum: 18 }, { unit: '112', qNum: 20 },
  { unit: '113', qNum: 1 }, { unit: '113', qNum: 2 }, { unit: '113', qNum: 4 },
  { unit: '113', qNum: 7 }, { unit: '113', qNum: 8 }, { unit: '113', qNum: 20 },
  { unit: '114', qNum: 6 }, { unit: '114', qNum: 13 }, { unit: '114', qNum: 15 },
  { unit: '115', qNum: 11 }, { unit: '115', qNum: 12 }, { unit: '115', qNum: 15 },
  { unit: '115', qNum: 16 }, { unit: '115', qNum: 17 },
  { unit: '116', qNum: 8 }, { unit: '116', qNum: 11 },
  { unit: '117', qNum: 11 }, { unit: '117', qNum: 13 }, { unit: '117', qNum: 14 },
  { unit: '118', qNum: 7 },
  { unit: '119', qNum: 7 }, { unit: '119', qNum: 20 },
  { unit: '120', qNum: 16 },
  { unit: '121', qNum: 7 }, { unit: '121', qNum: 15 },
  { unit: '122', qNum: 6 }, { unit: '122', qNum: 8 }, { unit: '122', qNum: 11 },
  { unit: '122', qNum: 12 }, { unit: '122', qNum: 15 }, { unit: '122', qNum: 16 }, { unit: '122', qNum: 18 },
  { unit: '123', qNum: 6 }, { unit: '123', qNum: 11 }, { unit: '123', qNum: 19 },
  { unit: '124', qNum: 9 }, { unit: '124', qNum: 10 }, { unit: '124', qNum: 11 }, { unit: '124', qNum: 20 },
  { unit: '125', qNum: 4 }, { unit: '125', qNum: 6 }, { unit: '125', qNum: 9 },
  { unit: '125', qNum: 12 }, { unit: '125', qNum: 19 }, { unit: '125', qNum: 20 },
  { unit: '126', qNum: 15 },
  { unit: '127', qNum: 6 }, { unit: '127', qNum: 7 }, { unit: '127', qNum: 9 }, { unit: '127', qNum: 13 },
  { unit: '128', qNum: 5 }, { unit: '128', qNum: 8 },
  { unit: '129', qNum: 14 },
  { unit: '131', qNum: 1 }, { unit: '131', qNum: 3 }, { unit: '131', qNum: 7 },
  { unit: '131', qNum: 11 }, { unit: '131', qNum: 12 },
  { unit: '132', qNum: 6 }, { unit: '132', qNum: 11 }, { unit: '132', qNum: 14 }, { unit: '132', qNum: 15 },
  { unit: '133', qNum: 1 }, { unit: '133', qNum: 7 }, { unit: '133', qNum: 10 }, { unit: '133', qNum: 20 },
  { unit: '134', qNum: 12 }, { unit: '134', qNum: 16 }, { unit: '134', qNum: 18 }, { unit: '134', qNum: 20 },
  { unit: '135', qNum: 15 },
  { unit: '136', qNum: 6 }, { unit: '136', qNum: 8 }, { unit: '136', qNum: 10 }, { unit: '136', qNum: 12 },
  { unit: '137', qNum: 5 }, { unit: '137', qNum: 9 }, { unit: '137', qNum: 13 },
  { unit: '138', qNum: 5 }, { unit: '138', qNum: 6 }, { unit: '138', qNum: 14 }, { unit: '138', qNum: 15 }, { unit: '138', qNum: 16 },
  { unit: '139', qNum: 10 },
  { unit: '141', qNum: 9 }, { unit: '141', qNum: 17 }, { unit: '141', qNum: 18 },
  { unit: '142', qNum: 2 }, { unit: '142', qNum: 3 }, { unit: '142', qNum: 5 },
  { unit: '142', qNum: 9 }, { unit: '142', qNum: 10 }, { unit: '142', qNum: 12 }, { unit: '142', qNum: 18 },
  { unit: '143', qNum: 1 }, { unit: '143', qNum: 2 }, { unit: '143', qNum: 5 },
  { unit: '143', qNum: 18 }, { unit: '143', qNum: 19 }, { unit: '143', qNum: 20 },
  { unit: '144', qNum: 1 }, { unit: '144', qNum: 2 }, { unit: '144', qNum: 5 }, { unit: '144', qNum: 6 },
  { unit: '144', qNum: 7 }, { unit: '144', qNum: 10 }, { unit: '144', qNum: 16 }, { unit: '144', qNum: 19 }, { unit: '144', qNum: 20 },
  { unit: '145', qNum: 2 }, { unit: '145', qNum: 6 }, { unit: '145', qNum: 9 },
  { unit: '145', qNum: 11 }, { unit: '145', qNum: 12 }, { unit: '145', qNum: 15 },
  { unit: '146', qNum: 5 }, { unit: '146', qNum: 7 }, { unit: '146', qNum: 10 }, { unit: '146', qNum: 11 },
];

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
SKIPPED.forEach(item => {
  const key = item.unit.padStart(3, '0');
  if (!byUnit[key]) byUnit[key] = [];
  byUnit[key].push(item.qNum);
});

let totalFixed = 0;
let totalSkipped = 0;
const report = [];

for (const [unitNum, qNums] of Object.entries(byUnit)) {
  const filePath = path.join(UNITS_DIR, `${unitNum}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  let practicalContent = data.stages?.practical;
  const practiceBContent = data.stages?.practiceB;

  if (!practicalContent) continue;

  let lines = practicalContent.split('\n');
  let modified = false;

  for (const qNum of qNums) {
    const bAnswer = findPracticeBAnswer(practiceBContent, qNum);
    if (!bAnswer) {
      console.log(`[NO_B] Unit ${unitNum} Q${qNum} - practiceB 정답 없음`);
      totalSkipped++;
      report.push({ unit: unitNum, qNum, status: 'no_b_answer' });
      continue;
    }

    const paddedNum = String(qNum).padStart(2, '0');
    // 문제 번호로 시작하는 블록 찾기
    let qStart = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(new RegExp(`\\*\\*${paddedNum}\\.\\*\\*`))) {
        qStart = i;
        break;
      }
    }

    if (qStart === -1) {
      console.log(`[NOT_FOUND] Unit ${unitNum} Q${qNum} - 문제 블록을 찾지 못함`);
      totalSkipped++;
      report.push({ unit: unitNum, qNum, status: 'not_found' });
      continue;
    }

    // 정답 라인 찾기 (qStart 이후 25줄 이내)
    let answerLineIdx = -1;
    for (let i = qStart + 1; i < Math.min(lines.length, qStart + 30); i++) {
      if (lines[i].includes('정답')) {
        answerLineIdx = i;
        break;
      }
    }

    if (answerLineIdx === -1) {
      console.log(`[NO_ANSWER] Unit ${unitNum} Q${qNum} - 정답 라인 없음`);
      totalSkipped++;
      report.push({ unit: unitNum, qNum, status: 'no_answer_line' });
      continue;
    }

    const oldLine = lines[answerLineIdx];
    const oldAnswerMatch = oldLine.match(/정답[^\S\n]*[*:：\s]*(.*)/);
    const oldAnswer = oldAnswerMatch ? oldAnswerMatch[1].trim() : '';

    // 정답이 이미 완전하면 SKIP
    if (oldAnswer.length > 0 && oldAnswer === bAnswer) {
      console.log(`[SAME] Unit ${unitNum} Q${qNum} - 이미 같음`);
      totalSkipped++;
      continue;
    }

    // 교체
    const prefix = oldLine.match(/^(\> )?/)[0];
    const newLine = `${prefix}정답: ${bAnswer}`;
    lines[answerLineIdx] = newLine;
    modified = true;
    totalFixed++;

    console.log(`[FIX] Unit ${unitNum} Q${String(qNum).padStart(2,'0')}`);
    console.log(`  이전: ${oldAnswer.substring(0, 80)}`);
    console.log(`  이후: ${bAnswer.substring(0, 80)}`);

    report.push({ unit: unitNum, qNum, status: 'fixed', before: oldAnswer, after: bAnswer });
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

fs.writeFileSync(
  path.join(__dirname, '..', 'fix_skipped_log.json'),
  JSON.stringify(report, null, 2),
  'utf-8'
);
console.log('로그 저장: fix_skipped_log.json');

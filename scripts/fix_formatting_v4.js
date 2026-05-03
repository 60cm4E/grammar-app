/**
 * fix_formatting_v4.js
 * 전체 164개 유닛 포맷팅 개선 (Unit 080 템플릿 기반)
 * 
 * 처리 패턴:
 * 1. practical 선택지가 같은 줄에 붙어있는 경우 → 각 선택지를 별도 줄로
 * 2. practical/practiceB 정답이 120자 초과 → 문장 경계에서 분리
 * 3. concept 긴 설명 → 문장 경계에서 분리
 * 4. practiceB 정답에 여러 예문이 붙어있는 경우 → ., 기준으로 분리
 */

const fs = require('fs');
const path = require('path');

const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');

let totalFixed = 0;
let filesModified = 0;
const fixLog = [];

// 선택지 분리: "sentence choice1 choice2 choice3 choice4" 패턴
// 선택지는 보통 짧은 구/단어
function splitChoicesFromLine(line) {
  // 패턴: **NN.** 문제 [문장들] choice1 choice2 choice3 choice4
  // 선택지는 보통 ① ② ③ ④ 또는 숫자 없이 나열됨
  
  // 정답 줄은 건드리지 않음
  if (line.includes('정답')) return null;
  if (!line.startsWith('**')) return null;
  
  // 선택지 패턴: 공백으로 구분된 짧은 항목들이 줄 끝에 오는 경우
  // "문장 choice1 choice2 choice3 choice4"
  // 선택지 감지: 4개의 항목이 공백으로 구분되어 있고 각 항목이 짧음
  
  // 단어들을 뒤에서부터 분석
  const words = line.split(' ');
  if (words.length < 6) return null;
  
  // 마지막 4개가 선택지인지 확인
  // (짧은 구문들, 보통 1-5단어씩)
  // 이 패턴은 너무 복잡해서 다른 방법 사용
  return null;
}

// 문장 경계에서 분리
function splitAtSentenceBoundary(line, maxLen = 110) {
  if (line.length <= maxLen) return [line];
  
  const result = [];
  let remaining = line;
  
  while (remaining.length > maxLen) {
    // 마침표, 물음표, 느낌표 뒤의 공백에서 분리
    let splitIdx = -1;
    
    // maxLen 이전의 마지막 문장 경계 찾기
    for (let i = Math.min(maxLen, remaining.length - 1); i > 30; i--) {
      if ((remaining[i] === ' ' || remaining[i] === '\n') && 
          i > 0 && /[.?!,]/.test(remaining[i-1])) {
        splitIdx = i;
        break;
      }
    }
    
    // 콤마나 마침표 없으면 공백에서 분리
    if (splitIdx === -1) {
      for (let i = Math.min(maxLen, remaining.length - 1); i > 30; i--) {
        if (remaining[i] === ' ') {
          splitIdx = i;
          break;
        }
      }
    }
    
    if (splitIdx === -1) break; // 분리 불가
    
    result.push(remaining.substring(0, splitIdx).trim());
    remaining = remaining.substring(splitIdx + 1).trim();
  }
  
  if (remaining) result.push(remaining);
  return result.length > 1 ? result : null;
}

for (let i = 1; i <= 164; i++) {
  const unitNum = String(i).padStart(3, '0');
  const filePath = path.join(UNITS_DIR, `${unitNum}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  let modified = false;
  
  for (const stageKey of Object.keys(data.stages || {})) {
    let content = data.stages[stageKey];
    if (!content) continue;
    
    const origContent = content;
    const lines = content.split('\n');
    const newLines = [];
    
    for (let j = 0; j < lines.length; j++) {
      const line = lines[j];
      
      // 120자 이하면 그대로
      if (line.length <= 120) {
        newLines.push(line);
        continue;
      }
      
      // === PATTERN 1: 정답 줄의 긴 정답 ===
      // 정답이 한 줄로 있어야 렌더링에 문제 없으므로 그대로 유지
      if (line.includes('정답') && line.length <= 300) {
        newLines.push(line);
        continue;
      }
      
      // === PATTERN 2: concept - 굵은 단어 목록 (I am → **I'm**, ...) ===
      // → 이미 표시 역할이라 그대로
      if (stageKey === 'concept' && line.includes('**') && line.includes('→')) {
        // 화살표로 구분되는 항목들 → 줄별로 분리
        const items = line.split(',');
        if (items.length >= 3) {
          items.forEach(item => newLines.push(item.trim()));
          modified = true;
          totalFixed++;
          continue;
        }
        newLines.push(line);
        continue;
      }
      
      // === PATTERN 3: practical 선택지가 붙은 경우 ===
      // "**NN.** 문제 설명... choice1 choice2 choice3 choice4"
      // 선택지들은 공백으로 구분, 각각 짧음
      if (stageKey === 'practical' && !line.includes('정답')) {
        // 선택지 분리 시도: 마지막에 ., ? 없이 끝나는 경우
        // 문제 문장의 끝(마침표/물음표) 이후부터 선택지
        const sentenceEndMatch = line.match(/^(.*[.?])\s+(.+)$/);
        if (sentenceEndMatch) {
          const mainPart = sentenceEndMatch[1];
          const choicesPart = sentenceEndMatch[2];
          
          // 선택지 부분이 공백으로 구분된 여러 항목인지 확인
          // (각 항목이 너무 길면 선택지가 아님)
          const choiceTokens = choicesPart.split(/\s{2,}|\s+(?=[A-Z가-힣])/);
          
          if (choiceTokens.length >= 2 && choicesPart.length > 20) {
            if (mainPart.length > 20) {
              newLines.push(mainPart);
              // 선택지들을 줄별로
              choiceTokens.forEach(t => { if(t.trim()) newLines.push(t.trim()); });
              modified = true;
              totalFixed++;
              continue;
            }
          }
        }
      }
      
      // === PATTERN 4: practiceB 정답에 여러 예문 ===
      // "> **정답** sentence1., sentence2."
      if (line.includes('정답') && line.length > 200) {
        // 매우 긴 정답은 그대로 유지 (렌더링 이슈 방지)
        newLines.push(line);
        continue;
      }
      
      // === PATTERN 5: 일반적인 긴 줄 - 문장 경계에서 분리 ===
      const split = splitAtSentenceBoundary(line, 110);
      if (split && split.length > 1) {
        split.forEach(s => newLines.push(s));
        modified = true;
        totalFixed++;
        continue;
      }
      
      // 기본: 그대로
      newLines.push(line);
    }
    
    content = newLines.join('\n');
    if (content !== origContent) {
      data.stages[stageKey] = content;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    filesModified++;
  }
}

console.log(`\n포맷팅 수정: ${totalFixed}건, ${filesModified}개 파일`);

// 남은 긴 줄 통계
let remaining = 0;
const remByStage = {};
for (let i = 1; i <= 164; i++) {
  const unitNum = String(i).padStart(3, '0');
  const data = JSON.parse(fs.readFileSync(path.join(UNITS_DIR, `${unitNum}.json`), 'utf-8'));
  for (const [key, content] of Object.entries(data.stages || {})) {
    if (!content) continue;
    content.split('\n').forEach(l => {
      if (l.length > 120) {
        remaining++;
        remByStage[key] = (remByStage[key] || 0) + 1;
      }
    });
  }
}
console.log(`\n남은 긴 줄 (>120자): ${remaining}건`);
Object.entries(remByStage).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));

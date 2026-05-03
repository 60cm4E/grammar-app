/**
 * fix_formatting_v5.js
 * 남은 긴 줄 정리:
 * - practical 정답 줄의 "., " 기준 분리
 * - concept 설명 줄 분리
 */

const fs = require('fs');
const path = require('path');

const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');

let totalFixed = 0;
let filesModified = 0;

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
      
      if (line.length <= 120) {
        newLines.push(line);
        continue;
      }
      
      // === practical/practiceB 정답 줄: "., " 기준으로 분리 ===
      if (line.includes('정답') && (stageKey === 'practical' || stageKey === 'practiceB')) {
        // 정답 prefix 추출
        const prefixMatch = line.match(/^(\> (?:\*\*)?정답:?\s*|정답:?\s*)/);
        const prefix = prefixMatch ? prefixMatch[0] : '';
        const answerPart = line.substring(prefix.length);
        
        // "., " 기준으로 분리
        if (answerPart.includes('., ') || answerPart.includes('.,')) {
          const parts = answerPart.split(/\.,\s*/).filter(p => p.trim());
          if (parts.length >= 2) {
            // 첫 번째만 prefix 붙이고 나머지는 빈 줄 없이 이어서
            newLines.push(prefix + parts[0].trim() + '.');
            for (let p = 1; p < parts.length; p++) {
              const part = parts[p].trim();
              if (part) {
                // 마침표가 없으면 추가
                newLines.push(prefix + (part.endsWith('.') || part.endsWith('?') || part.endsWith('!') ? part : part + '.'));
              }
            }
            modified = true;
            totalFixed++;
            continue;
          }
        }
        
        // 분리 안 되면 그대로
        newLines.push(line);
        continue;
      }
      
      // === concept 긴 설명 줄 ===
      if (stageKey === 'concept' && line.length > 120) {
        // 한국어 문장 경계에서 분리: 다., 요., 까요., 습니다., 랍니다. 등
        const korBoundary = /(?<=[다요습])\.(?!\s*\*\*|\s*→)/g;
        
        // 우선 마침표+공백 기준으로 시도
        let splitDone = false;
        
        // "! " 패턴에서도 분리
        const splitPoints = [];
        for (let k = 0; k < line.length - 1; k++) {
          if ((line[k] === '.' || line[k] === '!' || line[k] === '?') && 
              line[k+1] === ' ' && k > 30) {
            splitPoints.push(k + 1);
          }
        }
        
        if (splitPoints.length > 0) {
          // 120자 근처의 분리점 찾기
          let bestSplit = -1;
          for (const sp of splitPoints) {
            if (sp <= 120) bestSplit = sp;
            else break;
          }
          
          if (bestSplit > 30) {
            const part1 = line.substring(0, bestSplit).trim();
            const part2 = line.substring(bestSplit).trim();
            newLines.push(part1);
            if (part2.length > 120) {
              // 재귀적으로 처리
              const sub = part2;
              let subSplit = -1;
              for (let k = 0; k < sub.length - 1; k++) {
                if ((sub[k] === '.' || sub[k] === '!' || sub[k] === '?') && 
                    sub[k+1] === ' ' && k > 30 && k <= 120) {
                  subSplit = k + 1;
                }
              }
              if (subSplit > 0) {
                newLines.push(sub.substring(0, subSplit).trim());
                newLines.push(sub.substring(subSplit).trim());
              } else {
                newLines.push(sub);
              }
            } else {
              newLines.push(part2);
            }
            modified = true;
            totalFixed++;
            splitDone = true;
          }
        }
        
        if (!splitDone) {
          newLines.push(line);
        }
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

console.log(`\n포맷팅 v5 수정: ${totalFixed}건, ${filesModified}개 파일`);

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

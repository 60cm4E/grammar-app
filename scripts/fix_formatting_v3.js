const fs = require('fs');
const path = require('path');
const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');

let totalFixed = 0;

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
      
      if (line.length <= 120 || line.includes('정답')) {
        newLines.push(line);
        continue;
      }

      // For lines with blanks and choices mixed together
      // Try to split at " . " or "? " boundaries between question and choices
      if (line.includes('_____')) {
        // Strategy: Find the last blank, then the first period/question mark after it
        // That's where the sentence ends and choices begin
        const lastBlankIdx = line.lastIndexOf('_____');
        const afterBlank = line.substring(lastBlankIdx);
        
        // Find first sentence-ending punct after the blank section
        const punctMatch = afterBlank.match(/_{2,}\s*[^_]*?([.?])\s+/);
        if (punctMatch) {
          const splitPos = lastBlankIdx + punctMatch.index + punctMatch[0].length - 1;
          const questionPart = line.substring(0, splitPos).trim();
          const choicesPart = line.substring(splitPos).trim();
          
          if (questionPart.length > 20 && choicesPart.length > 10) {
            newLines.push(questionPart);
            newLines.push(choicesPart);
            totalFixed++;
            modified = true;
            continue;
          }
        }
      }

      // For lines with "고르시오" followed by choices
      if (line.includes('고르시오')) {
        const goruMatch = line.match(/(고르시오[.\s]*(?:\[\d개\])?)\s+(.*)/);
        if (goruMatch && goruMatch[2].length > 10) {
          newLines.push(line.substring(0, line.indexOf(goruMatch[2])).trimEnd());
          newLines.push(goruMatch[2]);
          totalFixed++;
          modified = true;
          continue;
        }
      }

      // For lines with multiple fill-in-blank sentences concatenated
      // Pattern: "_______ word word! _______ word word!"
      if (line.includes('_______') && line.length > 120) {
        const parts = line.split(/(?<=[.!?])\s+(?=_)/);
        if (parts.length >= 2) {
          parts.forEach(p => newLines.push(p.trim()));
          totalFixed++;
          modified = true;
          continue;
        }
      }

      newLines.push(line);
    }

    content = newLines.join('\n');
    if (content !== origContent) {
      data.stages[stageKey] = content;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}

console.log(`추가 포맷팅 수정: ${totalFixed}건`);

// Final count
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
        remByStage[key] = (remByStage[key]||0)+1;
      }
    });
  }
}
console.log(`남은 긴 줄: ${remaining}건`);
Object.entries(remByStage).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>console.log(`  ${k}: ${v}`));

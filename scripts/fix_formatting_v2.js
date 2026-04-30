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
      
      // Skip lines under 120 chars
      if (line.length <= 120) {
        newLines.push(line);
        continue;
      }
      
      // === PATTERN 1: Practical - "순서대로 알맞게 짝지어진" with choices ===
      // e.g., "**07.** 다음 빈칸에... 고르시오 sentence choice1 choice2 choice3 choice4"
      if (stageKey === 'practical' && line.includes('짝지어진')) {
        // Find where "고르시오" ends, then split sentence from choices
        const goruIdx = line.indexOf('고르시오');
        if (goruIdx > 0) {
          const afterGoru = line.substring(goruIdx + 4).trim();
          const beforeGoru = line.substring(0, goruIdx + 4);
          newLines.push(beforeGoru);
          newLines.push(afterGoru);
          totalFixed++;
          modified = true;
          continue;
        }
      }
      
      // === PATTERN 2: Practical - choices on same line (빈칸 fill-in) ===
      // "sentence _____ rest. choice1 choice2 choice3 choice4"  
      if (stageKey === 'practical' && line.includes('_____')) {
        // Check if next answer line exists
        let hasAnswer = false;
        for (let k = j+1; k < Math.min(lines.length, j+3); k++) {
          if (lines[k].includes('정답')) { hasAnswer = true; break; }
        }
        if (hasAnswer && line.length > 120) {
          // Find the sentence boundary (period/question mark after blank)
          const parts = line.split(/([.?])\s+/);
          if (parts.length >= 3) {
            // Reconstruct: sentence part + rest
            let sentencePart = parts[0] + parts[1]; // includes the period/qmark
            let choicesPart = parts.slice(2).join(' ');
            if (sentencePart.length > 20 && choicesPart.length > 10) {
              newLines.push(sentencePart);
              newLines.push(choicesPart.trim());
              totalFixed++;
              modified = true;
              continue;
            }
          }
        }
      }
      
      // === PATTERN 3: Practical - long passage questions (지문 문제) ===
      if (stageKey === 'practical' && line.length > 140 && !line.includes('정답')) {
        // Try to split at natural sentence boundaries
        // Find sentences and split them
        const sentences = line.match(/[^.!?]+[.!?]+/g);
        if (sentences && sentences.length >= 3) {
          // Split into groups of ~2 sentences per line
          let currentLine = '';
          for (const sent of sentences) {
            if (currentLine.length + sent.length > 100 && currentLine.length > 0) {
              newLines.push(currentLine.trim());
              currentLine = sent;
            } else {
              currentLine += sent;
            }
          }
          if (currentLine.trim()) newLines.push(currentLine.trim());
          totalFixed++;
          modified = true;
          continue;
        }
      }
      
      // === PATTERN 4: PracticeB - long answer (정답 with full passage) ===
      if (line.includes('정답') && line.length > 140) {
        // Don't split the answer line - it needs to stay as one line for rendering
        // But we can add line breaks within long passages using \n in content
        newLines.push(line);
        continue;
      }
      
      // === PATTERN 5: Concept - long teacher dialogue ===
      if (stageKey === 'concept' && line.length > 120) {
        // Split at natural Korean sentence endings (다., 요., 까요?, 이요.)
        const korSentences = line.match(/[^.?!]+[.?!]+/g);
        if (korSentences && korSentences.length >= 2) {
          let currentLine = '';
          for (const sent of korSentences) {
            if (currentLine.length + sent.length > 100 && currentLine.length > 0) {
              newLines.push(currentLine.trim());
              currentLine = sent;
            } else {
              currentLine += sent;
            }
          }
          if (currentLine.trim()) newLines.push(currentLine.trim());
          totalFixed++;
          modified = true;
          continue;
        }
      }
      
      // === PATTERN 6: PracticeB/PracticeA - long passage (not answer) ===
      if (line.length > 140 && !line.includes('정답')) {
        const sentences = line.match(/[^.!?]+[.!?]+/g);
        if (sentences && sentences.length >= 3) {
          let currentLine = '';
          for (const sent of sentences) {
            if (currentLine.length + sent.length > 100 && currentLine.length > 0) {
              newLines.push(currentLine.trim());
              currentLine = sent;
            } else {
              currentLine += sent;
            }
          }
          if (currentLine.trim()) newLines.push(currentLine.trim());
          totalFixed++;
          modified = true;
          continue;
        }
      }
      
      // Default: keep as is
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

console.log(`포맷팅 수정: ${totalFixed}건, ${filesModified}개 파일`);

// Count remaining long lines
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
console.log(`\n남은 긴 줄 (>120자): ${remaining}건`);
Object.entries(remByStage).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>console.log(`  ${k}: ${v}`));

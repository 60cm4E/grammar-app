const fs = require('fs');
const path = require('path');

const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');
const results = [];

for (let i = 1; i <= 164; i++) {
  const unitNum = String(i).padStart(3, '0');
  const filePath = path.join(UNITS_DIR, `${unitNum}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  for (const [stageKey, content] of Object.entries(data.stages || {})) {
    if (!content) continue;
    const lines = content.split('\n');

    for (let j = 0; j < lines.length; j++) {
      const line = lines[j];

      // Only check answer lines
      if (!line.includes('정답')) continue;

      // Extract answer text
      const match = line.match(/정답[\s*:]*\s*(.*)/);
      if (!match) continue;
      const answer = match[1].trim();
      if (!answer) continue;

      // Now compare with practiceB if this is practical stage
      // Check for truncation signs:

      // 1. Sentence ends abruptly (no period, no closing bracket, ends with article/preposition/conjunction)
      const endsAbruptly = /\b(the|a|an|to|of|in|on|at|for|is|was|are|were|my|his|her|its|our|your|their|and|or|but|that|which|who|whom|whose|when|where|if|as|than|more|most|very|so|too|not|can|could|would|should|will|had|has|have|been|be|do|does|did|with|from|by|about|into|over|after|before)\s*$/i;

      // 2. Sentence with opening but no closing mark
      const openParens = (answer.match(/\(/g) || []).length;
      const closeParens = (answer.match(/\)/g) || []).length;
      const openQuotes = (answer.match(/"/g) || []).length;

      // 3. Ends with comma (likely list was cut)
      const endsWithComma = /,\s*$/.test(answer);

      // 4. Korean sentence cut mid-word
      const koreanCutOff = /[\uAC00-\uD7AF]\s*$/.test(answer) && answer.length > 30 && !answer.endsWith('.') && !answer.endsWith('다') && !answer.endsWith('요');

      let isTruncated = false;
      let reason = '';

      if (endsAbruptly.test(answer) && answer.length > 25) {
        isTruncated = true;
        reason = 'Ends with article/prep/conj';
      } else if (endsWithComma && answer.length > 20) {
        // Check if this is a legitimate list answer (e.g., "was, were,")
        // vs a truncated sentence
        const afterLastComma = answer.substring(answer.lastIndexOf(',') + 1).trim();
        if (!afterLastComma && answer.split(',').length <= 2) {
          // Might be truncated if only 1-2 items in list
          isTruncated = true;
          reason = 'Ends with comma (possible truncation)';
        }
      }

      // For practical stage, cross-reference with practiceB
      if (isTruncated && stageKey === 'practical' && data.stages.practiceB) {
        // Find corresponding question number
        let qNum = null;
        for (let k = j; k >= Math.max(0, j - 15); k--) {
          const qm = lines[k].match(/\*\*(\d{2})\.\*\*/);
          if (qm) { qNum = qm[1]; break; }
        }

        if (qNum) {
          // Find the same question in practiceB
          const bLines = data.stages.practiceB.split('\n');
          for (let bi = 0; bi < bLines.length; bi++) {
            if (bLines[bi].includes(`**${qNum}.**`)) {
              // Find answer in practiceB
              for (let bj = bi + 1; bj < Math.min(bLines.length, bi + 20); bj++) {
                if (bLines[bj].includes('정답')) {
                  const bMatch = bLines[bj].match(/정답[\s*:]*\s*(.*)/);
                  if (bMatch) {
                    const bAnswer = bMatch[1].trim();
                    // If practiceB answer is significantly longer, practical is likely truncated
                    if (bAnswer.length > answer.length + 10) {
                      reason += ' | practiceB answer is longer: "' + bAnswer.substring(0, 60) + '..."';
                    } else {
                      // practiceB answer is similar length - probably NOT truncated
                      isTruncated = false;
                    }
                  }
                  break;
                }
              }
              break;
            }
          }
        }
      }

      if (isTruncated) {
        results.push({
          unit: unitNum,
          stage: stageKey,
          line: j + 1,
          reason,
          answer: answer.substring(0, 100)
        });
      }
    }
  }
}

// Output
console.log(`\n=== 잘린 정답 정밀 스캔 결과 ===\n`);
console.log(`총 ${results.length}건 의심\n`);

// Group by stage
const byStage = {};
results.forEach(r => { byStage[r.stage] = (byStage[r.stage] || 0) + 1; });
Object.entries(byStage).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${k}: ${v}건`));

console.log('');
results.forEach(r => {
  console.log(`Unit ${r.unit} [${r.stage}] L${r.line}:`);
  console.log(`  답: ${r.answer}`);
  console.log(`  이유: ${r.reason}`);
  console.log('');
});

fs.writeFileSync(path.join(__dirname, '..', 'scan_truncated_v2.json'), JSON.stringify(results, null, 2), 'utf-8');

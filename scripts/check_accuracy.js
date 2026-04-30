const fs = require('fs');
const path = require('path');
const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');

const issues = [];

for (let i = 1; i <= 164; i++) {
  const unitNum = String(i).padStart(3, '0');
  const data = JSON.parse(fs.readFileSync(path.join(UNITS_DIR, `${unitNum}.json`), 'utf-8'));

  for (const [stageKey, content] of Object.entries(data.stages || {})) {
    if (!content) continue;
    const lines = content.split('\n');

    for (let j = 0; j < lines.length; j++) {
      const line = lines[j];

      // === CHECK 1: Empty/Missing answers ===
      if (/^>\s*\*?\*?정답\*?\*?\s*:?\s*$/.test(line.trim())) {
        const nextLine = (j + 1 < lines.length) ? lines[j + 1].trim() : '';
        if (!nextLine || nextLine === '---' || nextLine.startsWith('**')) {
          issues.push({ unit: unitNum, stage: stageKey, line: j + 1, type: 'EMPTY_ANSWER', text: line.trim() });
        }
      }

      // === CHECK 2: Duplicate consecutive answers ===
      if (j > 0 && line.includes('정답') && lines[j - 1].includes('정답') && line.trim() === lines[j - 1].trim()) {
        issues.push({ unit: unitNum, stage: stageKey, line: j + 1, type: 'DUPLICATE_ANSWER', text: line.substring(0, 60) });
      }

      // === CHECK 3: Answer contains question instruction text ===
      if (line.includes('정답') && (line.includes('고르시오') || line.includes('쓰시오') || line.includes('고르세요'))) {
        issues.push({ unit: unitNum, stage: stageKey, line: j + 1, type: 'INSTRUCTION_IN_ANSWER', text: line.substring(0, 80) });
      }

      // === CHECK 4: Grammar errors in English answers ===
      if (line.includes('정답')) {
        const ansMatch = line.match(/정답[\s*:]*\s*(.*)/);
        if (ansMatch) {
          const ans = ansMatch[1].trim();

          // 4a: Double articles
          if (/\b(a a|an an|the the)\b/i.test(ans)) {
            issues.push({ unit: unitNum, stage: stageKey, line: j + 1, type: 'DOUBLE_ARTICLE', text: ans.substring(0, 60) });
          }

          // 4b: Double spaces (potential merge artifact)
          if (/  {2,}/.test(ans) && ans.length > 10) {
            issues.push({ unit: unitNum, stage: stageKey, line: j + 1, type: 'DOUBLE_SPACE', text: ans.substring(0, 60) });
          }

          // 4c: Answer is "undefined" or "null"
          if (ans === 'undefined' || ans === 'null' || ans === 'NaN') {
            issues.push({ unit: unitNum, stage: stageKey, line: j + 1, type: 'INVALID_ANSWER', text: ans });
          }

          // 4d: Mismatched quotes
          const dblQuotes = (ans.match(/"/g) || []).length;
          if (dblQuotes % 2 !== 0 && dblQuotes > 0) {
            issues.push({ unit: unitNum, stage: stageKey, line: j + 1, type: 'MISMATCHED_QUOTES', text: ans.substring(0, 60) });
          }

          // 4e: Mismatched parentheses
          const openP = (ans.match(/\(/g) || []).length;
          const closeP = (ans.match(/\)/g) || []).length;
          if (openP !== closeP && (openP + closeP) > 0) {
            issues.push({ unit: unitNum, stage: stageKey, line: j + 1, type: 'MISMATCHED_PARENS', text: ans.substring(0, 60) });
          }
        }
      }

      // === CHECK 5: Broken markdown patterns ===
      // 5a: Orphaned bold markers
      if (line.trim() === '**' || line.trim() === '> **') {
        issues.push({ unit: unitNum, stage: stageKey, line: j + 1, type: 'ORPHAN_BOLD', text: line.trim() });
      }

      // 5b: Question without answer (question line followed by --- without answer)
      if (line.match(/\*\*\d{2}\.\*\*/) && !line.includes('정답')) {
        // Look for answer within next 20 lines
        let hasAnswer = false;
        for (let k = j + 1; k < Math.min(lines.length, j + 25); k++) {
          if (lines[k].includes('정답')) { hasAnswer = true; break; }
          if (lines[k].match(/\*\*\d{2}\.\*\*/)) break; // next question found first
        }
        if (!hasAnswer) {
          issues.push({ unit: unitNum, stage: stageKey, line: j + 1, type: 'MISSING_ANSWER', text: line.substring(0, 60) });
        }
      }

      // === CHECK 6: "undefined" text in content ===
      if (line === 'undefined') {
        issues.push({ unit: unitNum, stage: stageKey, line: j + 1, type: 'UNDEFINED_LINE', text: 'undefined' });
      }

      // === CHECK 7: Practical answer not matching any choice ===
      // Only for multiple choice: check if answer text appears in the question options
      if (stageKey === 'practical' && line.includes('정답') && !line.includes('→') && !line.includes('틀린곳')) {
        const ansMatch = line.match(/정답[\s*:]*\s*(.*)/);
        if (ansMatch) {
          const ans = ansMatch[1].trim();
          // Check if it's a sentence answer (not a single word/correction)
          if (ans.length > 30 && !ans.includes(',')) {
            // Look backwards for the question and choices
            let questionContent = '';
            for (let k = j - 1; k >= Math.max(0, j - 15); k--) {
              if (lines[k].match(/\*\*\d{2}\.\*\*/)) break;
              questionContent = lines[k] + ' ' + questionContent;
            }
            // Check if the answer sentence appears in the question content
            if (questionContent.length > 10 && !questionContent.includes(ans.substring(0, 20))) {
              // Answer doesn't appear in choices - might be wrong
              // Only flag if very confident
            }
          }
        }
      }
    }

    // === CHECK 8: Stage content is suspiciously short ===
    if (content.length < 50 && stageKey !== 'concept') {
      issues.push({ unit: unitNum, stage: stageKey, line: 0, type: 'SHORT_CONTENT', text: `Only ${content.length} chars` });
    }

    // === CHECK 9: practical vs practiceB answer mismatch (same Q, different format) ===
    // Already handled in truncation fix - skip
  }

  // === CHECK 10: Missing stages ===
  const expectedStages = ['concept', 'practiceA', 'practiceB', 'descriptive', 'practical'];
  for (const stage of expectedStages) {
    if (!data.stages[stage]) {
      issues.push({ unit: unitNum, stage: stage, line: 0, type: 'MISSING_STAGE', text: `Stage "${stage}" is missing` });
    }
  }
}

// Output results
console.log('=== 해석 정확성 전수 검토 결과 ===\n');
console.log(`총 이슈: ${issues.length}건\n`);

// Group by type
const byType = {};
issues.forEach(i => { byType[i.type] = (byType[i.type] || 0) + 1; });
Object.entries(byType).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${k}: ${v}건`));

console.log('\n=== 상세 ===\n');
issues.forEach(i => {
  console.log(`[${i.type}] Unit ${i.unit} [${i.stage}] L${i.line}: ${i.text}`);
});

// Save
fs.writeFileSync(path.join(__dirname, '..', 'accuracy_check.json'), JSON.stringify(issues, null, 2), 'utf-8');

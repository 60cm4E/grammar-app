const fs = require('fs');
const path = require('path');
const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');

const issues = [];

// Common grammar error patterns in English
const grammarPatterns = [
  { name: 'DOUBLE_WORD', pattern: /\b(\w{3,})\s+\1\b/gi, desc: 'Repeated word' },
  { name: 'EXTRA_PERIOD', pattern: /\.\s*\.\s/g, desc: 'Double period' },
  { name: 'SPACE_BEFORE_PERIOD', pattern: /\s+\./g, desc: 'Space before period' },
  { name: 'SPACE_BEFORE_COMMA', pattern: /\s+,/g, desc: 'Space before comma' },
  { name: 'DOUBLE_COMMA', pattern: /,,/g, desc: 'Double comma' },
  { name: 'MISSING_SPACE_AFTER_PERIOD', pattern: /\.[A-Z][a-z]/g, desc: 'No space after period' },
];

for (let i = 1; i <= 164; i++) {
  const unitNum = String(i).padStart(3, '0');
  const data = JSON.parse(fs.readFileSync(path.join(UNITS_DIR, `${unitNum}.json`), 'utf-8'));

  for (const [stageKey, content] of Object.entries(data.stages || {})) {
    if (!content) continue;
    const lines = content.split('\n');

    for (let j = 0; j < lines.length; j++) {
      const line = lines[j];
      if (!line.includes('정답')) continue;
      
      const ansMatch = line.match(/정답[\s*:]*\s*(.*)/);
      if (!ansMatch) continue;
      const answer = ansMatch[1].trim();
      if (answer.length < 5) continue;

      for (const gp of grammarPatterns) {
        const matches = answer.match(gp.pattern);
        if (matches) {
          // Filter out false positives
          if (gp.name === 'SPACE_BEFORE_PERIOD' && answer.includes('___')) continue; // blanks
          if (gp.name === 'SPACE_BEFORE_COMMA' && answer.includes('___')) continue;
          if (gp.name === 'DOUBLE_WORD') {
            // Skip if it's intentional (e.g., "had had", "that that")
            const word = matches[0].split(/\s+/)[0].toLowerCase();
            if (['had', 'that', 'is', 'was', 'the'].includes(word)) continue;
          }
          
          issues.push({
            unit: unitNum, stage: stageKey, line: j + 1,
            type: gp.name, desc: gp.desc,
            match: matches[0],
            answer: answer.substring(0, 80)
          });
        }
      }
    }
  }
}

console.log('=== 정답 영문법 패턴 검증 ===\n');
console.log(`총 이슈: ${issues.length}건\n`);

const byType = {};
issues.forEach(i => { byType[i.type] = (byType[i.type] || 0) + 1; });
Object.entries(byType).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${k}: ${v}건`));

console.log('\n=== 상세 ===\n');
issues.forEach(i => {
  console.log(`[${i.type}] Unit ${i.unit} [${i.stage}] L${i.line}: "${i.match}" in "${i.answer}"`);
});

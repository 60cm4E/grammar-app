const fs = require('fs');
const path = require('path');

const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');

// Patterns that indicate truncated answers
// 1. Answer line ending with a comma or article/preposition (incomplete sentence)
// 2. Answer line ending right after "정답:" with very short content
// 3. Lines that end with common truncation indicators

const results = [];

for (let i = 1; i <= 164; i++) {
  const unitNum = String(i).padStart(3, '0');
  const filePath = path.join(UNITS_DIR, `${unitNum}.json`);
  
  if (!fs.existsSync(filePath)) continue;
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  // Check all stages, but focus on practical
  for (const [stageKey, content] of Object.entries(data.stages || {})) {
    if (!content) continue;
    
    const lines = content.split('\n');
    const issues = [];
    
    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      
      // Check for truncated answers (정답 lines)
      if (line.includes('정답') && line.includes(':')) {
        const answerPart = line.split(/정답[:]?\s*/)[1];
        if (!answerPart) continue;
        
        const trimmed = answerPart.trim();
        
        // Pattern 1: ends with articles, prepositions, conjunctions (likely truncated)
        const truncatedEndings = /\b(a|an|the|to|of|in|on|at|for|is|was|are|were|He|She|I|It|We|They|his|her|my|its|than|that|so|too|more)\s*$/;
        if (truncatedEndings.test(trimmed)) {
          issues.push({
            line: lineIdx + 1,
            type: 'TRUNCATED_END',
            content: trimmed.substring(0, 100)
          });
        }
        
        // Pattern 2: ends with comma suggesting more content expected
        if (trimmed.endsWith(',') || trimmed.endsWith(', ')) {
          issues.push({
            line: lineIdx + 1,
            type: 'ENDS_WITH_COMMA',
            content: trimmed.substring(0, 100)
          });
        }
        
        // Pattern 3: answer seems to be cut mid-sentence (has opening but no closing)
        if ((trimmed.split('"').length % 2 === 0) || 
            (trimmed.split("'").length % 2 === 0 && trimmed.includes("'"))) {
          // Unmatched quotes - might be truncated
          // Skip common Korean patterns
          if (!trimmed.includes('→') && trimmed.length > 10) {
            issues.push({
              line: lineIdx + 1,
              type: 'UNMATCHED_QUOTE',
              content: trimmed.substring(0, 100)
            });
          }
        }
        
        // Pattern 4: empty or very short answer
        if (trimmed.length === 0) {
          issues.push({
            line: lineIdx + 1,
            type: 'EMPTY_ANSWER',
            content: '(empty)'
          });
        }
      }
    }
    
    if (issues.length > 0) {
      results.push({
        unit: unitNum,
        title: data.title,
        stage: stageKey,
        issues
      });
    }
  }
}

// Output report
console.log('# 잘린 정답 스캔 결과\n');
console.log(`총 스캔: 164개 유닛`);
console.log(`문제 발견: ${results.length}개 파일\n`);

let totalIssues = 0;
for (const r of results) {
  console.log(`## Unit ${r.unit}: ${r.title} [${r.stage}]`);
  for (const issue of r.issues) {
    totalIssues++;
    console.log(`  - [${issue.type}] Line ${issue.line}: ${issue.content}`);
  }
  console.log('');
}

console.log(`\n총 이슈: ${totalIssues}건`);

// Also output as JSON for processing
const outputPath = path.join(__dirname, '..', 'scan_results.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
console.log(`\nJSON 결과: ${outputPath}`);

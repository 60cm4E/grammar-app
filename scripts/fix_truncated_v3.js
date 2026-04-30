const fs = require('fs');
const path = require('path');

const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');
const scanResults = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scan_truncated_v2.json'), 'utf-8'));

// Filter: only practical stage items that have a practiceB reference (confirmed truncated)
const targets = scanResults.filter(x => 
  x.stage === 'practical' && x.reason.includes('practiceB answer is longer')
);

console.log(`practical 잘린 정답 (practiceB 확인): ${targets.length}건\n`);

let totalFixed = 0;

for (const target of targets) {
  const filePath = path.join(UNITS_DIR, `${target.unit}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  let practical = data.stages.practical;
  const practiceB = data.stages.practiceB || '';
  const pLines = practical.split('\n');
  const answerLine = pLines[target.line - 1];

  if (!answerLine || !answerLine.includes('정답')) continue;

  // Extract the truncated answer
  const aMatch = answerLine.match(/정답[\s*:]*\s*(.*)/);
  if (!aMatch) continue;
  const truncatedAnswer = aMatch[1].trim();

  // Find the question number
  let qNum = null;
  for (let k = target.line - 1; k >= Math.max(0, target.line - 20); k--) {
    const qm = pLines[k].match(/\*\*(\d{2})\.\*\*/);
    if (qm) { qNum = qm[1]; break; }
  }
  if (!qNum) continue;

  // Find practiceB answer for the same question
  const bLines = practiceB.split('\n');
  let bAnswer = '';
  for (let bi = 0; bi < bLines.length; bi++) {
    if (bLines[bi].includes(`**${qNum}.**`)) {
      for (let bj = bi + 1; bj < Math.min(bLines.length, bi + 25); bj++) {
        if (bLines[bj].includes('정답')) {
          const bm = bLines[bj].match(/정답[\s*:]*\s*(.*)/);
          if (bm) bAnswer = bm[1].trim();
          break;
        }
      }
      break;
    }
  }

  if (!bAnswer || bAnswer.length <= truncatedAnswer.length) continue;

  // Find the structural pattern: practical answer should end the same way as practiceB
  // Extract the ending pattern from practiceB
  // The practical version changes some nouns/names but keeps the same grammatical structure
  
  // Strategy: find the common suffix (the ending that was cut off)
  // The truncated part starts where the practical answer ends
  // The practiceB answer has the complete structure
  
  // Find how much of the end is similar
  // e.g., practical: "...I wouldn't have been in the" (cuts here)
  //        practiceB: "...I wouldn't have been in the hospital now."
  // The missing part is "hospital now." but with possibly different word (e.g., "clinic" instead of "hospital")
  
  // Simpler approach: use the practiceB ending structure
  // Find the divergence point between practical and practiceB answers
  const pWords = truncatedAnswer.split(/\s+/);
  const bWords = bAnswer.split(/\s+/);
  
  // Find common prefix length
  let commonPrefix = 0;
  const minLen = Math.min(pWords.length, bWords.length);
  // Since practical changes some words, we look for structural similarity
  // Instead, let's use a smarter approach:
  // Find the last few words of practical answer, find them in practiceB, get the continuation
  
  const lastWords = pWords.slice(-3).join(' ');
  // Find similar pattern in practiceB
  const bText = bAnswer;
  
  // The simplest reliable fix: count words in practiceB answer after the truncation point
  // Practical typically has same word count as practiceB
  const extraWordsNeeded = bWords.length - pWords.length;
  
  if (extraWordsNeeded > 0 && extraWordsNeeded <= 10) {
    // Get the ending from practiceB
    const bEnding = bWords.slice(pWords.length).join(' ');
    
    // Check if this ending makes grammatical sense to append
    // Adapt the ending for the practical version
    // Simple heuristic: just append the practiceB ending pattern
    const newAnswer = truncatedAnswer + ' ' + bEnding;
    const newLine = answerLine.replace(truncatedAnswer, newAnswer);
    
    pLines[target.line - 1] = newLine;
    totalFixed++;
    console.log(`  Unit ${target.unit} Q${qNum}: "${truncatedAnswer.substring(0, 40)}..." + "${bEnding}"`);
  } else {
    console.log(`  Unit ${target.unit} Q${qNum}: SKIP (extraWords=${extraWordsNeeded})`);
  }
  
  data.stages.practical = pLines.join('\n');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

console.log(`\n총 ${totalFixed}건 수정`);

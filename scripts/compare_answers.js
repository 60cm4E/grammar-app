const fs = require('fs');
const path = require('path');

const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');
const scanResults = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scan_results.json'), 'utf-8'));

// Focus on practical stage, TRUNCATED_END type, units 100-146
const targets = scanResults
  .filter(x => x.stage === 'practical' && parseInt(x.unit) >= 100 && parseInt(x.unit) <= 146)
  .map(x => ({
    ...x,
    issues: x.issues.filter(i => i.type === 'TRUNCATED_END' && i.content.length > 20)
  }))
  .filter(x => x.issues.length > 0);

console.log(`Processing ${targets.length} units with truncated answers...\n`);

let totalFixed = 0;
let totalManual = 0;
const manualReview = [];

for (const target of targets) {
  const filePath = path.join(UNITS_DIR, `${target.unit}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  const practicalLines = data.stages.practical.split('\n');
  const practiceBLines = (data.stages.practiceB || '').split('\n');
  
  let modified = false;
  
  for (const issue of target.issues) {
    const lineIdx = issue.line - 1;
    const truncatedLine = practicalLines[lineIdx];
    
    if (!truncatedLine) continue;
    
    // Extract the truncated answer text
    const answerMatch = truncatedLine.match(/정답[:]?\s*(.*)/);
    if (!answerMatch) continue;
    
    const truncatedAnswer = answerMatch[1].trim();
    
    // Try to find matching answer in practiceB
    // Strategy: find the same question number and look at its answer
    
    // Get the question number from nearby lines
    let questionNum = null;
    for (let i = lineIdx; i >= Math.max(0, lineIdx - 10); i--) {
      const qMatch = practicalLines[i].match(/\*\*(\d{2})\.\*\*/);
      if (qMatch) {
        questionNum = qMatch[1];
        break;
      }
    }
    
    if (!questionNum) {
      manualReview.push({ unit: target.unit, line: issue.line, reason: 'No question number found', content: truncatedAnswer });
      totalManual++;
      continue;
    }
    
    // Find corresponding answer in practiceB
    let practiceBAnswer = null;
    for (let i = 0; i < practiceBLines.length; i++) {
      if (practiceBLines[i].includes(`**${questionNum}.**`)) {
        // Look for the answer line
        for (let j = i + 1; j < Math.min(practiceBLines.length, i + 20); j++) {
          if (practiceBLines[j].includes('정답')) {
            // Get full answer (might span multiple lines)
            let fullAnswer = practiceBLines[j];
            // Check if next lines are continuation (not a new question or divider)
            for (let k = j + 1; k < Math.min(practiceBLines.length, j + 5); k++) {
              if (practiceBLines[k].match(/^(---|\*\*\d|#|$)/) || practiceBLines[k].includes('정답')) break;
              if (practiceBLines[k].trim()) {
                fullAnswer += '\n' + practiceBLines[k];
              }
            }
            practiceBAnswer = fullAnswer;
            break;
          }
        }
        break;
      }
    }
    
    if (practiceBAnswer) {
      // Extract just the answer text from practiceB
      const bMatch = practiceBAnswer.match(/정답[*]*\s*(.*)/s);
      if (bMatch) {
        const fullBAnswer = bMatch[1].trim();
        
        // Check if practiceB answer is longer / more complete
        if (fullBAnswer.length > truncatedAnswer.length) {
          // The practical answer is likely a modified version (different nouns/verbs)
          // So we can't just copy - log for manual review
          manualReview.push({
            unit: target.unit,
            questionNum,
            line: issue.line,
            truncated: truncatedAnswer.substring(0, 80),
            practiceBRef: fullBAnswer.substring(0, 80),
            reason: 'Needs manual comparison - practical uses different words than practiceB'
          });
          totalManual++;
        } else {
          manualReview.push({
            unit: target.unit,
            questionNum,
            line: issue.line,
            truncated: truncatedAnswer.substring(0, 80),
            practiceBRef: fullBAnswer.substring(0, 80),
            reason: 'PracticeB answer similar length - may not be truncated'
          });
          totalManual++;
        }
      }
    } else {
      manualReview.push({
        unit: target.unit,
        questionNum,
        line: issue.line,
        reason: 'No matching practiceB answer found',
        content: truncatedAnswer.substring(0, 80)
      });
      totalManual++;
    }
  }
}

console.log(`\n=== MANUAL REVIEW NEEDED: ${totalManual}건 ===\n`);
manualReview.forEach(r => {
  console.log(`Unit ${r.unit} Q${r.questionNum || '?'} (L${r.line})`);
  console.log(`  Reason: ${r.reason}`);
  if (r.truncated) console.log(`  Truncated: ${r.truncated}`);
  if (r.practiceBRef) console.log(`  PracticeB: ${r.practiceBRef}`);
  if (r.content) console.log(`  Content: ${r.content}`);
  console.log('');
});

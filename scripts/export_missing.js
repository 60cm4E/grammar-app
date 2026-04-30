const fs = require('fs');
const path = require('path');
const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');
const OUTPUT_DIR = path.join(__dirname, '누락문제');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const units = ['007', '059', '095', '109', '115', '127', '131'];

for (const unitNum of units) {
  const data = JSON.parse(fs.readFileSync(path.join(UNITS_DIR, unitNum + '.json'), 'utf-8'));
  const practical = data.stages.practical;
  const practiceB = data.stages.practiceB || '';

  // Find missing questions
  const qNums = [];
  practical.split('\n').forEach(l => {
    const m = l.match(/\*\*(\d{2})\.\*\*/);
    if (m) qNums.push(parseInt(m[1]));
  });
  const maxQ = Math.max(...qNums);
  const missing = [];
  for (let q = 1; q <= maxQ; q++) {
    if (!qNums.includes(q)) missing.push(q);
  }

  // Also extract the corresponding practiceB questions for reference
  let practiceBRef = '';
  for (const mq of missing) {
    const mqStr = String(mq).padStart(2, '0');
    const bLines = practiceB.split('\n');
    let found = false;
    for (let i = 0; i < bLines.length; i++) {
      if (bLines[i].includes('**' + mqStr + '.**')) {
        practiceBRef += '\n### 연습문제B Q' + mqStr + ' (참조용)\n\n';
        // Extract until next question or end
        for (let j = i; j < bLines.length; j++) {
          if (j > i && bLines[j].match(/\*\*\d{2}\.\*\*/)) break;
          practiceBRef += bLines[j] + '\n';
        }
        found = true;
        break;
      }
    }
    if (!found) {
      practiceBRef += '\n### 연습문제B Q' + mqStr + ' — 해당 번호 없음\n\n';
    }
  }

  let md = '# Unit ' + unitNum + ': ' + data.title + ' - 실전문제\n\n';
  md += '> **누락 문제:** ' + missing.map(q => 'Q' + String(q).padStart(2, '0')).join(', ') + '\n';
  md += '> **현재 문제 수:** ' + qNums.length + '/' + maxQ + '\n\n';
  md += '---\n\n';

  // Add practiceB reference for missing questions
  md += '## 📌 누락 문제에 대응하는 연습문제B (참조)\n\n';
  md += practiceBRef + '\n';
  md += '---\n\n';

  md += '## 📋 현재 실전문제 전체\n\n';
  md += practical;

  const safeName = data.title.replace(/[\/\\:*?"<>|+.]/g, '_');
  const filePath = path.join(OUTPUT_DIR, unitNum + '_' + safeName + '.md');
  fs.writeFileSync(filePath, md, 'utf-8');
  console.log('Created: ' + path.basename(filePath));
}

console.log('\nDone! Output: ' + OUTPUT_DIR);

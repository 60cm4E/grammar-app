const fs = require('fs');

// Unit 126
const d126 = JSON.parse(fs.readFileSync('public/data/units/126.json', 'utf-8'));
let c126 = d126.stages.concept;
const idx126 = c126.indexOf('\uC548\uC694. 2\uBC88\uACFC 3\uBC88\uC740');
if (idx126 >= 0) {
  // 해당 줄 찾기
  const lines = c126.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('\uC548\uC694. 2\uBC88\uACFC 3\uBC88') && lines[i].length > 120) {
      // 이고, 뒤에서 분리
      const splitPoint = lines[i].indexOf('\uC774\uACE0,') + 3;
      lines[i] = lines[i].substring(0, splitPoint).trim() + '\n' + lines[i].substring(splitPoint).trim();
      console.log('126 fixed');
      break;
    }
  }
  d126.stages.concept = lines.join('\n');
  fs.writeFileSync('public/data/units/126.json', JSON.stringify(d126, null, 2), 'utf-8');
}

// Unit 162
const d162 = JSON.parse(fs.readFileSync('public/data/units/162.json', 'utf-8'));
let c162 = d162.stages.concept;
const lines162 = c162.split('\n');
for (let i = 0; i < lines162.length; i++) {
  if (lines162[i].includes('in the library') && lines162[i].length > 120) {
    // "넣어서" 뒤에서 분리
    const sp = lines162[i].indexOf('\uB123\uC5B4\uC11C') + 4;
    lines162[i] = lines162[i].substring(0, sp).trim() + '\n' + lines162[i].substring(sp).trim();
    console.log('162 fixed');
    break;
  }
}
d162.stages.concept = lines162.join('\n');
fs.writeFileSync('public/data/units/162.json', JSON.stringify(d162, null, 2), 'utf-8');

// 최종 통계
let remaining = 0;
for (let i = 1; i <= 164; i++) {
  const u = String(i).padStart(3, '0');
  const d = JSON.parse(fs.readFileSync('public/data/units/' + u + '.json', 'utf-8'));
  for (const [k, c] of Object.entries(d.stages || {})) {
    if (!c) continue;
    c.split('\n').forEach(l => { if (l.length > 120) remaining++; });
  }
}
console.log('최종 남은 긴 줄:', remaining, '건 (Unit 026 지문 정답 2건 포함)');

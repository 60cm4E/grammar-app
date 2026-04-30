const fs = require('fs');
const path = require('path');
const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');

// Unit 057: Fix trailing " ." in answer
let d = JSON.parse(fs.readFileSync(path.join(UNITS_DIR, '057.json'), 'utf-8'));
let lines = d.stages.practiceB.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('정답') && lines[i].includes('go there .')) {
    lines[i] = lines[i].replace('go there .', 'go there.');
    console.log('057 L' + (i+1) + ': fixed');
  }
}
d.stages.practiceB = lines.join('\n');
fs.writeFileSync(path.join(UNITS_DIR, '057.json'), JSON.stringify(d, null, 2), 'utf-8');

// Unit 105: Fix trailing " ." in answers
d = JSON.parse(fs.readFileSync(path.join(UNITS_DIR, '105.json'), 'utf-8'));
for (const stage of ['practiceB', 'practical']) {
  lines = d.stages[stage].split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('정답') && /me \.$/.test(lines[i].trim())) {
      lines[i] = lines[i].replace(/me \.$/, 'me.');
      console.log('105 [' + stage + '] L' + (i+1) + ': fixed');
    }
  }
  d.stages[stage] = lines.join('\n');
}
fs.writeFileSync(path.join(UNITS_DIR, '105.json'), JSON.stringify(d, null, 2), 'utf-8');

console.log('Done');

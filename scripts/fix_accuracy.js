const fs = require('fs');
const path = require('path');
const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');

// Fix Unit 160: quotes
let d = JSON.parse(fs.readFileSync(path.join(UNITS_DIR, '160.json'), 'utf-8'));
const lines = d.stages.practical.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('정답') && lines[i].includes('What did you do in summer last')) {
    lines[i] = lines[i].replace('What did you do in summer last', 'What did you do in summer last year?"');
    console.log('Fixed L' + (i+1));
  }
  if (lines[i].includes('정답') && lines[i].includes('Did you visit my house last')) {
    lines[i] = lines[i].replace('Did you visit my house last', 'Did you visit my house last week?"');
    console.log('Fixed L' + (i+1));
  }
}
d.stages.practical = lines.join('\n');
fs.writeFileSync(path.join(UNITS_DIR, '160.json'), JSON.stringify(d, null, 2), 'utf-8');

// Fix Unit 043: INSTRUCTION_IN_ANSWER
d = JSON.parse(fs.readFileSync(path.join(UNITS_DIR, '043.json'), 'utf-8'));
const bLines = d.stages.practiceB.split('\n');
console.log('\nUnit 043 context:');
for (let i = 66; i < 74; i++) console.log('L' + (i+1) + ': ' + bLines[i]);

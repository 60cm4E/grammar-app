const fs = require('fs');
const path = require('path');
const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');

// Critical fixes: Double words (merge artifacts)
const fixes = [
  {unit:'152', stage:'practical', search:'when when he was young', replace:'when he was young'},
  {unit:'154', stage:'practical', search:'would have been been a boring', replace:'would have been a boring'},
  {unit:'155', stage:'practical', search:'would have been been an IT', replace:'would have been an IT'},
  // Space-period fixes
  {unit:'029', stage:'practiceB', search:'black ones .', replace:'black ones.'},
  {unit:'057', stage:'practiceB', search:'go there .', replace:'go there.'},
  {unit:'083', stage:'practiceB', search:'alone. .,', replace:'alone.,'},
  {unit:'083', stage:'practical', search:'alone. .,', replace:'alone.,'},
  {unit:'105', stage:'practiceB', search:'dish me .', replace:'dish me.'},
  {unit:'105', stage:'practical', search:'meal me .', replace:'meal me.'},
];

let fixed = 0;
for (const fix of fixes) {
  const filePath = path.join(UNITS_DIR, fix.unit + '.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const orig = data.stages[fix.stage];
  data.stages[fix.stage] = orig.replace(fix.search, fix.replace);
  if (data.stages[fix.stage] !== orig) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    fixed++;
    console.log('Unit ' + fix.unit + ' [' + fix.stage + ']: "' + fix.search + '" → fixed');
  } else {
    console.log('Unit ' + fix.unit + ': NOT FOUND');
  }
}

// Fix space before comma: " ," → "," for units 035,037,069,103,106,108
const commaFixes = ['019','035','037','069','103','106','108'];
for (const unit of commaFixes) {
  const filePath = path.join(UNITS_DIR, unit + '.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let fileFixed = false;
  for (const stageKey of Object.keys(data.stages || {})) {
    if (!data.stages[stageKey]) continue;
    const lines = data.stages[stageKey].split('\n');
    let stageFixed = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('정답') && lines[i].includes(' ,')) {
        lines[i] = lines[i].replace(/ ,/g, ',');
        stageFixed = true;
        fixed++;
      }
    }
    if (stageFixed) {
      data.stages[stageKey] = lines.join('\n');
      fileFixed = true;
    }
  }
  if (fileFixed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Unit ' + unit + ': space-comma fixed');
  }
}

console.log('\n총 ' + fixed + '건 수정');

const fs = require('fs');
const path = require('path');
const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');

// Fix mismatched parentheses in answers - add closing paren by looking at next line
const fixes = [
  {unit:'077', stage:'descriptive', search:'the boy never watering the plants (the boy never to', replace:'the boy never watering the plants (the boy never to water the plants)'},
  {unit:'081', stage:'descriptive', search:'He waved his hand until the train started. (Until the', replace:'He waved his hand until the train started. (Until the train started, he waved his hand.)'},
  {unit:'082', stage:'descriptive', search:'I set a goal since I wanted to succeed. (Since I', replace:'I set a goal since I wanted to succeed. (Since I wanted to succeed, I set a goal.)'},
  {unit:'114', stage:'practical', search:'more than, as kind as, all the other students (any', replace:'more than, as kind as, all the other students (any other student)'},
  {unit:'124', stage:'descriptive', search:'whom they wanted to interview (who they wanted to', replace:'whom they wanted to interview (who they wanted to interview)'},
  {unit:'142', stage:'descriptive', search:'he listened to the bird song (he was listening to the', replace:'he listened to the bird song (he was listening to the bird song)'},
  {unit:'144', stage:'descriptive', search:'Not learning how to write (Never learning how to', replace:'Not learning how to write (Never learning how to write)'},
  {unit:'151', stage:'descriptive', search:"doesn't know the answer (does not know the", replace:"doesn't know the answer (does not know the answer)"},
  {unit:'159', stage:'descriptive', search:'told, that they had to leave that day (they had to', replace:'told, that they had to leave that day (they had to leave that day)'},
  {unit:'162', stage:'descriptive', search:'It was in 1971 that he was born. (It was in 1971 when', replace:'It was in 1971 that he was born. (It was in 1971 when he was born.)'},
  {unit:'162', stage:'descriptive', search:'It is a new car that she is going to buy next week. (It', replace:'It is a new car that she is going to buy next week. (It is a new car she is going to buy next week.)'},
  {unit:'162', stage:'descriptive', search:'It was Tom that called you five times yesterday. (It', replace:'It was Tom that called you five times yesterday. (It was Tom who called you five times yesterday.)'},
];

let fixed = 0;
for (const fix of fixes) {
  const filePath = path.join(UNITS_DIR, fix.unit + '.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const lines = data.stages[fix.stage].split('\n');
  let found = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(fix.search)) {
      lines[i] = lines[i].replace(fix.search, fix.replace);
      found = true;
      fixed++;
      console.log('Unit ' + fix.unit + ' L' + (i+1) + ': OK');
      break;
    }
  }
  if (!found) console.log('Unit ' + fix.unit + ': NOT FOUND');
  data.stages[fix.stage] = lines.join('\n');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

console.log('\n총 ' + fixed + '건 수정');

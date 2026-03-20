const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'C:\\Users\\chenc\\Downloads\\클카\\업로드만';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'data');
const UNITS_DIR = path.join(OUTPUT_DIR, 'units');

const STAGES = [
  { folder: '1 개념톡', key: 'concept', label: '개념톡' },
  { folder: '2 연습문제A', key: 'practiceA', label: '연습문제A' },
  { folder: '3 연습문제B', key: 'practiceB', label: '연습문제B' },
  { folder: '4 서술형문제', key: 'descriptive', label: '서술형문제' },
  { folder: '5 실전문제', key: 'practical', label: '실전문제' },
];

// Extract unit number from filename
function getUnitNumber(filename) {
  const match = filename.match(/Unit\s+(\d{3})/);
  return match ? match[1] : null;
}

// Extract unit title from filename (between unit number and stage name)
function getUnitTitle(filename, stageLabel) {
  // Remove "Unit XXX " prefix
  let title = filename.replace(/Unit\s+\d{3}\s+/, '');
  // Remove file extension
  title = title.replace(/\.md$/, '');
  // Remove stage label suffix and common suffixes
  title = title.replace(/\s*(개념톡|연습문제[AB]|서술형문제|변형문제).*$/, '');
  // Remove trailing markers like 중1 (중등)
  title = title.replace(/\s*중\d+\s*(\(중등\))?\s*$/, '');
  return title.trim();
}

function main() {
  // Ensure output dirs exist
  if (!fs.existsSync(UNITS_DIR)) {
    fs.mkdirSync(UNITS_DIR, { recursive: true });
  }

  // Build unit map: unitNumber -> { title, stages }
  const unitMap = {};

  for (const stage of STAGES) {
    const folderPath = path.join(SOURCE_DIR, stage.folder);
    if (!fs.existsSync(folderPath)) {
      console.warn(`Folder not found: ${folderPath}`);
      continue;
    }

    const files = fs.readdirSync(folderPath)
      .filter(f => f.endsWith('.md'))
      .sort();

    for (const file of files) {
      const unitNum = getUnitNumber(file);
      if (!unitNum) continue;

      const content = fs.readFileSync(path.join(folderPath, file), 'utf-8');

      if (!unitMap[unitNum]) {
        // Extract title from the first stage we encounter
        const title = getUnitTitle(file, stage.label);
        unitMap[unitNum] = {
          id: unitNum,
          title: title,
          stages: {}
        };
      }

      // If we haven't set a title yet or it's from concept (the primary one)
      if (stage.key === 'concept') {
        const title = getUnitTitle(file, stage.label);
        if (title) unitMap[unitNum].title = title;
      }

      unitMap[unitNum].stages[stage.key] = content;
    }
  }

  // Sort by unit number
  const sortedUnits = Object.keys(unitMap).sort().map(k => unitMap[k]);

  // Write individual unit files
  for (const unit of sortedUnits) {
    const unitFile = path.join(UNITS_DIR, `${unit.id}.json`);
    fs.writeFileSync(unitFile, JSON.stringify(unit, null, 2), 'utf-8');
  }

  // Write units index (without full content)
  const index = sortedUnits.map(u => ({
    id: u.id,
    title: u.title,
    stagesAvailable: Object.keys(u.stages)
  }));

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'units.json'),
    JSON.stringify(index, null, 2),
    'utf-8'
  );

  console.log(`✅ Converted ${sortedUnits.length} units`);
  console.log(`   Index: ${path.join(OUTPUT_DIR, 'units.json')}`);
  console.log(`   Units: ${UNITS_DIR}`);
}

main();

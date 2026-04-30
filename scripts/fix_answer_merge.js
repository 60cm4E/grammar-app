const fs = require('fs');
const path = require('path');

const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');

let totalFixed = 0;
let filesModified = 0;

for (let i = 1; i <= 164; i++) {
  const unitNum = String(i).padStart(3, '0');
  const filePath = path.join(UNITS_DIR, `${unitNum}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  let modified = false;

  for (const stageKey of Object.keys(data.stages || {})) {
    let content = data.stages[stageKey];
    if (!content) continue;

    const origContent = content;
    const lines = content.split('\n');
    const newLines = [];

    for (let j = 0; j < lines.length; j++) {
      const line = lines[j];

      // Check if this is an answer line that continues onto next line(s)
      // Pattern: "> **정답** text..." or "> 정답: text..." or "> 정답 text..."
      const isAnswerLine = /^>\s*\*?\*?정답\*?\*?\s*:?\s*.+/.test(line);

      if (isAnswerLine) {
        // Check if answer seems truncated (ends with article/preposition etc.)
        // AND next line is a continuation (not empty, not ---, not a new question)
        let fullAnswer = line;
        let k = j + 1;

        while (k < lines.length) {
          const nextLine = lines[k].trim();

          // Stop conditions: empty line, divider, new question, another answer
          if (!nextLine || nextLine === '---' || nextLine.startsWith('**') ||
              nextLine.startsWith('>') || nextLine.startsWith('#')) {
            break;
          }

          // This looks like a continuation of the answer
          // Check: is it text that doesn't start with a question pattern?
          if (/^[A-Za-z가-힣\d(]/.test(nextLine)) {
            fullAnswer += ' ' + nextLine;
            k++;
            totalFixed++;
          } else {
            break;
          }
        }

        if (k > j + 1) {
          // We merged lines - push the merged answer and skip consumed lines
          newLines.push(fullAnswer);
          j = k - 1; // will be incremented by for loop
          modified = true;
        } else {
          newLines.push(line);
        }
      } else {
        newLines.push(line);
      }
    }

    content = newLines.join('\n');
    if (content !== origContent) {
      data.stages[stageKey] = content;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    filesModified++;
  }
}

console.log(`정답 줄 병합: ${totalFixed}건, ${filesModified}개 파일 수정`);

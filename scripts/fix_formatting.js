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
  
  // Only process practical stage
  const stageKey = 'practical';
  let content = data.stages[stageKey];
  if (!content) continue;
  
  const origContent = content;
  const lines = content.split('\n');
  const newLines = [];
  
  for (let j = 0; j < lines.length; j++) {
    const line = lines[j];
    
    // Skip short lines (no formatting needed)
    if (line.length <= 100) {
      newLines.push(line);
      continue;
    }
    
    // Check if next line is an answer line (정답)
    let nextIsAnswer = false;
    for (let k = j + 1; k < Math.min(lines.length, j + 3); k++) {
      if (lines[k].includes('정답')) {
        nextIsAnswer = true;
        break;
      }
    }
    
    if (!nextIsAnswer) {
      newLines.push(line);
      continue;
    }
    
    // This is a choice line that needs splitting
    // Strategy: Find the main question/sentence part, then split choices
    
    // Pattern 1: "틀린 부분" type questions - words with double spaces
    // e.g., "He  has  already  read... 틀린 부분만 고쳐 쓰세요."
    if (line.includes('틀린 부분만 고쳐') || line.includes('틀린 부분을')) {
      // Split at "틀린" keeping everything before on separate line
      const splitIdx = line.indexOf('틀린');
      if (splitIdx > 0) {
        const wordPart = line.substring(0, splitIdx).trimEnd();
        const instructPart = line.substring(splitIdx);
        newLines.push(wordPart);
        newLines.push(instructPart);
        totalFixed++;
        modified = true;
        continue;
      }
    }
    
    // Pattern 2: Sentence + multiple choice answers
    // Find the answer in the next answer line to help identify where choices start
    let answerText = '';
    for (let k = j + 1; k < Math.min(lines.length, j + 3); k++) {
      if (lines[k].includes('정답')) {
        const match = lines[k].match(/정답[:]?\s*(.*)/);
        if (match) answerText = match[1].trim();
        break;
      }
    }
    
    // Try to find where the question ends and choices begin
    // Look for period/question mark followed by answer text starting
    
    // Strategy: Find the answer text within the line, then split around it
    // The answer is one of several choices that are space-separated
    
    if (answerText) {
      // Find position of the answer in the line  
      const answerIdx = line.indexOf(answerText);
      
      if (answerIdx > 0) {
        // Find the sentence/question boundary before the choices
        // Look backwards from answer position for a period, question mark, etc.
        let sentenceEnd = -1;
        
        // Check for common patterns: 
        // "문장. choice1 choice2 choice3 choice4"
        // Need to find where the main text ends
        
        // Look for the last sentence-ending punctuation before the first choice
        // First, find where all the choices roughly start
        // The choices are typically the last N words/phrases before the answer line
        
        // Simple approach: find the first occurrence of a choice word that matches
        // the beginning of a choice sequence
        
        // Alternative: split by looking at the question prefix pattern
        const questionLine = line;
        
        // Check if line starts with a question sentence (has period/question mark)
        // then followed by choices
        
        // Find all periods and question marks
        const punctuations = [];
        for (let p = 0; p < questionLine.length; p++) {
          if (questionLine[p] === '.' || questionLine[p] === '?') {
            // Skip if it's part of a decimal or abbreviation
            if (questionLine[p] === '.' && p > 0 && /\d/.test(questionLine[p-1]) && p < questionLine.length - 1 && /\d/.test(questionLine[p+1])) continue;
            punctuations.push(p);
          }
        }
        
        if (punctuations.length > 0) {
          // The last meaningful period before the answer text is likely the sentence boundary
          // Try to find a period that divides the line into roughly: question + choices
          
          let bestSplit = -1;
          for (const pIdx of punctuations) {
            // Check if the text after this period contains the answer
            const afterPeriod = questionLine.substring(pIdx + 1).trim();
            if (afterPeriod.includes(answerText.split(',')[0].trim().split('.')[0].trim().substring(0, 20))) {
              bestSplit = pIdx + 1;
              break;
            }
          }
          
          if (bestSplit > 0 && bestSplit < questionLine.length - 10) {
            const questionPart = questionLine.substring(0, bestSplit).trimEnd();
            const choicesPart = questionLine.substring(bestSplit).trim();
            
            // Now try to split the choices part into individual choices
            // Choices are typically complete phrases/sentences
            // Try splitting by common patterns
            
            // Strategy: look for the answer and count rough choice count
            // Most questions have 4 choices
            
            // Simple approach: just separate question from choices on different lines
            newLines.push(questionPart);
            newLines.push(choicesPart);
            totalFixed++;
            modified = true;
            continue;
          }
        }
        
        // Fallback: try to find choice boundary by looking for Korean text mixed with English
        // or multiple sentence patterns
      }
    }
    
    // If we couldn't process it, keep as is
    newLines.push(line);
  }
  
  content = newLines.join('\n');
  
  if (content !== origContent) {
    data.stages[stageKey] = content;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    filesModified++;
  }
}

console.log(`포맷팅 수정: ${totalFixed}건, ${filesModified}개 파일`);

// Re-count long lines
let remaining = 0;
for (let i = 1; i <= 164; i++) {
  const unitNum = String(i).padStart(3, '0');
  const filePath = path.join(UNITS_DIR, `${unitNum}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const p = data.stages.practical;
  if (!p) continue;
  p.split('\n').forEach(l => { if (l.length > 120) remaining++; });
}
console.log(`남은 긴 줄 (>120자): ${remaining}건`);

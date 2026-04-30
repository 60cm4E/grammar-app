const fs = require('fs');
const path = require('path');

const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');

// Fix strategy: Find the exact answer line (> 정답:) and append the missing part
// Format: { unitNum: [{ answerContains: "partial text to find in answer line", appendText: "text to append" }] }

const fixes = {
  '103': [
    { answerContains: 'Hurry up! You are always so slowly., The boys are\n', appendText: ' playing happy in the park.' },
  ],
  '105': [
    { answerContains: 'The boy told a funny story me., Amy wrote a\n', appendText: ' letter her friend.' },
    { answerContains: 'I usually walk to school., She is writing her\n', appendText: ' homework.' },
  ],
  '106': [
    { answerContains: 'My parents got me a new laptop. → My parents got a\n', appendText: ' new laptop for me.' },
    { answerContains: 'Amy made a cookie for him., Amy made him a\n', appendText: ' cookie.' },
  ],
  '108': [
    { answerContains: 'I saw them run on the field., I saw them running on\n', appendText: ' the field.' },
  ],
  '110': [
    { answerContains: '정답: The tomato soup was much more delicious than\n', appendText: ' we thought.' },
    { answerContains: '정답: Famous novels are entertaining than those of\n', appendText: ' unknown writers.' },
  ],
  '112': [
    { answerContains: 'The camera was three times more expensive than I\n', appendText: ' expected.' },
  ],
  '113': [
    { answerContains: 'The story gets more exciting and more\n', appendText: ' exciting.' },
  ],
  '114': [
    { answerContains: "Amy's painting was more colorful than anyone else's at\n", appendText: ' the exhibition.' },
    { answerContains: 'To students, nothing is as important as studying in\n', appendText: ' the library.' },
    { answerContains: 'Tom is as athletic than any other kid in the\n', appendText: ' school.' },
  ],
  '118': [
    { answerContains: 'was given, was congratulated, were handed to\n', appendText: ' him' },
  ],
  '119': [
    { answerContains: 'was given, was praised, were handed to\n', appendText: ' her' },
  ],
  '120': [
    { answerContains: 'Tom was encouraged to learn Korean by the\n', appendText: ' teacher.' },
  ],
  '121': [
    { answerContains: 'I am made to study in the library., They were\n', appendText: ' made to clean the classroom.' },
    { answerContains: 'Amy was heard singing a song by him., Amy was\n', appendText: ' heard to sing a song by him.' },
  ],
  '122': [
    { answerContains: 'It is thought that the author is talented., The author is\n', appendText: ' thought to be talented.' },
    { answerContains: 'It is said to the girl is a dancer., The moon is\n', appendText: ' believed that is round.' },
    { answerContains: 'Watching screens in the dark is thought to make the\n', appendText: ' eyes bad.' },
    { answerContains: 'It is supposed that she is innocent., She is supposed to\n', appendText: ' be innocent.' },
  ],
  '123': [
    { answerContains: "I accidentally met Ms. Smith who is Tom's mother on\n", appendText: ' the street.' },
    { answerContains: 'Amy often reads the magazine which has more\n', appendText: ' than 500 articles.' },
  ],
  '124': [
    { answerContains: 'The photos which the girl posted on the blog got a\n', appendText: ' lot of likes.' },
    { answerContains: 'Tom has enough pencils whom he can lend to his\n', appendText: ' friends.' },
    { answerContains: 'Tom lost his pen which he got it on his\n', appendText: ' birthday.' },
  ],
  '125': [
    { answerContains: 'The student whom is absent has to call the\n', appendText: ' teacher.' },
    { answerContains: 'The bag _______ I gave to Amy was too small for\n', appendText: ' me.' },
  ],
  '127': [
    { answerContains: 'The girl ________________ diary is beautiful is the\n', appendText: ' smartest girl.' },
  ],
  '128': [
    { answerContains: 'Amy searched for something that could give her a\n', appendText: ' better idea.' },
    { answerContains: 'I went to a café Amy recommended., I went to\n', appendText: ' a café that Amy recommended.' },
  ],
  '129': [
    { answerContains: 'I showed Tom the things which were in my\n', appendText: ' pocket., I showed Tom what was in my pocket.' },
  ],
  '130': [
    { answerContains: "Tom couldn't understand the thing that she was\n", appendText: ' trying to say., Tom couldn\'t understand what she was trying to say.' },
  ],
  '131': [
    { answerContains: 'The shirt she is wearing is very colorful., Look at the\n', appendText: ' children singing on the stage.' },
  ],
  '132': [
    { answerContains: 'Amy passed the final exam, that surprised her\n', appendText: ' family.' },
  ],
  '133': [
    { answerContains: 'Before it is too late, we need to protect the ocean on\n', appendText: ' which we depend.' },
  ],
  '135': [
    { answerContains: "She'll go to the park in where I went to\n", appendText: ' yesterday.' },
    { answerContains: 'This is the school in which he studies., This is the\n', appendText: ' school which he studies in.' },
    { answerContains: 'I remember the morning when I met my best friend on\n', appendText: ' that day.' },
  ],
  '136': [
    { answerContains: 'He is learning the way she edits the photo., He is\n', appendText: ' learning how she edits the photo.' },
  ],
  '137': [
    { answerContains: 'I remember the day the festival was held., I\n', appendText: ' remember when the festival was held.' },
    { answerContains: "The boy can't forget the moment he saw the\n", appendText: ' rainbow., The boy can\'t forget when he saw the rainbow.' },
  ],
  '138': [
    { answerContains: 'Whenever I went camping, it always rained., It\n', appendText: ' always rained at any time when I went camping.' },
  ],
  '141': [
    { answerContains: "It's embarrassed when I have to ask people for\n", appendText: ' money.' },
  ],
  '142': [
    { answerContains: "As they didn't have anything to eat, they sat quietly at\n", appendText: ' the table.' },
  ],
  '146': [
    { answerContains: "When Amy needed help, her mother's encouragement was a\n", appendText: ' huge help.' },
  ],
};

let totalFixed = 0;
const errors = [];

for (const [unitNum, unitFixes] of Object.entries(fixes)) {
  const filePath = path.join(UNITS_DIR, `${unitNum}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  let practical = data.stages.practical;
  let fixedInUnit = 0;
  
  for (const fix of unitFixes) {
    // Find the truncated part and replace it with the appended version
    const searchStr = fix.answerContains;
    const idx = practical.indexOf(searchStr);
    
    if (idx !== -1) {
      // Replace: remove the trailing \n and append the missing text, then add \n back
      const before = practical.substring(0, idx);
      const after = practical.substring(idx + searchStr.length);
      practical = before + searchStr.trimEnd() + fix.appendText + '\n' + after;
      fixedInUnit++;
      totalFixed++;
    } else {
      // Maybe already fixed in first pass? Check if the full text exists
      const fullText = fix.answerContains.trimEnd() + fix.appendText;
      if (practical.includes(fullText)) {
        console.log(`  ⏭ Unit ${unitNum}: Already fixed - "${fullText.substring(0, 50)}..."`);
      } else {
        errors.push(`Unit ${unitNum}: Not found: "${fix.answerContains.substring(0, 50).trim()}..."`);
      }
    }
  }
  
  if (fixedInUnit > 0) {
    data.stages.practical = practical;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Unit ${unitNum}: ${fixedInUnit}건 수정`);
  }
}

console.log(`\n총 ${totalFixed}건 수정 완료`);

if (errors.length > 0) {
  console.log(`\n⚠️ ${errors.length}건 매치 실패:`);
  errors.forEach(e => console.log('  ' + e));
}

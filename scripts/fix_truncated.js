const fs = require('fs');
const path = require('path');

const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');

// Each fix is manually determined by comparing practical truncated answer with practiceB full answer
// The practical version changes some nouns/names but keeps the same sentence structure

const fixes = {
  '103': [
    { line: 108, find: 'Hurry up! You are always so slowly., The boys are', replace: 'Hurry up! You are always so slowly., The boys are playing happy in the park.' },
  ],
  '105': [
    { line: 44, find: 'The boy told a funny story me., Amy wrote a', replace: 'The boy told a funny story me., Amy wrote a letter her friend.' },
    { line: 150, find: 'I usually walk to school., She is writing her', replace: 'I usually walk to school., She is writing her homework.' },
  ],
  '106': [
    { line: 78, find: "My parents got me a new laptop. → My parents got a", replace: "My parents got me a new laptop. → My parents got a new laptop for me." },
    { line: 135, find: "Amy made a cookie for him., Amy made him a", replace: "Amy made a cookie for him., Amy made him a cookie." },
  ],
  '108': [
    { line: 86, find: "I saw them run on the field., I saw them running on", replace: "I saw them run on the field., I saw them running on the field." },
  ],
  '110': [
    { line: 60, find: "The tomato soup was much more delicious than", replace: "The tomato soup was much more delicious than we thought." },
    { line: 89, find: "Famous novels are entertaining than those of", replace: "Famous novels are entertaining than those of unknown writers." },
  ],
  '112': [
    { line: 48, find: "The camera was three times more expensive than I", replace: "The camera was three times more expensive than I expected." },
  ],
  '113': [
    { line: 85, find: "The story gets more exciting and more", replace: "The story gets more exciting and more exciting." },
  ],
  '114': [
    { line: 86, find: "Amy's painting was more colorful than anyone else's at", replace: "Amy's painting was more colorful than anyone else's at the exhibition." },
    { line: 106, find: "To students, nothing is as important as studying in", replace: "To students, nothing is as important as studying in the library." },
    { line: 124, find: "Tom is as athletic than any other kid in the", replace: "Tom is as athletic than any other kid in the school." },
    { line: 172, find: "the most difficult, as hard as, worse than, better, the", replace: "the most difficult, as hard as, worse than, better, the best" },
  ],
  '120': [
    { line: 135, find: "Tom was encouraged to learn Korean by the", replace: "Tom was encouraged to learn Korean by the teacher." },
  ],
  '121': [
    { line: 72, find: "I am made to study in the library., They were", replace: "I am made to study in the library., They were made to clean the classroom." },
    { line: 121, find: "Amy was heard singing a song by him., Amy was", replace: "Amy was heard singing a song by him., Amy was heard to sing a song by him." },
  ],
  '122': [
    { line: 34, find: "It is thought that the author is talented., The author is", replace: "It is thought that the author is talented., The author is thought to be talented." },
    { line: 55, find: "It is said to the girl is a dancer., The moon is", replace: "It is said to the girl is a dancer., The moon is believed that is round." },
    { line: 106, find: "Watching screens in the dark is thought to make the", replace: "Watching screens in the dark is thought to make the eyes bad." },
    { line: 117, find: "It is supposed that she is innocent., She is supposed to", replace: "It is supposed that she is innocent., She is supposed to be innocent." },
  ],
  '123': [
    { line: 55, find: "I accidentally met Ms. Smith who is Tom's mother on", replace: "I accidentally met Ms. Smith who is Tom's mother on the street." },
    { line: 104, find: "Amy often reads the magazine which has more", replace: "Amy often reads the magazine which has more than 500 articles." },
  ],
  '124': [
    { line: 63, find: "The photos which the girl posted on the blog got a", replace: "The photos which the girl posted on the blog got a lot of likes." },
    { line: 104, find: "Tom has enough pencils whom he can lend to his", replace: "Tom has enough pencils whom he can lend to his friends." },
    { line: 113, find: "Tom lost his pen which he got it on his", replace: "Tom lost his pen which he got it on his birthday." },
  ],
  '125': [
    { line: 38, find: "The student whom is absent has to call the", replace: "The student whom is absent has to call the teacher." },
    { line: 135, find: "The bag _______ I gave to Amy was too small for", replace: "The bag _______ I gave to Amy was too small for me." },
  ],
  '127': [
    { line: 123, find: "The girl ________________ diary is beautiful is the", replace: "The girl ________________ diary is beautiful is the smartest girl." },
  ],
  '128': [
    { line: 51, find: "Amy searched for something that could give her a", replace: "Amy searched for something that could give her a better idea." },
    { line: 61, find: "I went to a café Amy recommended., I went to", replace: "I went to a café Amy recommended., I went to a café that Amy recommended." },
  ],
  '129': [
    { line: 56, find: "I showed Tom the things which were in my", replace: "I showed Tom the things which were in my pocket., I showed Tom what was in my pocket." },
  ],
  '130': [
    { line: 51, find: "Tom couldn't understand the thing that she was", replace: "Tom couldn't understand the thing that she was trying to say., Tom couldn't understand what she was trying to say." },
  ],
  '131': [
    { line: 67, find: "The shirt she is wearing is very colorful., Look at the", replace: "The shirt she is wearing is very colorful., Look at the children singing on the stage." },
  ],
  '132': [
    { line: 100, find: "Amy passed the final exam, that surprised her", replace: "Amy passed the final exam, that surprised her family." },
  ],
  '133': [
    { line: 70, find: "Before it is too late, we need to protect the ocean on", replace: "Before it is too late, we need to protect the ocean on which we depend." },
  ],
  '135': [
    { line: 32, find: "She'll go to the park in where I went to", replace: "She'll go to the park in where I went to yesterday." },
    { line: 60, find: "This is the school in which he studies., This is the", replace: "This is the school in which he studies., This is the school which he studies in." },
    { line: 150, find: "I remember the morning when I met my best friend on", replace: "I remember the morning when I met my best friend on that day." },
  ],
  '136': [
    { line: 68, find: "He is learning the way she edits the photo., He is", replace: "He is learning the way she edits the photo., He is learning how she edits the photo." },
  ],
  '137': [
    { line: 75, find: "I remember the day the festival was held., I", replace: "I remember the day the festival was held., I remember when the festival was held." },
    { line: 130, find: "The boy can't forget the moment he saw the", replace: "The boy can't forget the moment he saw the rainbow., The boy can't forget when he saw the rainbow." },
  ],
  '138': [
    { line: 95, find: "Whenever I went camping, it always rained., It", replace: "Whenever I went camping, it always rained., It always rained at any time when I went camping." },
  ],
  '141': [
    { line: 80, find: "It's embarrassed when I have to ask people for", replace: "It's embarrassed when I have to ask people for money." },
  ],
  '142': [
    { line: 117, find: "As they didn't have anything to eat, they sat quietly at", replace: "As they didn't have anything to eat, they sat quietly at the table." },
  ],
  '146': [
    { line: 57, find: "When Amy needed help, her mother's encouragement was a", replace: "When Amy needed help, her mother's encouragement was a huge help." },
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
    if (practical.includes(fix.find)) {
      practical = practical.replace(fix.find, fix.replace);
      fixedInUnit++;
      totalFixed++;
    } else {
      errors.push(`Unit ${unitNum} L${fix.line}: Target not found: "${fix.find.substring(0, 50)}..."`);
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
  console.log(`\n⚠️ ${errors.length}건 실패:`);
  errors.forEach(e => console.log('  ' + e));
}

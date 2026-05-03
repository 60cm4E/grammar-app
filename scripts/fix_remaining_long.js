/**
 * fix_remaining_long.js
 * 남은 긴 줄 10건 수동 처리
 */

const fs = require('fs');
const path = require('path');
const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');

function fixUnit(unitNum, stageName, findStr, replaceStr) {
  const filePath = path.join(UNITS_DIR, `${unitNum}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let content = data.stages[stageName];
  if (!content) return;
  if (!content.includes(findStr)) {
    console.log(`[MISS] Unit ${unitNum} [${stageName}]: "${findStr.substring(0,50)}..." 미발견`);
    return;
  }
  data.stages[stageName] = content.replace(findStr, replaceStr);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`[FIX] Unit ${unitNum} [${stageName}] 완료`);
}

// Unit 153 practical - "very," 다음에 ", But for"가 이어지는 잘린 정답
fixUnit('153', 'practical',
  '> 정답: If it were not for the library, our studies would be very, But for the library, our studies would be very difficult.',
  '> 정답: If it were not for the library, our studies would be very difficult.\n> 정답: But for the library, our studies would be very difficult.'
);

// Unit 156 practiceB - → 기준으로 분리
fixUnit('156', 'practiceB',
  '> **정답** Had he been more careful, he would not have been in the hospital. → If he hadn\'t been more careful, he would not be in the hospital.',
  '> **정답** Had he been more careful, he would not have been in the hospital.\n→ If he hadn\'t been more careful, he would not be in the hospital.'
);

// Unit 160 practiceB - → 기준으로 분리
fixUnit('160', 'practiceB',
  '> **정답** He said to her, "Did you visit my house last Saturday?" → He asked her whether she visited his house the previous Saturday.',
  '> **정답** He said to her, "Did you visit my house last Saturday?"\n→ He asked her whether she visited his house the previous Saturday.'
);

fixUnit('160', 'practiceB',
  '> **정답** She said to me, "Why did you argue with them yesterday?" → She asked me why I argued with them the previous day.',
  '> **정답** She said to me, "Why did you argue with them yesterday?"\n→ She asked me why I argued with them the previous day.'
);

// Unit 161 practiceB - → 기준으로 분리 (정답 태그 형식 확인)
fixUnit('161', 'practiceB',
  '> **정답He said to her, "Solve this problem in different ways." → He suggested to have solved that problem in different ways.',
  '> **정답** He said to her, "Solve this problem in different ways."\n→ He suggested to have solved that problem in different ways.'
);

fixUnit('161', 'practiceB',
  '> **정답She said to me, "Please send this document to David today." → She asked me to send that document to David that day.',
  '> **정답** She said to me, "Please send this document to David today."\n→ She asked me to send that document to David that day.'
);

// Unit 126 concept - 문장 분리
fixUnit('126', 'concept',
  '👩‍🏫 선생님: 맞아요. 2번과 3번은 앞에 \'소녀\', \'소년\'이라는 꾸밈을 받는 대상(선행사)이 있어서 \'~하는\'으로 해석되는 **관계대명사** who이고, 1번은 앞에 선행사가 없으며 \'누구\'라고 해석되는 **의문사** who랍니다! 정답은 1번이에요. (학생의 말)',
  '👩‍🏫 선생님: 맞아요. 2번과 3번은 앞에 \'소녀\', \'소년\'이라는 꾸밈을 받는 대상(선행사)이 있어서 \'~하는\'으로 해석되는 **관계대명사** who이고,\n1번은 앞에 선행사가 없으며 \'누구\'라고 해석되는 **의문사** who랍니다! 정답은 1번이에요. (학생의 말)'
);

// Unit 162 concept - 문장 분리
fixUnit('162', 'concept',
  '👩‍🏫 선생님: 맞아요. 과거 시제(studied) 문장이므로 \'It was ~ that\' 사이에 강조하고 싶은 장소구인 \'in the library\'를 넣어서 "It was in the library that I studied English today"라고 하는 것이 맞습니다.',
  '👩‍🏫 선생님: 맞아요. 과거 시제(studied) 문장이므로 \'It was ~ that\' 사이에 강조하고 싶은 장소구인 \'in the library\'를 넣어서\n"It was in the library that I studied English today"라고 하는 것이 맞습니다.'
);

console.log('\n완료!');

// 최종 긴 줄 통계
let remaining = 0;
const remByStage = {};
for (let i = 1; i <= 164; i++) {
  const unitNum = String(i).padStart(3, '0');
  const data = JSON.parse(fs.readFileSync(path.join(UNITS_DIR, `${unitNum}.json`), 'utf-8'));
  for (const [key, content] of Object.entries(data.stages || {})) {
    if (!content) continue;
    content.split('\n').forEach(l => {
      if (l.length > 120) {
        remaining++;
        remByStage[key] = (remByStage[key] || 0) + 1;
      }
    });
  }
}
console.log(`\n최종 남은 긴 줄 (>120자): ${remaining}건`);
Object.entries(remByStage).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));

const fs = require('fs');
const path = require('path');
const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');

// Format: [unit, lineIndex(0-based), complete new answer line]
const fixes = [
  ['033', '> 정답: Some players are from Busan, the others are', '> 정답: Some players are from Busan, the others are from Daegu., One was from his friend, others were from his uncle.'],
  ['049', '> 정답: Mina had been to London three times when she was', '> 정답: Mina had been to London three times when she was young., Tom had waited for the bus for 30 minutes when it arrived.'],
  ['052', '> 정답: If it rains tomorrow, I will stay home with', '> 정답: If it rains tomorrow, I will stay home with my friend., If she takes a bus, she will arrive on time.'],
  ['053', '> 정답: Amy is going to go to the zoo with her', '> 정답: Amy is going to go to the zoo with her family this weekend., Amy will go to the zoo with her family this weekend.'],
  ['068', '> 정답: It took 20 minutes for the bus to arrive at the', '> 정답: It took 20 minutes for the bus to arrive at the station.'],
  ['084', "> 정답: Unless you arrive on time, you won't see the", "> 정답: Unless you arrive on time, you won't see the show., You can use this space if you move this desk."],
  ['084', "> 정답: If it doesn't rain tomorrow, we will go to the", "> 정답: If it doesn't rain tomorrow, we will go to the park."],
  ['085', '> 정답: Though the trail was very steep, we hiked to', '> 정답: Though the trail was very steep, we hiked to the top.'],
  ['115', '> 정답: Amy is reading one of the most boring books I have', '> 정답: Amy is reading one of the most boring books I have ever read.'],
  ['129', '> 정답: People should be responsible for the thing which', '> 정답: People should be responsible for the thing which they have done.'],
  ['129', '> 정답: I saw a house ________ wall was covered with', '> 정답: I saw a house ________ wall was covered with snow.'],
  ['131', '> 정답: The cheesecake that I ate last night was very', '> 정답: The cheesecake that I ate last night was very delicious.'],
  ['156', '> 정답: Had Tom come to the event, we would have had', '> 정답: Had Tom come to the event, we would have had fun.'],
  ['156', '> 정답: If it were not for heavy snow, we would be at the', '> 정답: If it were not for heavy snow, we would be at the resort.'],
  ['156', '> 정답: Had she been more patient, she would not have been', '> 정답: Had she been more patient, she would not have been in the hospital.'],
  ['158', '> 정답: Both you and she are expected to attend the', '> 정답: Both you and she are expected to attend the event.'],
  ['161', '> 정답: He said to her, "Please pass these notes to your', '> 정답: He said to her, "Please pass these notes to your classmate."'],
  ['161', '> 정답: He said to me, "Please be well prepared for the', '> 정답: He said to me, "Please be well prepared for the test."'],
  ['162', '> 정답: 내가 작년에 그녀를 만났던 곳은 바로 그 카페였다. → It was', '> 정답: 내가 작년에 그녀를 만났던 곳은 바로 그 카페였다. → It was at the cafe that I met her last year.'],
  ['163', '> 정답: Not all the students were aware of the deadline of', '> 정답: Not all the students were aware of the deadline of the assignment.'],
];

let totalFixed = 0;
for (const [unit, searchLine, replaceLine] of fixes) {
  const filePath = path.join(UNITS_DIR, unit + '.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  const lines = data.stages.practical.split('\n');
  let found = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === searchLine) {
      lines[i] = replaceLine;
      found = true;
      totalFixed++;
      console.log('Unit ' + unit + ' L' + (i+1) + ': OK');
      break;
    }
  }
  if (!found) {
    // Try includes match
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(searchLine.substring(4))) { // skip "> 정답: " prefix
        lines[i] = replaceLine;
        found = true;
        totalFixed++;
        console.log('Unit ' + unit + ' L' + (i+1) + ': OK (partial match)');
        break;
      }
    }
  }
  if (!found) {
    console.log('Unit ' + unit + ': NOT FOUND');
  }
  
  data.stages.practical = lines.join('\n');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

console.log('\n총 ' + totalFixed + '건 수정');

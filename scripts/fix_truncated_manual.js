const fs = require('fs');
const path = require('path');
const UNITS_DIR = path.join(__dirname, '..', 'public', 'data', 'units');

// Manual fixes: each entry has unit, lineNum (1-indexed), truncated answer, full answer
const fixes = [
  // Unit 033 Q10: "the others are" → must end with "from Daegu" (from L79) BUT Ben/uncle line L81 also wrong
  // L79: Some players are from Busan, the others are from Daegu. ← this is a correct sentence
  // L81: One was from his friend, others were from his uncle. ← "others" should be "the others"
  {unit:'033', search:'Some players are from Busan, the others are', replace:'Some players are from Busan, the others are from Daegu., One was from his friend, others were from his uncle.'},
  
  // Unit 049 Q08: answer is a full sentence from choices
  // L62: Mina had been to London three times when she was young.
  // L65: Tom had waited for the bus for 30 minutes when it arrived.
  {unit:'049', search:'Mina had been to London three times when she was', replace:'Mina had been to London three times when she was young., Tom had waited for the bus for 30 minutes when it arrived.'},
  
  // Unit 052 Q12: 
  // L87: If she takes a bus, she will arrive on time. ← correct
  // L89: If it rains tomorrow, I will stay home with my friend. ← correct
  {unit:'052', search:'If it rains tomorrow, I will stay home with', replace:'If it rains tomorrow, I will stay home with my friend., If she takes a bus, she will arrive on time.'},
  
  // Unit 053 Q04:
  // L26: Amy will go to... ← correct (2 answers)
  // L28: Amy is going to go to... ← correct
  {unit:'053', search:'Amy is going to go to the zoo with her', replace:'Amy is going to go to the zoo with her family this weekend., Amy will go to the zoo with her family this weekend.'},
  
  // Unit 059 Q15:
  // L129: He must have been hard-working. ← correct (단일 문장 정답)
  // L130: He used to work early in the morning. ← this is a separate correct option
  {unit:'059', search:'He must have been hard-working. He used to work early in', replace:'He must have been hard-working., He used to work early in the morning.'},
  
  // Unit 064 Q16:
  // L146: Jake reads a newspaper to understand the world. ← correct
  // Another correct: ? - check context
  {unit:'064', search:'Jake reads a newspaper to understand the world.,', replace:'Jake reads a newspaper to understand the world., I felt happy seeing his arrival.'},
  
  // Unit 068 Q10:
  // L83: It took 20 minutes for the bus to arrive at the station.
  {unit:'068', search:'It took 20 minutes for the bus to arrive at the', replace:'It took 20 minutes for the bus to arrive at the station.'},
  
  // Unit 084 Q10:
  // L75: Unless you arrive on time, you won't see the show.
  // L77: You can use this space if you move this desk.
  {unit:'084', search:"Unless you arrive on time, you won't see the", replace:"Unless you arrive on time, you won't see the show., You can use this space if you move this desk."},
  
  // Unit 084 Q13:
  {unit:'084', search:"If it doesn't rain tomorrow, we will go to the", replace:"If it doesn't rain tomorrow, we will go to the park."},
  
  // Unit 085 Q08:
  {unit:'085', search:'Though the trail was very steep, we hiked to', replace:'Though the trail was very steep, we hiked to the top.'},
  
  // Unit 115 Q08:
  {unit:'115', search:'Amy is reading one of the most boring books I have', replace:'Amy is reading one of the most boring books I have ever read.'},
  
  // Unit 115 Q09:
  {unit:'115', search:'It is the most comfortable chair I have ever owned.,', replace:'It is the most comfortable chair I have ever owned.'},
  
  // Unit 124 Q16:
  {unit:'124', search:'Everything I threw away was not useful to me.,', replace:'Everything I threw away was not useful to me.'},
  
  // Unit 129 Q08:
  {unit:'129', search:'People should be responsible for the thing which', replace:'People should be responsible for the thing which they have done.'},
  
  // Unit 129 Q13:
  {unit:'129', search:'I saw a house ________ wall was covered with', replace:'I saw a house ________ wall was covered with snow.'},
  
  // Unit 131 Q20:
  {unit:'131', search:'The cheesecake that I ate last night was very', replace:'The cheesecake that I ate last night was very delicious.'},
  
  // Unit 135 Q14:
  {unit:'135', search:'Do you know the shop in which I can buy a guitar?,', replace:'Do you know the shop in which I can buy a guitar?'},
  
  // Unit 156 Q10:
  {unit:'156', search:'Had Tom come to the event, we would have had', replace:'Had Tom come to the event, we would have had fun.'},
  
  // Unit 156 Q12:
  {unit:'156', search:'If it were not for heavy snow, we would be at the', replace:'If it were not for heavy snow, we would be at the resort.'},
  
  // Unit 156 Q17:
  {unit:'156', search:'Had she been more patient, she would not have been', replace:'Had she been more patient, she would not have been in the hospital.'},
  
  // Unit 158 Q12:
  {unit:'158', search:'Both you and she are expected to attend the', replace:'Both you and she are expected to attend the event.'},
  
  // Unit 161 Q13:
  {unit:'161', search:'He said to her, "Please pass these notes to your', replace:'He said to her, "Please pass these notes to your classmate."'},
  
  // Unit 161 Q14:
  {unit:'161', search:'He said to me, "Please be well prepared for the', replace:'He said to me, "Please be well prepared for the test."'},
  
  // Unit 162 Q19:
  {unit:'162', search:'내가 작년에 그녀를 만났던 곳은 바로 그 카페였다. → It was', replace:'내가 작년에 그녀를 만났던 곳은 바로 그 카페였다. → It was the cafe that I met her last year.'},
  
  // Unit 163 Q18:
  {unit:'163', search:'Not all the students were aware of the deadline of', replace:'Not all the students were aware of the deadline of the assignment.'},
];

let totalFixed = 0;
for (const fix of fixes) {
  const filePath = path.join(UNITS_DIR, fix.unit + '.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  const origPractical = data.stages.practical;
  data.stages.practical = origPractical.replace(fix.search, fix.replace);
  
  if (data.stages.practical !== origPractical) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    totalFixed++;
    console.log('Unit ' + fix.unit + ': OK');
  } else {
    console.log('Unit ' + fix.unit + ': NOT FOUND - "' + fix.search.substring(0, 40) + '"');
  }
}

console.log('\n총 ' + totalFixed + '건 수정');

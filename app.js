/* ============================================
   Grammar Lab - Admin Page Application
   ============================================ */

const STAGES = [
  { key: 'concept', label: '개념톡', icon: '💡', color: '#40c9a2' },
  { key: 'practiceA', label: '연습문제A', icon: '✏️', color: '#58a6ff' },
  { key: 'practiceB', label: '연습문제B', icon: '📝', color: '#d2a8ff' },
  { key: 'descriptive', label: '서술형문제', icon: '📄', color: '#f7c948' },
  { key: 'practical', label: '실전문제', icon: '🎯', color: '#ff7b72' },
];

const GRAMMAR_CATEGORIES = [
  { key: 'all', label: '전체', icon: '📋', range: null },
  { key: 'pronoun', label: '인칭대명사', icon: '👤', range: ['001', '001'] },
  { key: 'be_verb', label: 'be 동사', icon: '🔤', range: ['002', '006'] },
  { key: 'general_verb', label: '일반동사', icon: '🏃', range: ['007', '013'] },
  { key: 'interrogative', label: '의문사', icon: '❓', range: ['014', '018'] },
  { key: 'noun', label: '명사', icon: '📦', range: ['019', '022'] },
  { key: 'article', label: '관사', icon: '📎', range: ['023', '025'] },
  { key: 'pronoun2', label: '대명사', icon: '🔁', range: ['026', '031'] },
  { key: 'preposition1', label: '전치사 (기초)', icon: '📍', range: ['032', '034'] },
  { key: 'adj_adv', label: '형용사·부사', icon: '🎨', range: ['035', '037'] },
  { key: 'tense', label: '시제', icon: '⏰', range: ['038', '052'] },
  { key: 'modal', label: '조동사', icon: '💪', range: ['053', '059'] },
  { key: 'infinitive', label: 'to부정사', icon: '🎯', range: ['060', '072'] },
  { key: 'gerund', label: '동명사', icon: '📝', range: ['073', '078'] },
  { key: 'conjunction', label: '접속사', icon: '🔗', range: ['079', '089'] },
  { key: 'preposition2', label: '전치사 (심화)', icon: '📌', range: ['090', '095'] },
  { key: 'question', label: '의문문', icon: '🤔', range: ['096', '100'] },
  { key: 'sentence_type', label: '문장의 종류', icon: '📣', range: ['101', '102'] },
  { key: 'sentence_pattern', label: '문장형식', icon: '🏗️', range: ['103', '108'] },
  { key: 'comparison', label: '비교', icon: '⚖️', range: ['109', '115'] },
  { key: 'passive', label: '수동태', icon: '🔄', range: ['116', '122'] },
  { key: 'relative_pronoun', label: '관계대명사', icon: '🔗', range: ['123', '134'] },
  { key: 'relative_adverb', label: '관계부사', icon: '📐', range: ['135', '138'] },
  { key: 'participle', label: '분사', icon: '✂️', range: ['139', '146'] },
  { key: 'subjunctive', label: '가정법', icon: '💭', range: ['147', '156'] },
  { key: 'agreement', label: '일치·화법', icon: '🗣️', range: ['157', '161'] },
  { key: 'special', label: '특수구문', icon: '⭐', range: ['162', '164'] },
];

const GRAMMAR_LEVELS = [
  { key: 'all', label: '전체', icon: '📋', unitIds: null },
  {
    key: '7B',
    label: '7B',
    subtitle: '중1',
    icon: '🟢',
    unitIds: [
      '001','002','003','004','005','006',
      '007','008','009','010','011','012','013',
      '014','015','016','017','018',
      '019','020','021','022',
      '023','024','025',
      '026','027','028','029','030',
      '035','036',
      '037','038',
      '039','040','041','042'
    ]
  },
  {
    key: '7A',
    label: '7A',
    subtitle: '중1',
    icon: '🔵',
    unitIds: [
      '053','054','055','056',
      '060','061','062','063','064',
      '073',
      '079','080','081','082',
      '090','091','092','093','094','095',
      '096','097','098','099','100',
      '103','104','105','106','107','108'
    ]
  },
  {
    key: '8B',
    label: '8B',
    subtitle: '중2',
    icon: '🟡',
    unitIds: [
      '031','032','033','034',
      '043','044','045','046','047',
      '057','058',
      '065','066','067','068',
      '074','075','076',
      '083','084','085','086','087','088','089',
      '101','102',
      '116','117','118','119','120','121','122',
      '139','140','141','142','143','144','145'
    ]
  },
  {
    key: '8A',
    label: '8A',
    subtitle: '중2',
    icon: '🟠',
    unitIds: [
      '109','110','111','112','113','114','115',
      '123','124','125','126','127','128','129','130','131',
      '135','136',
      '147','148','149','150','151','152'
    ]
  },
  {
    key: '9',
    label: '9',
    subtitle: '중3',
    icon: '🔴',
    unitIds: [
      '048','049','050','051','052',
      '059',
      '069','070','071','072',
      '077','078',
      '132','133','134',
      '137','138',
      '146',
      '153','154','155','156',
      '157','158','159','160','161',
      '162','163','164'
    ]
  },
];

let unitsIndex = [];
let currentUnit = null;
let currentStageIdx = 0;
let selectedCategory = 'all';
let selectedLevel = 'all';

// Classroom state
let classrooms = [];
let currentClassroom = null;

// ---- DOM Elements ----
const unitListEl = document.getElementById('unitList');
const searchInput = document.getElementById('searchInput');
const unitCountEl = document.getElementById('unitCount');
const emptyStateEl = document.getElementById('emptyState');
const unitDetailEl = document.getElementById('unitDetail');
const detailUnitNum = document.getElementById('detailUnitNum');
const detailUnitTitle = document.getElementById('detailUnitTitle');
const stageStepperEl = document.getElementById('stageStepper');
const contentStageLabel = document.getElementById('contentStageLabel');
const contentBody = document.getElementById('contentBody');
const prevStageBtn = document.getElementById('prevStageBtn');
const nextStageBtn = document.getElementById('nextStageBtn');

// ============================================
// TAB Navigation
// ============================================
const tabButtons = document.querySelectorAll('.header-tab');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;

    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    tabContents.forEach(tc => tc.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');

    // Initialize classroom when tab is switched
    if (tabId === 'classrooms') {
      renderClassroomList();
    }
  });
});

// ============================================
// UNITS TAB (existing functionality)
// ============================================
async function init() {
  try {
    const resp = await fetch('public/data/units.json');
    unitsIndex = await resp.json();
    unitCountEl.textContent = `${unitsIndex.length} Units`;
    renderUnitList(unitsIndex);
  } catch (err) {
    console.error('Failed to load units index:', err);
    unitListEl.innerHTML = '<p style="padding:20px;color:var(--text-secondary)">데이터를 불러올 수 없습니다.</p>';
  }

  // Load classrooms from localStorage
  loadClassrooms();
}

function renderUnitList(units) {
  unitListEl.innerHTML = '';
  units.forEach((unit, i) => {
    const el = document.createElement('div');
    el.className = 'unit-item';
    el.dataset.unitId = unit.id;

    const dotsHTML = STAGES.map(s => {
      const available = unit.stagesAvailable.includes(s.key);
      return `<div class="stage-dot ${available ? 'available' : ''}" title="${s.label}"></div>`;
    }).join('');

    el.innerHTML = `
      <span class="unit-num">${unit.id}</span>
      <span class="unit-name">${unit.title}</span>
      <div class="stage-dots">${dotsHTML}</div>
    `;

    el.addEventListener('click', () => selectUnit(unit.id));
    unitListEl.appendChild(el);
  });
}

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim().toLowerCase();
  if (!query) {
    renderUnitList(unitsIndex);
    return;
  }
  const filtered = unitsIndex.filter(u =>
    u.id.includes(query) ||
    u.title.toLowerCase().includes(query)
  );
  renderUnitList(filtered);

  if (currentUnit) {
    const activeEl = unitListEl.querySelector(`[data-unit-id="${currentUnit.id}"]`);
    if (activeEl) activeEl.classList.add('active');
  }
});

async function selectUnit(unitId) {
  unitListEl.querySelectorAll('.unit-item').forEach(el => el.classList.remove('active'));
  const activeEl = unitListEl.querySelector(`[data-unit-id="${unitId}"]`);
  if (activeEl) activeEl.classList.add('active');

  try {
    const resp = await fetch(`public/data/units/${unitId}.json`);
    currentUnit = await resp.json();
    currentStageIdx = 0;
    showUnitDetail();
  } catch (err) {
    console.error('Failed to load unit:', err);
  }
}

function showUnitDetail() {
  emptyStateEl.classList.add('hidden');
  unitDetailEl.classList.remove('hidden');
  unitDetailEl.style.animation = 'none';
  unitDetailEl.offsetHeight;
  unitDetailEl.style.animation = '';

  detailUnitNum.textContent = `Unit ${currentUnit.id}`;
  detailUnitTitle.textContent = currentUnit.title;

  updateStepper();
  renderStageContent();
}

function updateStepper() {
  const steps = stageStepperEl.querySelectorAll('.stage-step');
  steps.forEach((stepEl, idx) => {
    const stageKey = stepEl.dataset.stage;
    const available = currentUnit.stages && currentUnit.stages[stageKey];

    stepEl.classList.remove('active', 'unavailable');
    if (idx === currentStageIdx) {
      stepEl.classList.add('active');
    }
    if (!available) {
      stepEl.classList.add('unavailable');
    }

    stepEl.onclick = () => {
      if (available) {
        currentStageIdx = idx;
        updateStepper();
        renderStageContent();
      }
    };
  });

  prevStageBtn.disabled = currentStageIdx === 0;
  nextStageBtn.disabled = currentStageIdx === STAGES.length - 1;
}

prevStageBtn.addEventListener('click', () => {
  if (currentStageIdx > 0) {
    currentStageIdx--;
    updateStepper();
    renderStageContent();
  }
});

nextStageBtn.addEventListener('click', () => {
  if (currentStageIdx < STAGES.length - 1) {
    currentStageIdx++;
    updateStepper();
    renderStageContent();
  }
});

// ============================================
// INTERACTIVE CONCEPT TALK
// ============================================

function parseConceptToBlocks(md) {
  const lines = md.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) { i++; continue; }

    // Heading
    if (/^#{1,3}\s/.test(line)) {
      blocks.push({ type: 'heading', text: line.replace(/^#{1,3}\s+/, '') });
      i++; continue;
    }

    // Quiz block: starts with **Q.
    if (/^\*\*Q\./.test(line)) {
      const questionText = line.replace(/^\*\*Q\.\s*/, '').replace(/\*\*$/, '').replace(/\*\*/, '');
      const options = [];
      i++;
      while (i < lines.length) {
        const optLine = lines[i].trim();
        if (!optLine) { i++; continue; }
        const optMatch = optLine.match(/^(\d+)\.\s+(.+)/);
        if (optMatch) {
          const isCorrect = optMatch[2].includes('✅');
          const text = optMatch[2].replace(/\s*✅\s*/, '').trim();
          options.push({ num: optMatch[1], text, isCorrect });
          i++;
        } else {
          break;
        }
      }
      blocks.push({ type: 'quiz', question: questionText, options });
      continue;
    }

    // Example block: starts with >
    if (/^>/.test(line)) {
      const exLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        exLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'example', lines: exLines });
      continue;
    }

    // Teacher line
    if (line.includes('👩‍🏫') || line.startsWith('👩\u200D🏫')) {
      const text = line.replace(/👩‍🏫\s*선생님:\s*/, '').replace(/👩\u200D🏫\s*선생님:\s*/, '');
      blocks.push({ type: 'teacher', text });
      i++; continue;
    }

    // Student line
    if (line.includes('🧑‍🎓') || line.startsWith('🧑\u200D🎓')) {
      const text = line.replace(/🧑‍🎓\s*학생:\s*/, '').replace(/🧑\u200D🎓\s*학생:\s*/, '');
      blocks.push({ type: 'student', text });
      i++; continue;
    }

    // General text
    blocks.push({ type: 'text', text: line });
    i++;
  }

  return blocks;
}

function formatInlineMarkdown(text) {
  let html = escapeHtml(text);
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/&lt;u&gt;(.+?)&lt;\/u&gt;/g, '<u>$1</u>');
  return html;
}

let conceptBlocks = [];
let conceptVisibleCount = 0;
let conceptQuizPending = false;
let conceptChatTarget = null; // the container element (contentBody or svBody)

// ---- TTS Engine (Google Translate Neural TTS) ----
let ttsMuted = false;
let ttsCurrentAudio = null;
let ttsChunkQueue = [];
let ttsPlaying = false;
let ttsBlockQueue = []; // Queue of { text, element } pairs for per-block highlighting
let ttsSpeakingElement = null; // Currently highlighted element

function speakText(text, onComplete) {
  if (ttsMuted) { if (onComplete) onComplete(); return; }

  // Stop only current chunk audio (NOT the full stopTTS which clears the block queue)
  if (ttsCurrentAudio) {
    ttsCurrentAudio.pause();
    ttsCurrentAudio.src = '';
    ttsCurrentAudio = null;
  }
  ttsChunkQueue = [];
  if (window.speechSynthesis) speechSynthesis.cancel();

  // Clean text: remove markdown artifacts, HTML entities, special chars, symbols
  let clean = text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;|&gt;|&amp;|&quot;|&#039;/g, '')
    .replace(/✅|❌|❓|🔊|👩‍🏫|🧑‍🎓/g, '')
    .replace(/[~→←↔★●◆◇▶▷►▼▽△▲■□○◎※#@]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) { if (onComplete) onComplete(); return; }

  // Split text into language segments (Korean vs English) for native pronunciation
  const segments = splitByLanguage(clean);

  // Build chunk queue with per-segment language, respecting max chunk length
  ttsChunkQueue = [];
  for (const seg of segments) {
    const chunks = splitTextForTTS(seg.text, 190);
    for (const chunk of chunks) {
      ttsChunkQueue.push({ text: chunk, lang: seg.lang });
    }
  }

  ttsOnComplete = onComplete || null;
  ttsPlaying = true;
  playNextChunk();
}

/**
 * Split text into segments by language (Korean vs English/other).
 * Adjacent segments of the same language are merged.
 * Short number/punctuation fragments are merged with neighbors.
 */
function splitByLanguage(text) {
  const segments = [];
  // Match runs of Korean chars (hangul + jamo + compatibility jamo + common Korean punctuation)
  // or runs of non-Korean chars (English, numbers, punctuation)
  const regex = /([\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF]+(?:[\s,.:;!?·~\-]*[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF]+)*)/g;

  let lastIdx = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    // Add English/other text before this Korean match
    if (match.index > lastIdx) {
      const enText = text.substring(lastIdx, match.index).trim();
      if (enText) segments.push({ text: enText, lang: 'en' });
    }
    // Add Korean text
    const koText = match[0].trim();
    if (koText) segments.push({ text: koText, lang: 'ko' });
    lastIdx = match.index + match[0].length;
  }
  // Add remaining English/other text
  if (lastIdx < text.length) {
    const enText = text.substring(lastIdx).trim();
    if (enText) segments.push({ text: enText, lang: 'en' });
  }

  // If no segments found, treat the whole text as single block
  if (segments.length === 0) {
    const koChars = (text.match(/[\uAC00-\uD7AF]/g) || []).length;
    const lang = koChars > text.length * 0.3 ? 'ko' : 'en';
    return [{ text, lang }];
  }

  // Merge very short segments (≤3 chars, likely punctuation/numbers) with neighbors
  const merged = [segments[0]];
  for (let i = 1; i < segments.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = segments[i];
    // Merge short non-letter segments into the previous one
    if (curr.text.length <= 3 && !/[a-zA-Z\uAC00-\uD7AF]/.test(curr.text)) {
      prev.text += ' ' + curr.text;
    } else if (prev.lang === curr.lang) {
      prev.text += ' ' + curr.text;
    } else {
      merged.push(curr);
    }
  }

  return merged;
}

function splitTextForTTS(text, maxLen) {
  if (text.length <= maxLen) return [text];

  const chunks = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }

    // Try to split at sentence boundary
    let splitIdx = -1;
    const separators = ['. ', '! ', '? ', '。', '!', '?', ', ', '， '];
    for (const sep of separators) {
      const idx = remaining.lastIndexOf(sep, maxLen);
      if (idx > maxLen * 0.3) {
        splitIdx = idx + sep.length;
        break;
      }
    }

    // Fall back to space
    if (splitIdx === -1) {
      splitIdx = remaining.lastIndexOf(' ', maxLen);
      if (splitIdx < maxLen * 0.3) splitIdx = maxLen;
    }

    chunks.push(remaining.substring(0, splitIdx).trim());
    remaining = remaining.substring(splitIdx).trim();
  }

  return chunks;
}

let ttsOnComplete = null;

function playNextChunk() {
  if (ttsChunkQueue.length === 0 || ttsMuted) {
    ttsPlaying = false;
    if (ttsOnComplete) { const cb = ttsOnComplete; ttsOnComplete = null; cb(); }
    return;
  }

  const chunk = ttsChunkQueue.shift();
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${chunk.lang}&client=tw-ob&q=${encodeURIComponent(chunk.text)}`;

  const audio = new Audio(url);
  ttsCurrentAudio = audio;
  let handled = false; // Guard to prevent double-fallback

  audio.onended = () => {
    ttsCurrentAudio = null;
    if (!handled) playNextChunk();
  };
  audio.onerror = () => {
    if (handled) return;
    handled = true;
    ttsCurrentAudio = null;
    fallbackSpeak(chunk.text, chunk.lang);
  };

  audio.play().catch(() => {
    if (handled) return;
    handled = true;
    ttsCurrentAudio = null;
    fallbackSpeak(chunk.text, chunk.lang);
  });
}

function fallbackSpeak(text, lang) {
  if (!window.speechSynthesis) {
    playNextChunk();
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'ko' ? 'ko-KR' : 'en-US';
  utterance.rate = 0.95;

  // Prefer natural/online voices
  const voices = speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.lang.startsWith(lang) && (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google'))
  ) || voices.find(v => v.lang.startsWith(lang));
  if (preferred) utterance.voice = preferred;

  utterance.onend = () => playNextChunk();
  utterance.onerror = () => playNextChunk();
  speechSynthesis.speak(utterance);
}

function setSpeakingIndicator(on, element) {
  // Remove speaking class from all elements
  document.querySelectorAll('.speaking').forEach(el => el.classList.remove('speaking'));
  ttsSpeakingElement = null;
  if (on && element) {
    element.classList.add('speaking');
    ttsSpeakingElement = element;
  }
}

function speakBlockQueue() {
  if (ttsBlockQueue.length === 0 || ttsMuted) {
    setSpeakingIndicator(false);
    return;
  }
  const { text, element } = ttsBlockQueue.shift();
  setSpeakingIndicator(true, element);
  speakText(text, () => {
    setSpeakingIndicator(false);
    speakBlockQueue();
  });
}

function stopTTS() {
  // Stop Audio element
  if (ttsCurrentAudio) {
    ttsCurrentAudio.pause();
    ttsCurrentAudio.src = '';
    ttsCurrentAudio = null;
  }
  ttsChunkQueue = [];
  ttsBlockQueue = [];
  ttsOnComplete = null;
  ttsPlaying = false;

  // Also stop any fallback speechSynthesis
  if (window.speechSynthesis) speechSynthesis.cancel();

  setSpeakingIndicator(false);
}

function toggleTTSMute() {
  ttsMuted = !ttsMuted;
  if (ttsMuted) stopTTS();

  // Update all mute buttons
  document.querySelectorAll('.tts-mute-btn').forEach(btn => {
    btn.innerHTML = ttsMuted
      ? '🔇 <span>음소거</span>'
      : '🔊 <span>음성 켜짐</span>';
    btn.classList.toggle('muted', ttsMuted);
  });
}

// Preload voices for fallback
if (window.speechSynthesis) {
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}

function renderConceptInteractive(targetEl) {
  // Determine which element to render into
  const target = targetEl || contentBody;
  conceptChatTarget = target;

  // Get the concept markdown — either from currentUnit or stageViewerData
  let md = null;
  if (targetEl && stageViewerData) {
    md = stageViewerData.stages ? stageViewerData.stages['concept'] : null;
  } else if (currentUnit) {
    md = currentUnit.stages ? currentUnit.stages['concept'] : null;
  }

  if (!md) {
    target.innerHTML = `
      <div style="text-align:center;padding:60px 0;color:var(--text-secondary)">
        <div style="font-size:3rem;margin-bottom:12px">📭</div>
        <p>이 단계의 콘텐츠가 없습니다.</p>
      </div>
    `;
    return;
  }

  conceptBlocks = parseConceptToBlocks(md);
  conceptVisibleCount = 0;
  conceptQuizPending = false;
  stopTTS();

  target.innerHTML = `
    <div class="chat-container" id="chatContainer"></div>
    <div class="chat-continue" id="chatContinue">
      <button class="tts-mute-btn ${ttsMuted ? 'muted' : ''}" id="btnTTSMute">
        ${ttsMuted ? '🔇 <span>음소거</span>' : '🔊 <span>음성 켜짐</span>'}
      </button>
      <button class="chat-next-btn" id="btnChatNext">다음 ▼</button>
    </div>
  `;

  document.getElementById('btnChatNext').addEventListener('click', advanceConceptChat);
  document.getElementById('btnTTSMute').addEventListener('click', toggleTTSMute);
  advanceConceptChat();
}

function advanceConceptChat() {
  if (conceptQuizPending) return;

  const container = document.getElementById('chatContainer');
  if (!container) return;

  // Show next blocks until we hit a quiz or run out
  let added = false;
  let blockEntries = []; // { text, element } for per-block TTS
  while (conceptVisibleCount < conceptBlocks.length) {
    const block = conceptBlocks[conceptVisibleCount];
    conceptVisibleCount++;

    const el = createChatBlockElement(block);
    if (el) {
      container.appendChild(el);
      added = true;
    }

    // Collect teacher and example blocks with their DOM elements for TTS
    if (block.type === 'teacher' && el) {
      blockEntries.push({ text: block.text, element: el });
    } else if (block.type === 'example' && el) {
      blockEntries.push({ text: block.lines.join('. '), element: el });
    }

    // If this was a quiz, stop and wait for answer
    if (block.type === 'quiz') {
      conceptQuizPending = true;
      updateChatContinueBtn();
      scrollChatToBottom();
      if (blockEntries.length) {
        ttsBlockQueue = blockEntries;
        setTimeout(() => speakBlockQueue(), 300);
      }
      return;
    }

    // Show a few blocks at a time: stop after teacher/student lines (but group examples after)
    if ((block.type === 'teacher' || block.type === 'student') && 
        conceptVisibleCount < conceptBlocks.length && 
        conceptBlocks[conceptVisibleCount].type !== 'example') {
      break;
    }
  }

  // Speak blocks sequentially with per-block highlighting
  if (blockEntries.length) {
    ttsBlockQueue = blockEntries;
    setTimeout(() => speakBlockQueue(), 300);
  }

  updateChatContinueBtn();
  scrollChatToBottom();
}

function createChatBlockElement(block) {
  const div = document.createElement('div');
  div.classList.add('chat-block', 'chat-animate');

  switch (block.type) {
    case 'heading':
      div.className = 'chat-heading chat-animate';
      div.innerHTML = formatInlineMarkdown(block.text);
      return div;

    case 'teacher':
      div.className = 'chat-bubble teacher chat-animate';
      div.innerHTML = `
        <div class="bubble-avatar">👩‍🏫</div>
        <div class="bubble-content">
          <div class="bubble-name">선생님 <span class="tts-indicator">🔊</span></div>
          <div class="bubble-text">${formatInlineMarkdown(block.text)}</div>
        </div>
      `;
      return div;

    case 'student':
      div.className = 'chat-bubble student chat-animate';
      div.innerHTML = `
        <div class="bubble-content">
          <div class="bubble-name">학생</div>
          <div class="bubble-text">${formatInlineMarkdown(block.text)}</div>
        </div>
        <div class="bubble-avatar">🧑‍🎓</div>
      `;
      return div;

    case 'example':
      div.className = 'chat-example chat-animate';
      div.innerHTML = block.lines.map(l => `<div>${formatInlineMarkdown(l)}</div>`).join('');
      return div;

    case 'quiz':
      div.className = 'chat-quiz chat-animate';
      const optionsHtml = block.options.map((opt, idx) => `
        <button class="quiz-option" data-idx="${idx}" data-correct="${opt.isCorrect}">
          <span class="quiz-option-num">${opt.num}</span>
          <span class="quiz-option-text">${formatInlineMarkdown(opt.text)}</span>
        </button>
      `).join('');

      div.innerHTML = `
        <div class="quiz-question">
          <span class="quiz-icon">❓</span>
          <span>${formatInlineMarkdown(block.question)}</span>
        </div>
        <div class="quiz-options">${optionsHtml}</div>
        <div class="quiz-feedback hidden" id="quizFeedback_${conceptVisibleCount}"></div>
      `;

      // Attach click handlers after a tick
      const feedbackId = `quizFeedback_${conceptVisibleCount}`;
      setTimeout(() => {
        div.querySelectorAll('.quiz-option').forEach(btn => {
          btn.addEventListener('click', () => handleQuizAnswer(btn, div, feedbackId));
        });
      }, 0);

      return div;

    case 'text':
      if (!block.text.trim()) return null;
      div.className = 'chat-text chat-animate';
      div.innerHTML = formatInlineMarkdown(block.text);
      return div;

    default:
      return null;
  }
}

function handleQuizAnswer(btn, quizDiv, feedbackId) {
  if (btn.classList.contains('disabled')) return;

  const isCorrect = btn.dataset.correct === 'true';
  const feedbackEl = quizDiv.querySelector(`#${feedbackId}`) || quizDiv.querySelector('.quiz-feedback');

  if (isCorrect) {
    btn.classList.add('correct');
    quizDiv.querySelectorAll('.quiz-option').forEach(b => b.classList.add('disabled'));
    if (feedbackEl) {
      feedbackEl.classList.remove('hidden');
      feedbackEl.innerHTML = '<span class="feedback-correct">✅ 정답입니다!</span>';
    }
    conceptQuizPending = false;
    updateChatContinueBtn();

    // Auto-advance after short delay
    setTimeout(() => advanceConceptChat(), 800);
  } else {
    btn.classList.add('wrong');
    if (feedbackEl) {
      feedbackEl.classList.remove('hidden');
      feedbackEl.innerHTML = '<span class="feedback-wrong">❌ 다시 생각해보세요!</span>';
    }
    // Remove wrong highlight after a moment
    setTimeout(() => {
      btn.classList.remove('wrong');
      if (feedbackEl) feedbackEl.classList.add('hidden');
    }, 1200);
  }
}

function updateChatContinueBtn() {
  const btn = document.getElementById('btnChatNext');
  if (!btn) return;

  if (conceptVisibleCount >= conceptBlocks.length) {
    btn.textContent = '🎉 학습 완료!';
    btn.disabled = true;
    btn.classList.add('completed');
  } else if (conceptQuizPending) {
    btn.textContent = '퀴즈를 풀어주세요 🔒';
    btn.disabled = true;
  } else {
    btn.textContent = '다음 ▼';
    btn.disabled = false;
  }
}

function scrollChatToBottom() {
  const container = document.getElementById('chatContainer');
  if (container) {
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 100);
  }
}

// Solve mode state for unit tab
let solveMode = false;

function renderStageContent() {
  const stage = STAGES[currentStageIdx];
  contentStageLabel.textContent = `${stage.icon} ${stage.label}`;
  contentStageLabel.style.color = stage.color;
  stopTTS();

  const md = currentUnit.stages ? currentUnit.stages[stage.key] : null;

  // Show/hide solve mode toggle based on stage
  const solveToggle = document.getElementById('solveModeToggle');
  if (solveToggle) {
    if (stage.key === 'concept') {
      solveToggle.style.display = 'none';
    } else {
      solveToggle.style.display = '';
    }
  }

  if (!md) {
    contentBody.innerHTML = `
      <div style="text-align:center;padding:60px 0;color:var(--text-secondary)">
        <div style="font-size:3rem;margin-bottom:12px">📭</div>
        <p>이 단계의 콘텐츠가 없습니다.</p>
      </div>
    `;
    return;
  }

  // Use interactive mode for concept stage
  if (stage.key === 'concept') {
    renderConceptInteractive();
    return;
  }

  // Solve mode: interactive question-by-question
  if (solveMode) {
    renderSolveModeContent(md);
    return;
  }

  contentBody.innerHTML = renderMarkdown(md);
  contentBody.scrollTop = 0;
}

function renderSolveModeContent(md) {
  // Reuse classroom question parser and renderer
  svQuestions = parseQuestionsFromMarkdown(md);
  svCurrentQIdx = 0;
  svAnswerRevealed = false;
  svAllCompleted = false;
  svSelectedChoice = [];
  svResults = new Array(svQuestions.length).fill(null);
  svUserAnswers = new Array(svQuestions.length).fill('');
  svShowingResult = false;

  if (svQuestions.length === 0) {
    contentBody.innerHTML = `
      <div style="text-align:center;padding:60px 0;color:var(--text-secondary)">
        <div style="font-size:3rem;margin-bottom:12px">📝</div>
        <p>풀이 가능한 문제가 없습니다.</p>
        <p style="font-size:0.8rem;margin-top:8px;opacity:0.6">열람 모드로 전환하여 내용을 확인하세요.</p>
      </div>
    `;
    return;
  }

  renderSolveModeQuestion();
}

function renderSolveModeQuestion() {
  const total = svQuestions.length;
  const answeredCount = svResults.filter(r => r !== null).length;

  // All answered — show results
  if (answeredCount >= total && !svShowingResult) {
    renderSolveModeResults();
    return;
  }

  const q = svQuestions[svCurrentQIdx];
  if (!q) return;

  const current = svCurrentQIdx + 1;
  const progress = (answeredCount / total) * 100;
  const thisResult = svResults[svCurrentQIdx];
  const isAnswered = thisResult !== null;

  const bodyHtml = renderStageViewerMarkdown(q.body);

  let interactiveHtml = '';

  if (isAnswered) {
    const correct = thisResult === true;
    interactiveHtml = `
      <div class="sv-q-result ${correct ? 'correct' : 'wrong'}">
        <div class="sv-q-result-icon">${correct ? '✅' : '❌'}</div>
        <div class="sv-q-result-text">${correct ? '정답! 잘했어요!' : '아쉬워요!'}</div>
        ${!correct ? `<div class="sv-q-result-answer">정답: <strong>${escapeHtml(q.answer)}</strong></div>` : ''}
        ${!correct && svUserAnswers[svCurrentQIdx] ? `<div class="sv-q-result-yours">내 답: ${escapeHtml(svUserAnswers[svCurrentQIdx])}</div>` : ''}
      </div>
    `;
  } else if (q.type === 'choice' && q.choices.length > 0) {
    const isMulti = q.requiredCount > 1;
    const choiceBtns = q.choices.map((c, i) => `
      <button class="sv-choice-btn${svSelectedChoice.includes(i) ? ' selected' : ''}" data-idx="${i}">
        <span class="sv-choice-num">${i + 1}</span>
        <span class="sv-choice-text">${escapeHtml(c)}</span>
      </button>
    `).join('');

    const hasSelection = svSelectedChoice.length > 0;
    const selectionLabels = svSelectedChoice.map(i => (i + 1) + '번').join(', ');
    const enoughSelected = svSelectedChoice.length >= q.requiredCount;

    const confirmBar = hasSelection ? `
      <div class="sv-confirm-bar">
        <span class="sv-confirm-text">${selectionLabels} 선택${isMulti ? ` (${svSelectedChoice.length}/${q.requiredCount}개)` : ''}</span>
        <button class="sv-confirm-cancel" id="smCancelChoice">취소</button>
        <button class="sv-confirm-submit${enoughSelected ? '' : ' disabled'}" id="smSubmitChoice" ${enoughSelected ? '' : 'disabled'}>✓ 제출</button>
      </div>
    ` : (isMulti ? `<div class="sv-multi-hint">${q.requiredCount}개를 선택하세요</div>` : '');

    interactiveHtml = `
      <div class="sv-choices-area">${choiceBtns}</div>
      ${confirmBar}
    `;
  } else {
    interactiveHtml = `
      <div class="sv-write-area">
        <div class="sv-write-input-wrap">
          <input type="text" id="smWriteInput" class="sv-write-input" placeholder="정답을 입력하세요..." autocomplete="off" autocapitalize="off" spellcheck="false">
          <button class="sv-write-submit" id="smSubmitWrite">제출 ↵</button>
        </div>
      </div>
    `;
  }

  // Nav dots
  const dots = svQuestions.map((_, i) => {
    let cls = 'sv-q-dot';
    if (i === svCurrentQIdx) cls += ' active';
    if (svResults[i] === true) cls += ' correct';
    else if (svResults[i] === false) cls += ' wrong';
    return `<div class="${cls}" data-qi="${i}"></div>`;
  }).join('');

  contentBody.innerHTML = `
    <div class="sv-classroom solve-mode-embed">
      <div class="sv-progress-area">
        <div class="sv-progress-bar">
          <div class="sv-progress-fill" style="width:${progress}%"></div>
        </div>
        <span class="sv-progress-text">${answeredCount} / ${total} 풀이 완료</span>
      </div>

      <div class="sv-question-card">
        <div class="sv-q-badge">
          <span class="sv-q-num">📝 ${q.num || current}번</span>
        </div>
        <div class="sv-q-body">${bodyHtml}</div>
        <div class="sv-q-interactive">${interactiveHtml}</div>
      </div>

      <div class="sv-q-nav">
        <button class="sv-q-nav-btn" id="smPrevQ" ${svCurrentQIdx === 0 ? 'disabled' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>
          이전
        </button>
        <div class="sv-q-nav-dots">${dots}</div>
        <button class="sv-q-nav-btn sv-q-nav-next" id="smNextQ" ${svCurrentQIdx >= total - 1 ? 'disabled' : ''}>
          다음
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  `;

  // Event listeners
  document.getElementById('smPrevQ')?.addEventListener('click', () => { smNavigate(-1); });
  document.getElementById('smNextQ')?.addEventListener('click', () => { smNavigate(1); });

  // Dot click navigation
  contentBody.querySelectorAll('.sv-q-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const qi = parseInt(dot.dataset.qi);
      svCurrentQIdx = qi;
      svSelectedChoice = [];
      renderSolveModeQuestion();
    });
  });

  // Choice buttons
  contentBody.querySelectorAll('.sv-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      smToggleChoice(idx);
    });
  });

  document.getElementById('smCancelChoice')?.addEventListener('click', () => {
    svSelectedChoice = [];
    renderSolveModeQuestion();
  });
  document.getElementById('smSubmitChoice')?.addEventListener('click', () => smSubmitChoice());

  // Write input
  const writeInput = document.getElementById('smWriteInput');
  if (writeInput) {
    setTimeout(() => writeInput.focus(), 100);
    writeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        smSubmitWrite(writeInput.value.trim());
      }
    });
  }
  document.getElementById('smSubmitWrite')?.addEventListener('click', () => {
    const val = document.getElementById('smWriteInput')?.value?.trim();
    if (val) smSubmitWrite(val);
  });
}

function smNavigate(dir) {
  const newIdx = svCurrentQIdx + dir;
  if (newIdx < 0 || newIdx >= svQuestions.length) return;
  svCurrentQIdx = newIdx;
  svSelectedChoice = [];
  renderSolveModeQuestion();
}

function smToggleChoice(idx) {
  const q = svQuestions[svCurrentQIdx];
  if (!q || svResults[svCurrentQIdx] !== null) return;

  const pos = svSelectedChoice.indexOf(idx);
  if (pos >= 0) {
    svSelectedChoice.splice(pos, 1);
  } else {
    if (q.requiredCount === 1) {
      svSelectedChoice = [idx];
    } else {
      if (svSelectedChoice.length < q.requiredCount) {
        svSelectedChoice.push(idx);
      } else {
        svSelectedChoice.shift();
        svSelectedChoice.push(idx);
      }
    }
  }
  renderSolveModeQuestion();
}

function smSubmitChoice() {
  const q = svQuestions[svCurrentQIdx];
  if (svSelectedChoice.length < q.requiredCount) return;

  const selectedTexts = svSelectedChoice.map(i => q.choices[i]);
  svUserAnswers[svCurrentQIdx] = selectedTexts.join(', ');
  svResults[svCurrentQIdx] = gradeAnswer(selectedTexts, q.answer, 'choice');
  svSelectedChoice = [];
  renderSolveModeQuestion();

  if (svResults[svCurrentQIdx]) {
    setTimeout(() => {
      const next = svResults.findIndex((r, i) => r === null && i > svCurrentQIdx);
      if (next >= 0) { svCurrentQIdx = next; renderSolveModeQuestion(); }
      else if (svResults.every(r => r !== null)) renderSolveModeQuestion();
    }, 1200);
  }
}

function smSubmitWrite(text) {
  const q = svQuestions[svCurrentQIdx];
  svUserAnswers[svCurrentQIdx] = text;
  svResults[svCurrentQIdx] = gradeAnswer(text, q.answer, 'write');
  renderSolveModeQuestion();

  if (svResults[svCurrentQIdx]) {
    setTimeout(() => {
      const next = svResults.findIndex((r, i) => r === null && i > svCurrentQIdx);
      if (next >= 0) { svCurrentQIdx = next; renderSolveModeQuestion(); }
      else if (svResults.every(r => r !== null)) renderSolveModeQuestion();
    }, 1200);
  }
}

function renderSolveModeResults() {
  svShowingResult = true;
  const total = svQuestions.length;
  const correctCount = svResults.filter(r => r === true).length;
  const score = Math.round((correctCount / total) * 100);

  let emoji = '🏆';
  let message = '훌륭해요!';
  if (score < 50) { emoji = '💪'; message = '다시 도전해 볼까요?'; }
  else if (score < 80) { emoji = '👍'; message = '잘했어요!'; }

  const wrongItems = svQuestions
    .map((q, i) => ({ q, i, result: svResults[i] }))
    .filter(item => item.result === false)
    .map(item => `
      <div class="sv-result-item wrong">
        <span class="sv-result-item-num">${item.q.num || (item.i + 1)}번</span>
        <span class="sv-result-item-yours">내 답: ${escapeHtml(svUserAnswers[item.i])}</span>
        <span class="sv-result-item-correct">정답: ${escapeHtml(item.q.answer)}</span>
      </div>
    `).join('');

  // Save progress
  saveUnitProgress(currentUnit.id, STAGES[currentStageIdx].key, score, correctCount, total);

  contentBody.innerHTML = `
    <div class="sv-classroom solve-mode-embed">
      <div class="sv-results-card">
        <div class="sv-results-emoji">${emoji}</div>
        <div class="sv-results-message">${message}</div>
        <div class="sv-results-score">
          <span class="sv-results-correct">${correctCount}</span>
          <span class="sv-results-divider">/</span>
          <span class="sv-results-total">${total}</span>
          <span class="sv-results-label">정답</span>
        </div>
        <div class="sv-results-percent">${score}%</div>
        <div class="sv-results-bar">
          <div class="sv-results-bar-fill" style="width:${score}%"></div>
        </div>
        ${wrongItems ? `
          <div class="sv-results-wrong-section">
            <div class="sv-results-wrong-title">❌ 틀린 문제</div>
            ${wrongItems}
          </div>
        ` : ''}
        <div class="sv-results-actions">
          <button class="sv-results-retry" id="smRetry">🔄 다시 풀기</button>
          <button class="sv-results-review" id="smReview">📋 전체 리뷰</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('smRetry')?.addEventListener('click', () => {
    svShowingResult = false;
    renderStageContent();
  });
  document.getElementById('smReview')?.addEventListener('click', () => {
    svShowingResult = false;
    svCurrentQIdx = 0;
    renderSolveModeQuestion();
  });
}

// ---- Solve mode toggle handler ----
document.getElementById('solveModeCheck')?.addEventListener('change', (e) => {
  solveMode = e.target.checked;
  document.getElementById('solveModeLabel').textContent = solveMode ? '✏️ 풀이' : '📖 열람';
  if (currentUnit) renderStageContent();
});

// ---- Progress tracking (localStorage) ----
const PROGRESS_KEY = 'grammarlab_progress';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  } catch { return {}; }
}

function saveUnitProgress(unitId, stageKey, score, correct, total) {
  const progress = loadProgress();
  if (!progress[unitId]) progress[unitId] = {};
  progress[unitId][stageKey] = {
    score,
    correct,
    total,
    lastAt: new Date().toISOString(),
    attempts: (progress[unitId][stageKey]?.attempts || 0) + 1
  };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  // Update unit list if visible
  updateUnitListProgress();
}

function updateUnitListProgress() {
  const progress = loadProgress();
  document.querySelectorAll('.unit-item').forEach(el => {
    const unitId = el.dataset.unitId;
    const unitProgress = progress[unitId];
    let existingBadge = el.querySelector('.progress-badge');
    
    if (unitProgress) {
      const stages = Object.keys(unitProgress);
      const avgScore = Math.round(stages.reduce((sum, k) => sum + unitProgress[k].score, 0) / stages.length);
      const completedStages = stages.length;
      
      if (!existingBadge) {
        existingBadge = document.createElement('span');
        existingBadge.className = 'progress-badge';
        el.appendChild(existingBadge);
      }
      
      if (avgScore >= 80) {
        existingBadge.textContent = '✅';
        existingBadge.title = `${completedStages}개 스테이지 완료 (${avgScore}%)`;
      } else if (avgScore >= 50) {
        existingBadge.textContent = `${avgScore}%`;
        existingBadge.title = `${completedStages}개 스테이지 진행 중`;
        existingBadge.classList.add('in-progress');
      } else {
        existingBadge.textContent = `${avgScore}%`;
        existingBadge.title = `${completedStages}개 스테이지 도전 중`;
        existingBadge.classList.add('low-score');
      }
    }
  });
}

function renderMarkdown(md) {
  let html = escapeHtml(md);
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '<br>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/&lt;u&gt;(.+?)&lt;\/u&gt;/g, '<u>$1</u>');
  html = html.replace(/!\[([^\]]*?)\]\(([^)]+?)\)/g, '<img class="q-image" src="$2" alt="$1">');
  html = html.replace(/\(\s{3,}\)/g, '<span class="fill-blank">(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)</span>');
  html = html.replace(/^보기:\s*(.+)$/gm, function(match, opts) {
    var chips = opts.split(/\s*\/\s*/).map(function(o) { return '<span class="choice-chip">' + o.trim() + '</span>'; }).join('');
    return '<div class="choice-options"><span class="choice-label">보기</span>' + chips + '</div>';
  });
  html = html.replace(/<strong>(\d{2})\.<\/strong>/g, '<span class="q-number">$1</span>');
  html = html.replace(/👩‍🏫/g, '<span style="font-size:1.2em">👩‍🏫</span>');
  html = html.replace(/🧑‍🎓/g, '<span style="font-size:1.2em">🧑‍🎓</span>');
  html = html.replace(/<strong>정답<\/strong>\s*(.+?)(?=<br>|<\/|$)/gm,
    '<div class="answer-block">$1</div>');
  html = html.replace(/^정답\s+(.+?)(?=<br>|$)/gm,
    '<div class="answer-block">$1</div>');
  html = html.replace(/✅/g, '<span style="color:var(--accent)">✅</span>');
  html = html.replace(/\n/g, '<br>');
  html = html.replace(/(<br>){3,}/g, '<br><br>');
  html = html.replace(/<\/h[123]><br>/g, '</h1>');
  html = html.replace(/<hr><br>/g, '<hr>');
  return html;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('keydown', (e) => {
  // Skip if any modal is open (except stage viewer which has its own keys)
  const addUnitsOpen = !document.getElementById('addUnitsOverlay').classList.contains('hidden');
  const modalOpen = !document.getElementById('modalOverlay').classList.contains('hidden');
  const confirmOpen = !document.getElementById('confirmOverlay').classList.contains('hidden');
  if (addUnitsOpen || modalOpen || confirmOpen) return;

  // Skip if typing in an input
  if (document.activeElement === searchInput) return;
  if (document.activeElement?.getAttribute('contenteditable') === 'true') return;
  if (document.activeElement?.tagName === 'INPUT') return;

  // Check if stage viewer popup is open
  const stageViewerOpen = !document.getElementById('stageViewerOverlay').classList.contains('hidden');

  if (stageViewerOpen) {
    // Classroom mode with active choice question: number keys toggle choices
    if (stageViewerIsClassroom && stageViewerActiveKey !== 'concept' && !svShowingResult) {
      const q = svQuestions[svCurrentQIdx];
      if (q && q.type === 'choice' && svResults[svCurrentQIdx] === null && e.key >= '1' && e.key <= '9') {
        const idx = parseInt(e.key) - 1;
        if (idx < q.choices.length) {
          e.preventDefault();
          toggleChoiceSelection(idx);
          return;
        }
      }
    }

    // Stage viewer tab switch (1-5)
    if (e.key >= '1' && e.key <= '5') {
      e.preventDefault();
      const stageIdx = parseInt(e.key) - 1;
      const stage = STAGES[stageIdx];
      if (stage && stageViewerData && stageViewerData.stages && stageViewerData.stages[stage.key]) {
        switchStageViewerTab(stage.key);
      }
    }
    // Classroom mode: arrows navigate questions, Enter/Escape for choices
    else if (stageViewerIsClassroom && stageViewerActiveKey !== 'concept') {
      // Skip if focused on write input
      if (document.activeElement?.id === 'svWriteInput') return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateClassroomQ(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateClassroomQ(1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (svSelectedChoice >= 0) submitChoiceAnswer();
      } else if (e.key === 'Escape') {
        if (svSelectedChoice >= 0) {
          e.preventDefault();
          e.stopPropagation();
          svSelectedChoice = -1;
          renderClassroomQuestion();
        }
      }
    }
    // Space/Enter to advance concept chat in stage viewer
    else if ((e.key === ' ' || e.key === 'Enter') && stageViewerActiveKey === 'concept') {
      e.preventDefault();
      advanceConceptChat();
    }
    // Left/Right arrow to switch stage tabs (admin mode)
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const currentIdx = STAGES.findIndex(s => s.key === stageViewerActiveKey);
      const dir = e.key === 'ArrowLeft' ? -1 : 1;
      let nextIdx = currentIdx + dir;
      // Skip stages without content
      while (nextIdx >= 0 && nextIdx < STAGES.length) {
        const nextStage = STAGES[nextIdx];
        if (stageViewerData && stageViewerData.stages && stageViewerData.stages[nextStage.key]) {
          switchStageViewerTab(nextStage.key);
          break;
        }
        nextIdx += dir;
      }
    }
    return;
  }

  // Only handle in units tab
  const unitsTab = document.getElementById('tab-units');
  if (!unitsTab.classList.contains('active')) return;

  if (!currentUnit) return;

  // Number keys 1-5: jump to stage directly
  if (e.key >= '1' && e.key <= '5') {
    e.preventDefault();
    const stageIdx = parseInt(e.key) - 1;
    const stageKey = STAGES[stageIdx].key;
    const available = currentUnit.stages && currentUnit.stages[stageKey];
    if (available) {
      currentStageIdx = stageIdx;
      updateStepper();
      renderStageContent();
    }
  }
  // Space or Enter: advance concept chat
  else if (e.key === ' ' || e.key === 'Enter') {
    const stage = STAGES[currentStageIdx];
    if (stage.key === 'concept') {
      e.preventDefault();
      advanceConceptChat();
    }
  }
  // Arrow keys: stage and unit navigation
  else if (e.key === 'ArrowLeft') { e.preventDefault(); prevStageBtn.click(); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); nextStageBtn.click(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); navigateUnit(-1); }
  else if (e.key === 'ArrowDown') { e.preventDefault(); navigateUnit(1); }
});

function navigateUnit(direction) {
  if (!currentUnit) return;
  const currentIdx = unitsIndex.findIndex(u => u.id === currentUnit.id);
  const nextIdx = currentIdx + direction;
  if (nextIdx >= 0 && nextIdx < unitsIndex.length) {
    selectUnit(unitsIndex[nextIdx].id);
    const activeEl = unitListEl.querySelector(`[data-unit-id="${unitsIndex[nextIdx].id}"]`);
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

// ============================================
// MOBILE SIDEBAR TOGGLE
// ============================================

function isMobile() {
  return window.innerWidth <= 768;
}

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const classroomSidebarBackdrop = document.getElementById('classroomSidebarBackdrop');
const sidebarEl = document.getElementById('sidebar');
const classroomSidebarEl = document.getElementById('classroomSidebar');

function toggleSidebar() {
  // Determine which tab is active
  const isClassroomTab = document.getElementById('tab-classrooms').classList.contains('active');

  if (isClassroomTab) {
    classroomSidebarEl.classList.toggle('open');
    classroomSidebarBackdrop.classList.toggle('active');
  } else {
    sidebarEl.classList.toggle('open');
    sidebarBackdrop.classList.toggle('active');
  }
}

function closeSidebar() {
  sidebarEl.classList.remove('open');
  sidebarBackdrop.classList.remove('active');
  classroomSidebarEl.classList.remove('open');
  classroomSidebarBackdrop.classList.remove('active');
}

mobileMenuBtn.addEventListener('click', toggleSidebar);
sidebarBackdrop.addEventListener('click', closeSidebar);
classroomSidebarBackdrop.addEventListener('click', closeSidebar);

// Close sidebar when a unit is selected on mobile
const originalSelectUnit = selectUnit;
selectUnit = async function(unitId) {
  await originalSelectUnit(unitId);
  if (isMobile()) closeSidebar();
};

// Close sidebar when a classroom is selected on mobile
const originalSelectClassroom = selectClassroom;
selectClassroom = function(classroomId) {
  originalSelectClassroom(classroomId);
  if (isMobile()) closeSidebar();
};

// Close sidebar on tab switch
tabButtons.forEach(btn => {
  btn.addEventListener('click', closeSidebar);
});

// ============================================
// CLASSROOMS TAB
// ============================================

const CLASSROOM_STORAGE_KEY = 'grammarlab_classrooms';
const CLASSROOM_ICONS = ['🏫', '📐', '🎓', '🌟', '📘', '🔬', '🎯', '💎', '🚀', '📚'];

function loadClassrooms() {
  try {
    const saved = localStorage.getItem(CLASSROOM_STORAGE_KEY);
    classrooms = saved ? JSON.parse(saved) : [];
  } catch {
    classrooms = [];
  }
}

function saveClassrooms() {
  localStorage.setItem(CLASSROOM_STORAGE_KEY, JSON.stringify(classrooms));
}

function generateId() {
  return 'cr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// ---- Custom Modal Helpers ----
function showModal(title, placeholder) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('modalOverlay');
    const input = document.getElementById('modalInput');
    const confirmBtn = document.getElementById('modalConfirm');
    const cancelBtn = document.getElementById('modalCancel');

    document.getElementById('modalTitle').textContent = title;
    input.placeholder = placeholder || '';
    input.value = '';
    overlay.classList.remove('hidden');
    setTimeout(() => input.focus(), 100);

    function cleanup() {
      overlay.classList.add('hidden');
      confirmBtn.replaceWith(confirmBtn.cloneNode(true));
      cancelBtn.replaceWith(cancelBtn.cloneNode(true));
      input.removeEventListener('keydown', handleKey);
    }

    function handleKey(e) {
      if (e.key === 'Enter') { cleanup(); resolve(input.value.trim()); }
      if (e.key === 'Escape') { cleanup(); resolve(null); }
    }

    input.addEventListener('keydown', handleKey);
    document.getElementById('modalConfirm').addEventListener('click', () => { cleanup(); resolve(input.value.trim()); });
    document.getElementById('modalCancel').addEventListener('click', () => { cleanup(); resolve(null); });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) { cleanup(); resolve(null); } }, { once: true });
  });
}

function showConfirm(title, message) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('confirmOverlay');
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    overlay.classList.remove('hidden');

    function cleanup() {
      overlay.classList.add('hidden');
    }

    document.getElementById('confirmOk').addEventListener('click', () => { cleanup(); resolve(true); }, { once: true });
    document.getElementById('confirmCancel').addEventListener('click', () => { cleanup(); resolve(false); }, { once: true });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) { cleanup(); resolve(false); } }, { once: true });
  });
}

// ---- Create Classroom ----
document.getElementById('btnCreateClassroom').addEventListener('click', async () => {
  const name = await showModal('새 강의실 만들기', '강의실 이름을 입력하세요');
  if (!name) return;

  const classroom = {
    id: generateId(),
    name: name,
    icon: CLASSROOM_ICONS[classrooms.length % CLASSROOM_ICONS.length],
    unitIds: [],
    createdAt: new Date().toISOString(),
  };

  classrooms.push(classroom);
  saveClassrooms();
  renderClassroomList();
  selectClassroom(classroom.id);
});

// ---- Render Classroom List ----
function renderClassroomList() {
  const listEl = document.getElementById('classroomList');
  listEl.innerHTML = '';

  if (classrooms.length === 0) {
    listEl.innerHTML = `
      <div style="padding:40px 20px;text-align:center;color:var(--text-muted)">
        <div style="font-size:2.5rem;margin-bottom:12px">🏫</div>
        <p style="font-size:0.85rem;line-height:1.6">아직 강의실이 없습니다.<br>위의 <strong style="color:var(--accent)">+</strong> 버튼을 눌러<br>새 강의실을 만들어보세요.</p>
      </div>
    `;
    return;
  }

  classrooms.forEach(cr => {
    const el = document.createElement('div');
    el.className = `classroom-item${currentClassroom && currentClassroom.id === cr.id ? ' active' : ''}`;
    el.dataset.classroomId = cr.id;

    el.innerHTML = `
      <span class="classroom-icon">${cr.icon}</span>
      <div class="classroom-item-info">
        <div class="classroom-item-name">${escapeHtml(cr.name)}</div>
        <div class="classroom-item-count">${cr.unitIds.length}개 유닛</div>
      </div>
    `;

    el.addEventListener('click', () => selectClassroom(cr.id));
    listEl.appendChild(el);
  });
}

// ---- Select Classroom ----
function selectClassroom(classroomId) {
  currentClassroom = classrooms.find(c => c.id === classroomId);
  if (!currentClassroom) return;

  // Update sidebar
  document.querySelectorAll('.classroom-item').forEach(el => el.classList.remove('active'));
  const activeEl = document.querySelector(`[data-classroom-id="${classroomId}"]`);
  if (activeEl) activeEl.classList.add('active');

  // Show detail
  document.getElementById('classroomEmpty').classList.add('hidden');
  const detailEl = document.getElementById('classroomDetail');
  detailEl.classList.remove('hidden');
  detailEl.style.animation = 'none';
  detailEl.offsetHeight;
  detailEl.style.animation = '';

  renderClassroomDetail();
}

// ---- Render Classroom Detail ----
function renderClassroomDetail() {
  if (!currentClassroom) return;

  document.getElementById('classroomName').textContent = currentClassroom.name;
  document.getElementById('classroomInfo').textContent =
    `생성일: ${new Date(currentClassroom.createdAt).toLocaleDateString('ko-KR')} · ${currentClassroom.unitIds.length}개 유닛 배정됨`;

  renderAssignedUnits();
  renderAvailableUnits();
}

// ---- Render Assigned Units ----
function renderAssignedUnits() {
  const container = document.getElementById('assignedUnits');
  const countEl = document.getElementById('assignedCount');
  countEl.textContent = `${currentClassroom.unitIds.length}개`;

  if (currentClassroom.unitIds.length === 0) {
    container.innerHTML = `<div class="assigned-empty">배정된 유닛이 없습니다. 아래에서 유닛을 추가하세요.</div>`;
    return;
  }

  container.innerHTML = '';
  currentClassroom.unitIds.forEach(unitId => {
    const unitInfo = unitsIndex.find(u => u.id === unitId);
    if (!unitInfo) return;

    const card = document.createElement('div');
    card.className = 'assigned-unit-card';

    const stagesHtml = STAGES.map((stage, idx) => `
      <div class="auc-stage">
        <div class="auc-stage-circle" style="border-color:${stage.color};color:${stage.color}" data-unit-id="${unitId}" data-stage-key="${stage.key}" role="button" tabindex="0">${idx + 1}</div>
        <span class="auc-stage-label">${stage.label}</span>
      </div>
      ${idx < STAGES.length - 1 ? '<div class="auc-stage-connector"></div>' : ''}
    `).join('');

    card.innerHTML = `
      <div class="auc-top-row">
        <span class="auc-num">${unitInfo.id}</span>
        <span class="auc-title">${escapeHtml(unitInfo.title)}</span>
        <button class="auc-remove" title="제거" data-unit-id="${unitId}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="auc-stages-row">${stagesHtml}</div>
    `;

    card.querySelector('.auc-remove').addEventListener('click', () => {
      removeUnitFromClassroom(unitId);
    });

    container.appendChild(card);
  });
}

// ---- Stage circle click delegation ----
document.getElementById('assignedUnits').addEventListener('click', (e) => {
  const circle = e.target.closest('.auc-stage-circle');
  if (circle && circle.dataset.unitId && circle.dataset.stageKey) {
    openStageViewer(circle.dataset.unitId, circle.dataset.stageKey, true);
  }
});

// ---- Render Category Sidebar ----
function renderCategorySidebar() {
  const container = document.getElementById('categorySidebar');
  container.innerHTML = '';

  GRAMMAR_CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `category-btn${selectedCategory === cat.key ? ' active' : ''}`;
    btn.dataset.category = cat.key;

    // Count units in this category
    let count = 0;
    if (cat.range) {
      const [start, end] = cat.range.map(Number);
      count = unitsIndex.filter(u => {
        const n = parseInt(u.id, 10);
        return n >= start && n <= end;
      }).length;
    } else {
      count = unitsIndex.length;
    }

    btn.innerHTML = `
      <span class="cat-icon">${cat.icon}</span>
      <span class="cat-label">${cat.label}</span>
      <span class="cat-count">${count}</span>
    `;

    btn.addEventListener('click', () => {
      selectedCategory = cat.key;
      renderCategorySidebar();
      document.getElementById('addUnitSearch').value = '';
      renderAvailableUnits();
    });

    container.appendChild(btn);
  });
}

// ---- Render Level Sidebar ----
function renderLevelSidebar() {
  const container = document.getElementById('levelSidebar');
  container.innerHTML = '';

  GRAMMAR_LEVELS.forEach(lv => {
    const btn = document.createElement('button');
    btn.className = `category-btn${selectedLevel === lv.key ? ' active' : ''}`;
    btn.dataset.level = lv.key;

    const count = lv.unitIds ? lv.unitIds.length : unitsIndex.length;

    btn.innerHTML = `
      <span class="cat-icon">${lv.icon}</span>
      <span class="cat-label">${lv.label}${lv.subtitle ? ` <span class="level-subtitle">${lv.subtitle}</span>` : ''}</span>
      <span class="cat-count">${count}</span>
    `;

    btn.addEventListener('click', () => {
      selectedLevel = lv.key;
      renderLevelSidebar();
      document.getElementById('addUnitSearch').value = '';
      renderAvailableUnits();
    });

    container.appendChild(btn);
  });
}

// ---- Get filtered units based on category/level and query ----
function getFilteredUnits(query = '') {
  let units = unitsIndex;

  // Filter by grammar category (when grammar tab is active)
  if (selectedCategory !== 'all') {
    const cat = GRAMMAR_CATEGORIES.find(c => c.key === selectedCategory);
    if (cat && cat.range) {
      const [start, end] = cat.range.map(Number);
      units = units.filter(u => {
        const n = parseInt(u.id, 10);
        return n >= start && n <= end;
      });
    }
  }

  // Filter by level (when level tab is active)
  if (selectedLevel !== 'all') {
    const lv = GRAMMAR_LEVELS.find(l => l.key === selectedLevel);
    if (lv && lv.unitIds) {
      units = units.filter(u => lv.unitIds.includes(u.id));
    }
  }

  // Filter by search query
  if (query) {
    const q = query.toLowerCase();
    units = units.filter(u =>
      u.id.includes(q) || u.title.toLowerCase().includes(q)
    );
  }

  return units;
}

// ---- Render Available Units ----
function renderAvailableUnits(query = '') {
  const container = document.getElementById('availableUnits');
  const infoEl = document.getElementById('popupSelectionInfo');
  const units = getFilteredUnits(query);

  // Count how many visible units are not yet assigned
  const unassignedCount = currentClassroom
    ? units.filter(u => !currentClassroom.unitIds.includes(u.id)).length
    : 0;

  // Update "전체 추가" button state
  const addAllBtn = document.getElementById('btnAddAllVisible');
  if (addAllBtn) {
    addAllBtn.disabled = unassignedCount === 0;
    addAllBtn.textContent = unassignedCount > 0 ? `전체 추가 (${unassignedCount})` : '전체 추가됨';
  }

  // Update popup footer info
  if (infoEl && currentClassroom) {
    infoEl.textContent = `${currentClassroom.unitIds.length}개 유닛 배정됨 · ${units.length}개 표시 중`;
  }

  if (units.length === 0) {
    container.innerHTML = `<div class="avail-empty">검색 결과가 없습니다.</div>`;
    return;
  }

  container.innerHTML = '';
  units.forEach(unit => {
    const isAssigned = currentClassroom.unitIds.includes(unit.id);

    const row = document.createElement('div');
    row.className = 'avail-unit-row';
    row.innerHTML = `
      <span class="avail-num">${unit.id}</span>
      <span class="avail-title">${escapeHtml(unit.title)}</span>
      ${isAssigned
        ? '<span class="avail-already">추가됨</span>'
        : `<button class="btn-add-unit" data-unit-id="${unit.id}">추가</button>`
      }
    `;

    if (!isAssigned) {
      row.querySelector('.btn-add-unit').addEventListener('click', () => {
        addUnitToClassroom(unit.id);
      });
    }

    container.appendChild(row);
  });
}

// ---- Add All Visible Units ----
function addAllVisibleUnits() {
  if (!currentClassroom) return;
  const query = document.getElementById('addUnitSearch').value.trim();
  const units = getFilteredUnits(query);
  let added = 0;
  units.forEach(u => {
    if (!currentClassroom.unitIds.includes(u.id)) {
      currentClassroom.unitIds.push(u.id);
      added++;
    }
  });
  if (added > 0) {
    saveClassrooms();
    renderClassroomDetail();
    renderClassroomList();
    renderAvailableUnits(query);
  }
}

// ---- Add / Remove Unit ----
function addUnitToClassroom(unitId) {
  if (!currentClassroom || currentClassroom.unitIds.includes(unitId)) return;
  currentClassroom.unitIds.push(unitId);
  saveClassrooms();
  renderClassroomDetail();
  renderClassroomList();
}

function removeUnitFromClassroom(unitId) {
  if (!currentClassroom) return;
  currentClassroom.unitIds = currentClassroom.unitIds.filter(id => id !== unitId);
  saveClassrooms();
  renderClassroomDetail();
  renderClassroomList();
}

// ---- Edit Classroom Name ----
document.getElementById('btnEditName').addEventListener('click', () => {
  const nameEl = document.getElementById('classroomName');
  const isEditing = nameEl.getAttribute('contenteditable') === 'true';

  if (isEditing) {
    // Save
    nameEl.setAttribute('contenteditable', 'false');
    const newName = nameEl.textContent.trim();
    if (newName && currentClassroom) {
      currentClassroom.name = newName;
      saveClassrooms();
      renderClassroomList();
    }
  } else {
    // Start editing
    nameEl.setAttribute('contenteditable', 'true');
    nameEl.focus();

    // Select all text
    const range = document.createRange();
    range.selectNodeContents(nameEl);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
});

// Save name on Enter
document.getElementById('classroomName').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('btnEditName').click();
  }
});

// ---- Delete Classroom ----
document.getElementById('btnDeleteClassroom').addEventListener('click', async () => {
  if (!currentClassroom) return;
  const ok = await showConfirm('강의실 삭제', `"${currentClassroom.name}" 강의실을 삭제하시겠습니까?`);
  if (!ok) return;

  classrooms = classrooms.filter(c => c.id !== currentClassroom.id);
  currentClassroom = null;
  saveClassrooms();
  renderClassroomList();

  document.getElementById('classroomDetail').classList.add('hidden');
  document.getElementById('classroomEmpty').classList.remove('hidden');
});

// ---- Add Unit Popup ----
function openAddUnitsPopup() {
  const overlay = document.getElementById('addUnitsOverlay');
  const searchInput = document.getElementById('addUnitSearch');
  overlay.classList.remove('hidden');
  searchInput.value = '';
  selectedCategory = 'all';

  // Reset filter tabs to grammar
  document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tabGrammar').classList.add('active');
  document.getElementById('categorySidebar').classList.remove('hidden');
  document.getElementById('levelSidebar').classList.add('hidden');

  renderCategorySidebar();
  renderAvailableUnits();
  setTimeout(() => searchInput.focus(), 100);
}

function closeAddUnitsPopup() {
  document.getElementById('addUnitsOverlay').classList.add('hidden');
}

document.getElementById('btnOpenAddUnits').addEventListener('click', openAddUnitsPopup);
document.getElementById('btnCloseAddUnits').addEventListener('click', closeAddUnitsPopup);
document.getElementById('btnAddUnitsCancel').addEventListener('click', closeAddUnitsPopup);
document.getElementById('addUnitsOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('addUnitsOverlay')) closeAddUnitsPopup();
});

// ---- Add All Visible button ----
document.getElementById('btnAddAllVisible').addEventListener('click', addAllVisibleUnits);

// ---- Filter Tab Switching (문법 / 레벨) ----
document.querySelectorAll('.category-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const target = tab.dataset.filterTab;
    document.getElementById('categorySidebar').classList.toggle('hidden', target !== 'grammar');
    document.getElementById('levelSidebar').classList.toggle('hidden', target !== 'level');

    if (target === 'grammar') {
      selectedLevel = 'all';
      selectedCategory = 'all';
      renderCategorySidebar();
      renderAvailableUnits();
    } else if (target === 'level') {
      selectedCategory = 'all';
      selectedLevel = 'all';
      renderLevelSidebar();
      renderAvailableUnits();
    }
  });
});

// ---- Add Unit Search ----
document.getElementById('addUnitSearch').addEventListener('input', (e) => {
  renderAvailableUnits(e.target.value.trim());
});

// ---- Start ----
init();

// ============================================
// STAGE VIEWER POPUP
// ============================================

let stageViewerData = null; // holds the loaded unit data for the viewer
let stageViewerActiveKey = null; // current active stage key in viewer
let stageViewerAnswersVisible = true;
let stageViewerIsClassroom = false; // true when opened from classroom tab

// Classroom single-question mode state
let svQuestions = []; // parsed questions array
let svCurrentQIdx = 0; // current question index
let svAnswerRevealed = false; // whether current question's answer is shown
let svAllCompleted = false; // whether user has reached the last question

function openStageViewer(unitId, stageKey, isClassroom = false) {
  const overlay = document.getElementById('stageViewerOverlay');
  stageViewerIsClassroom = isClassroom;

  // Show loading
  document.getElementById('svUnitBadge').textContent = unitId;
  document.getElementById('svTitle').textContent = '불러오는 중...';
  document.getElementById('svBody').innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-muted)">로딩 중...</div>';
  document.getElementById('svStageTabs').innerHTML = '';
  overlay.classList.remove('hidden');

  // Add fullscreen class for classroom mode
  const popup = overlay.querySelector('.stage-viewer-popup');
  if (isClassroom) {
    popup.classList.add('sv-fullscreen');
  } else {
    popup.classList.remove('sv-fullscreen');
  }

  // Reset answer toggle
  stageViewerAnswersVisible = true;
  document.getElementById('svAnswerToggle').checked = true;
  document.getElementById('svToggleLabel').textContent = '정답 보기';

  fetch(`public/data/units/${unitId}.json`)
    .then(r => r.json())
    .then(data => {
      stageViewerData = data;
      document.getElementById('svTitle').textContent = data.title;
      renderStageViewerTabs(stageKey);
      switchStageViewerTab(stageKey);
    })
    .catch(err => {
      console.error('Failed to load unit for viewer:', err);
      document.getElementById('svBody').innerHTML =
        '<div style="text-align:center;padding:60px;color:var(--step-5)">데이터를 불러올 수 없습니다.</div>';
    });
}

function closeStageViewer() {
  document.getElementById('stageViewerOverlay').classList.add('hidden');
  document.getElementById('stageViewerOverlay').querySelector('.stage-viewer-popup')?.classList.remove('sv-fullscreen');
  stageViewerData = null;
  stopTTS();
}

function renderStageViewerTabs(activeKey) {
  const container = document.getElementById('svStageTabs');
  container.innerHTML = '';

  STAGES.forEach((stage, idx) => {
    const hasContent = stageViewerData.stages && stageViewerData.stages[stage.key];
    const btn = document.createElement('button');
    btn.className = `sv-tab${stage.key === activeKey ? ' active' : ''}${!hasContent ? ' disabled' : ''}`;
    btn.dataset.stageKey = stage.key;
    btn.style.setProperty('--tab-color', stage.color);
    btn.innerHTML = `<span class="sv-tab-num">${idx + 1}</span>${stage.label}`;

    if (hasContent) {
      btn.addEventListener('click', () => switchStageViewerTab(stage.key));
    }

    container.appendChild(btn);
  });
}

function switchStageViewerTab(stageKey) {
  stageViewerActiveKey = stageKey;

  // Update tab active state
  document.querySelectorAll('.sv-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.stageKey === stageKey);
  });

  renderStageViewerContent();
}

function renderStageViewerContent() {
  const body = document.getElementById('svBody');
  const md = stageViewerData.stages ? stageViewerData.stages[stageViewerActiveKey] : null;

  if (!md) {
    body.innerHTML = `
      <div style="text-align:center;padding:60px 0;color:var(--text-secondary)">
        <div style="font-size:3rem;margin-bottom:12px">📭</div>
        <p>이 단계의 콘텐츠가 없습니다.</p>
      </div>
    `;
    return;
  }

  // Use interactive mode for concept stage
  if (stageViewerActiveKey === 'concept') {
    document.querySelector('.sv-toggle').style.display = 'none';
    renderConceptInteractive(body);
    return;
  }

  // Classroom mode: single-question card view
  if (stageViewerIsClassroom) {
    document.querySelector('.sv-toggle').style.display = 'none';
    svQuestions = parseQuestionsFromMarkdown(md);
    svCurrentQIdx = 0;
    svAnswerRevealed = false;
    svAllCompleted = false;
    svSelectedChoice = [];
    svResults = new Array(svQuestions.length).fill(null); // null=unanswered, true=correct, false=wrong
    svUserAnswers = new Array(svQuestions.length).fill('');
    svShowingResult = false;
    renderClassroomQuestion();
    return;
  }

  // Admin mode: show all questions with answer toggle
  document.querySelector('.sv-toggle').style.display = '';
  const html = renderStageViewerMarkdown(md);
  body.innerHTML = html;
  body.scrollTop = 0;
  applyAnswerVisibility();
}

// ---- Classroom Interactive Question Mode ----

let svSelectedChoice = []; // array of selected indices (toggle mode)
let svResults = [];
let svUserAnswers = [];
let svShowingResult = false;

function parseQuestionsFromMarkdown(md) {
  const sections = md.split(/\n---\n/);
  const questions = [];

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    const lines = trimmed.split('\n');
    let bodyLines = [];
    let answerLines = [];
    let inAnswer = false;
    let questionNum = '';

    for (const line of lines) {
      const t = line.trim();
      if (/^#\s/.test(t) && bodyLines.length === 0 && !questionNum) continue;

      const numMatch = t.match(/^\*\*(\d{2})\.\*\*/);
      if (numMatch) questionNum = numMatch[1];

      if (/^>\s*\*\*정답\*\*/.test(t) || /^>\s*정답[:：]?/.test(t) || /^정답[:：]?\s/.test(t)) {
        inAnswer = true;
        answerLines.push(line);
        continue;
      }
      if (inAnswer) {
        if (/^>/.test(t)) { answerLines.push(line); continue; }
        inAnswer = false;
      }
      bodyLines.push(line);
    }

    if (!questionNum && bodyLines.length === 0) continue;

    // Extract clean answer text
    let answerRaw = answerLines.join('\n').trim();
    let answerClean = answerRaw
      .replace(/^>\s*\*\*정답\*\*\s*/gm, '')
      .replace(/^>\s*정답[:：]?\s*/gm, '')
      .replace(/^정답[:：]?\s*/gm, '')
      .replace(/^>\s*/gm, '')
      .trim();

    const bodyText = bodyLines.join('\n').trim();

    // Detect question type and parse choices
    const parsed = detectQuestionType(bodyText, answerClean);

    // Detect required answer count from body text (e.g. [2개])
    const multiMatch = bodyText.match(/\[(\d+)개\]/);
    const requiredCount = multiMatch ? parseInt(multiMatch[1]) : 1;

    questions.push({
      num: questionNum,
      body: parsed.bodyText,
      answer: answerClean,
      type: parsed.type,
      choices: parsed.choices,
      requiredCount: parsed.type === 'choice' ? requiredCount : 1
    });
  }

  return questions;
}

function detectQuestionType(bodyText, answer) {
  const lines = bodyText.split('\n');

  // 1. Check for "보기: A / B / C" pattern
  const bogiIdx = lines.findIndex(l => /^보기[:：]\s*/.test(l.trim()));
  if (bogiIdx !== -1) {
    const bogiLine = lines[bogiIdx].trim();
    const choicesStr = bogiLine.replace(/^보기[:：]\s*/, '');
    const choices = choicesStr.split(/\s*\/\s*/).map(c => c.trim()).filter(c => c);
    if (choices.length >= 2) {
      const newBody = lines.filter((_, i) => i !== bogiIdx).join('\n');
      return { type: 'choice', choices, bodyText: newBody };
    }
  }

  // 2. Check for practical-style choices: consecutive short lines at the end
  // Pattern: question instruction lines, then several option lines
  const instructionEnd = findLastInstructionLine(lines);
  if (instructionEnd >= 0 && instructionEnd < lines.length - 1) {
    const optionLines = lines.slice(instructionEnd + 1).filter(l => l.trim());
    // Check if these look like choices (2-4 short lines, not question text)
    if (optionLines.length >= 2 && optionLines.length <= 8) {
      const allShort = optionLines.every(l => l.trim().length < 120);
      const hasQuestionKeywords = /고르시오|고르세요|짝지어진|대답을|대답문/.test(lines.slice(0, instructionEnd + 1).join(' '));
      if (allShort && hasQuestionKeywords) {
        const choices = optionLines.map(l => l.trim());
        const newBody = lines.slice(0, instructionEnd + 1).join('\n');
        return { type: 'choice', choices, bodyText: newBody };
      }
    }
  }

  // 3. Default: write-in
  return { type: 'write', choices: [], bodyText };
}

function findLastInstructionLine(lines) {
  // Find the last line that looks like question instruction text
  // (before the options start). Instruction lines typically contain
  // question number, directions, or the question sentence itself.
  let lastInstruction = -1;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t) continue;
    // Lines with question-like patterns
    if (/^\*\*\d{2}\.\*\*/.test(t) || /고르시오|쓰시오|고쳐쓰세요|완성하시오|짝지어진|바꾸어|바꿔|배열하여/.test(t)
      || /\[.+개\]/.test(t) || t.startsWith('Q:') || t.startsWith('A:')
      || /^•/.test(t) || /^\(/.test(t) || /^!\[/.test(t)
      || /_{3,}/.test(t) || /\(\s{3,}\)/.test(t)) {
      lastInstruction = i;
    }
    // If line contains sentence with period + uppercase (English sentence), could be question body or option
    // For lines with the fill blank indicator
    if (/_{3,}/.test(t) || /\(\s{3,}\)/.test(t)) {
      lastInstruction = i;
    }
  }
  // Heuristic: find where "option-like" short lines begin
  for (let i = lines.length - 1; i > 0; i--) {
    const t = lines[i].trim();
    if (!t) continue;
    // If this line looks like a question instruction, return it
    if (/^\*\*\d{2}\.\*\*/.test(t) || /고르시오|쓰시오|고쳐쓰세요|완성하시오/.test(t)
      || /_{3,}/.test(t) || /\(\s{3,}\)/.test(t) || t.startsWith('Q:') || t.startsWith('A:')
      || /^•/.test(t) || /^\(/.test(t) || /^!\[/.test(t)) {
      return i;
    }
  }
  // Fallback: look for a natural break — last long or question-like line
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (/고르시오|쓰시오|고쳐쓰세요|고르세요|짝지어진|대답을/.test(t)) {
      // Find the line with the actual question sentence (e.g., the English sentence with blanks)
      // Everything after is options
      for (let j = i + 1; j < lines.length; j++) {
        const jt = lines[j].trim();
        if (!jt) continue;
        // If this is a sentence line (part of the question context), keep going
        if (/[.?!]$/.test(jt) || /_{3,}/.test(jt) || /\(\s{3,}\)/.test(jt) || /^[A-Z]/.test(jt)) {
          lastInstruction = j;
        } else {
          break;
        }
      }
      if (lastInstruction > i) return lastInstruction;
      return i;
    }
  }
  return lastInstruction;
}

function renderClassroomQuestion() {
  const body = document.getElementById('svBody');
  const total = svQuestions.length;

  // Check if all questions are answered — show results
  const answeredCount = svResults.filter(r => r !== null).length;
  if (answeredCount >= total && !svShowingResult) {
    renderStageResults();
    return;
  }

  const q = svQuestions[svCurrentQIdx];
  if (!q) return;

  const current = svCurrentQIdx + 1;
  const progress = (answeredCount / total) * 100;
  const thisResult = svResults[svCurrentQIdx];
  const isAnswered = thisResult !== null;

  // Render question body
  const bodyHtml = renderStageViewerMarkdown(q.body);

  // Build interactive area
  let interactiveHtml = '';

  if (isAnswered) {
    // Already answered — show result
    const correct = thisResult === true;
    interactiveHtml = `
      <div class="sv-q-result ${correct ? 'correct' : 'wrong'}">
        <div class="sv-q-result-icon">${correct ? '✅' : '❌'}</div>
        <div class="sv-q-result-text">${correct ? '정답! 잘했어요!' : '아쉬워요!'}</div>
        ${!correct ? `<div class="sv-q-result-answer">정답: <strong>${escapeHtml(q.answer)}</strong></div>` : ''}
        ${!correct && svUserAnswers[svCurrentQIdx] ? `<div class="sv-q-result-yours">내 답: ${escapeHtml(svUserAnswers[svCurrentQIdx])}</div>` : ''}
      </div>
    `;
  } else if (q.type === 'choice' && q.choices.length > 0) {
    // Choice question — render numbered buttons (toggle mode for multi-select)
    const isMulti = q.requiredCount > 1;
    const choiceBtns = q.choices.map((c, i) => `
      <button class="sv-choice-btn${svSelectedChoice.includes(i) ? ' selected' : ''}" data-idx="${i}">
        <span class="sv-choice-num">${i + 1}</span>
        <span class="sv-choice-text">${escapeHtml(c)}</span>
      </button>
    `).join('');

    const hasSelection = svSelectedChoice.length > 0;
    const selectionLabels = svSelectedChoice.map(i => (i + 1) + '번').join(', ');
    const enoughSelected = svSelectedChoice.length >= q.requiredCount;

    const confirmBar = hasSelection ? `
      <div class="sv-confirm-bar">
        <span class="sv-confirm-text">${selectionLabels} 선택${isMulti ? ` (${svSelectedChoice.length}/${q.requiredCount}개)` : ''}</span>
        <button class="sv-confirm-cancel" id="svCancelChoice">취소</button>
        <button class="sv-confirm-submit${enoughSelected ? '' : ' disabled'}" id="svSubmitChoice" ${enoughSelected ? '' : 'disabled'}>✓ 제출</button>
      </div>
    ` : (isMulti ? `<div class="sv-multi-hint">${q.requiredCount}개를 선택하세요</div>` : '');

    interactiveHtml = `
      <div class="sv-choices-area">${choiceBtns}</div>
      ${confirmBar}
    `;
  } else {
    // Write-in question — render input field
    interactiveHtml = `
      <div class="sv-write-area">
        <div class="sv-write-input-wrap">
          <input type="text" id="svWriteInput" class="sv-write-input" placeholder="정답을 입력하세요..." autocomplete="off" autocapitalize="off" spellcheck="false">
          <button class="sv-write-submit" id="svSubmitWrite">제출 ↵</button>
        </div>
      </div>
    `;
  }

  // Nav dots with status
  const dots = svQuestions.map((_, i) => {
    let cls = 'sv-q-dot';
    if (i === svCurrentQIdx) cls += ' active';
    if (svResults[i] === true) cls += ' correct';
    else if (svResults[i] === false) cls += ' wrong';
    return `<div class="${cls}"></div>`;
  }).join('');

  body.innerHTML = `
    <div class="sv-classroom">
      <div class="sv-progress-area">
        <div class="sv-progress-bar">
          <div class="sv-progress-fill" style="width:${progress}%"></div>
        </div>
        <span class="sv-progress-text">${answeredCount} / ${total} 풀이 완료</span>
      </div>

      <div class="sv-question-card">
        <div class="sv-q-badge">
          <span class="sv-q-num">📝 ${q.num || current}번</span>
        </div>
        <div class="sv-q-body">${bodyHtml}</div>
        <div class="sv-q-interactive">${interactiveHtml}</div>
      </div>

      <div class="sv-q-nav">
        <button class="sv-q-nav-btn" id="svPrevQ" ${svCurrentQIdx === 0 ? 'disabled' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>
          이전
        </button>
        <div class="sv-q-nav-dots">${dots}</div>
        <button class="sv-q-nav-btn sv-q-nav-next" id="svNextQ" ${svCurrentQIdx >= total - 1 ? 'disabled' : ''}>
          다음
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  `;

  // Attach event listeners
  document.getElementById('svPrevQ')?.addEventListener('click', () => navigateClassroomQ(-1));
  document.getElementById('svNextQ')?.addEventListener('click', () => navigateClassroomQ(1));

  // Choice buttons — toggle mode
  document.querySelectorAll('.sv-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      toggleChoiceSelection(idx);
    });
  });

  // Choice confirm/cancel
  document.getElementById('svCancelChoice')?.addEventListener('click', () => {
    svSelectedChoice = [];
    renderClassroomQuestion();
  });
  document.getElementById('svSubmitChoice')?.addEventListener('click', () => submitChoiceAnswer());

  // Write-in input
  const writeInput = document.getElementById('svWriteInput');
  if (writeInput) {
    writeInput.focus();
    writeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitWriteAnswer(writeInput.value.trim());
      }
    });
  }
  document.getElementById('svSubmitWrite')?.addEventListener('click', () => {
    const val = document.getElementById('svWriteInput')?.value?.trim();
    if (val) submitWriteAnswer(val);
  });
}

function toggleChoiceSelection(idx) {
  const q = svQuestions[svCurrentQIdx];
  if (!q || svResults[svCurrentQIdx] !== null) return;

  const pos = svSelectedChoice.indexOf(idx);
  if (pos >= 0) {
    // Deselect
    svSelectedChoice.splice(pos, 1);
  } else {
    if (q.requiredCount === 1) {
      // Single select: replace
      svSelectedChoice = [idx];
    } else {
      // Multi select: add (up to requiredCount)
      if (svSelectedChoice.length < q.requiredCount) {
        svSelectedChoice.push(idx);
      } else {
        // Replace oldest selection
        svSelectedChoice.shift();
        svSelectedChoice.push(idx);
      }
    }
  }
  renderClassroomQuestion();
}

function submitChoiceAnswer() {
  const q = svQuestions[svCurrentQIdx];
  if (svSelectedChoice.length < q.requiredCount) return;

  const selectedTexts = svSelectedChoice.map(i => q.choices[i]);
  const userAnswer = selectedTexts.join(', ');
  svUserAnswers[svCurrentQIdx] = userAnswer;

  const correct = gradeAnswer(selectedTexts, q.answer, 'choice');
  svResults[svCurrentQIdx] = correct;
  svSelectedChoice = [];
  renderClassroomQuestion();

  // Auto-advance after delay if correct
  if (correct) {
    setTimeout(() => {
      const nextUnanswered = svResults.findIndex((r, i) => r === null && i > svCurrentQIdx);
      if (nextUnanswered >= 0) {
        svCurrentQIdx = nextUnanswered;
        renderClassroomQuestion();
      } else if (svResults.every(r => r !== null)) {
        renderClassroomQuestion(); // triggers results
      }
    }, 1200);
  }
}

function submitWriteAnswer(userText) {
  const q = svQuestions[svCurrentQIdx];
  svUserAnswers[svCurrentQIdx] = userText;

  const correct = gradeAnswer(userText, q.answer, 'write');
  svResults[svCurrentQIdx] = correct;
  renderClassroomQuestion();

  if (correct) {
    setTimeout(() => {
      const nextUnanswered = svResults.findIndex((r, i) => r === null && i > svCurrentQIdx);
      if (nextUnanswered >= 0) {
        svCurrentQIdx = nextUnanswered;
        renderClassroomQuestion();
      } else if (svResults.every(r => r !== null)) {
        renderClassroomQuestion();
      }
    }, 1200);
  }
}

function gradeAnswer(userInput, correctAnswer, type) {
  const normalize = (s) => s.toLowerCase()
    .replace(/[.,!?;:'"()（）\[\]{}→←·•\-–—]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (type === 'choice') {
    // userInput is an array of selected texts
    const userTexts = (Array.isArray(userInput) ? userInput : [userInput]).map(t => normalize(t));
    // correctAnswer may be comma-separated for multi-answer
    const correctParts = correctAnswer.split(/[,，]\.?\s*/).map(p => normalize(p)).filter(p => p);

    // Check if all correct answers are matched
    if (userTexts.length !== correctParts.length) return false;

    // For each correct part, check if any user selection matches
    const matchedCorrect = correctParts.every(cp =>
      userTexts.some(ut => ut.includes(cp) || cp.includes(ut))
    );
    const matchedUser = userTexts.every(ut =>
      correctParts.some(cp => ut.includes(cp) || cp.includes(ut))
    );
    return matchedCorrect && matchedUser;
  }

  // Write-in grading
  const user = normalize(Array.isArray(userInput) ? userInput.join(', ') : userInput);
  const correct = normalize(correctAnswer);

  if (user === correct) return true;

  // Handle comma/space-separated answers
  const userParts = user.split(/[,，\s]+/).filter(p => p);
  const correctParts = correct.split(/[,，\s]+/).filter(p => p);
  if (userParts.length === correctParts.length && userParts.every((p, i) => p === correctParts[i])) return true;

  return false;
}

function renderStageResults() {
  svShowingResult = true;
  const body = document.getElementById('svBody');
  const total = svQuestions.length;
  const correctCount = svResults.filter(r => r === true).length;
  const score = Math.round((correctCount / total) * 100);

  let emoji = '🏆';
  let message = '훌륭해요!';
  if (score < 50) { emoji = '💪'; message = '다시 도전해 볼까요?'; }
  else if (score < 80) { emoji = '👍'; message = '잘했어요!'; }

  const wrongItems = svQuestions
    .map((q, i) => ({ q, i, result: svResults[i] }))
    .filter(item => item.result === false)
    .map(item => `
      <div class="sv-result-item wrong">
        <span class="sv-result-item-num">${item.q.num || (item.i + 1)}번</span>
        <span class="sv-result-item-yours">내 답: ${escapeHtml(svUserAnswers[item.i])}</span>
        <span class="sv-result-item-correct">정답: ${escapeHtml(item.q.answer)}</span>
      </div>
    `).join('');

  body.innerHTML = `
    <div class="sv-classroom">
      <div class="sv-results-card">
        <div class="sv-results-emoji">${emoji}</div>
        <div class="sv-results-message">${message}</div>
        <div class="sv-results-score">
          <span class="sv-results-correct">${correctCount}</span>
          <span class="sv-results-divider">/</span>
          <span class="sv-results-total">${total}</span>
          <span class="sv-results-label">정답</span>
        </div>
        <div class="sv-results-percent">${score}%</div>
        <div class="sv-results-bar">
          <div class="sv-results-bar-fill" style="width:${score}%"></div>
        </div>

        ${wrongItems ? `
          <div class="sv-results-wrong-section">
            <div class="sv-results-wrong-title">❌ 틀린 문제</div>
            ${wrongItems}
          </div>
        ` : ''}

        <div class="sv-results-actions">
          <button class="sv-results-retry" id="svRetryStage">🔄 다시 풀기</button>
          <button class="sv-results-review" id="svReviewAll">📋 전체 리뷰</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('svRetryStage')?.addEventListener('click', () => {
    svShowingResult = false;
    renderStageViewerContent();
  });

  document.getElementById('svReviewAll')?.addEventListener('click', () => {
    svShowingResult = false;
    svCurrentQIdx = 0;
    renderClassroomQuestion();
  });
}

function navigateClassroomQ(dir) {
  const newIdx = svCurrentQIdx + dir;
  if (newIdx < 0 || newIdx >= svQuestions.length) return;
  svCurrentQIdx = newIdx;
  svSelectedChoice = [];
  renderClassroomQuestion();
}

function renderStageViewerMarkdown(md) {
  let html = escapeHtml(md);

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^---$/gm, '<hr>');

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '<br>');

  // Bold & underline
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/&lt;u&gt;(.+?)&lt;\/u&gt;/g, '<u>$1</u>');
  html = html.replace(/!\[([^\]]*?)\]\(([^)]+?)\)/g, '<img class="q-image" src="$2" alt="$1">');
  html = html.replace(/\(\s{3,}\)/g, '<span class="fill-blank">(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)</span>');
  html = html.replace(/^보기:\s*(.+)$/gm, function(match, opts) {
    var chips = opts.split(/\s*\/\s*/).map(function(o) { return '<span class="choice-chip">' + o.trim() + '</span>'; }).join('');
    return '<div class="choice-options"><span class="choice-label">보기</span>' + chips + '</div>';
  });

  // Question Numbers
  html = html.replace(/<strong>(\d{2})\.<\/strong>/g, '<span class="q-number">$1</span>');

  // Emojis
  html = html.replace(/👩‍🏫/g, '<span style="font-size:1.2em">👩‍🏫</span>');
  html = html.replace(/🧑‍🎓/g, '<span style="font-size:1.2em">🧑‍🎓</span>');
  html = html.replace(/✅/g, '<span style="color:var(--accent)">✅</span>');

  // Wrap answer lines — handle all formats:
  // 1. "> **정답** ..." → <blockquote><strong>정답</strong> ...</blockquote>
  // 2. "> 정답: ..." or "> 정답 ..." → <blockquote>정답: ...</blockquote>
  // 3. "정답 ..." (plain line)
  html = html.replace(
    /<blockquote><strong>정답<\/strong>\s*(.+?)<\/blockquote>/g,
    '<div class="sv-answer"><span class="sv-answer-label">✅ 정답:</span> $1</div>'
  );
  html = html.replace(
    /<blockquote>\s*정답[:：]?\s*(.+?)<\/blockquote>/g,
    '<div class="sv-answer"><span class="sv-answer-label">✅ 정답:</span> $1</div>'
  );
  html = html.replace(
    /^정답[:：]?\s+(.+?)$/gm,
    '<div class="sv-answer"><span class="sv-answer-label">✅ 정답:</span> $1</div>'
  );

  // Newlines
  html = html.replace(/\n/g, '<br>');
  html = html.replace(/(<br>){3,}/g, '<br><br>');
  html = html.replace(/<\/h[123]><br>/g, '</h1>');
  html = html.replace(/<hr><br>/g, '<hr>');

  return html;
}

function applyAnswerVisibility() {
  const body = document.getElementById('svBody');
  if (!body) return;
  const answers = body.querySelectorAll('.sv-answer');
  answers.forEach(el => {
    if (stageViewerAnswersVisible) {
      el.classList.remove('sv-answer-hidden');
    } else {
      el.classList.add('sv-answer-hidden');
    }
  });
}

// Toggle answer visibility
document.getElementById('svAnswerToggle').addEventListener('change', (e) => {
  stageViewerAnswersVisible = e.target.checked;
  document.getElementById('svToggleLabel').textContent = stageViewerAnswersVisible ? '정답 보기' : '정답 숨김';
  applyAnswerVisibility();
});

// Close button
document.getElementById('btnCloseStageViewer').addEventListener('click', closeStageViewer);

// Close on overlay click
document.getElementById('stageViewerOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('stageViewerOverlay')) closeStageViewer();
});

// Classroom-mode keyboard navigation for single-question view
// (integrated into main keydown handler above)

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !document.getElementById('stageViewerOverlay').classList.contains('hidden')) {
    closeStageViewer();
  }
});


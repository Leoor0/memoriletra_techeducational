// Utilidades
function normalize(s){ return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }
function speak(text){
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'pt-BR'; window.speechSynthesis.speak(u);
}

// Dataset (minimal MVP). Emoji usado como figura.
const DATASET = {
  animais: [
    { emoji: "🐶", palavra: "cachorro" },
    { emoji: "🐱", palavra: "gato" },
    { emoji: "🦁", palavra: "leão" },
    { emoji: "🐮", palavra: "vaca" },
    { emoji: "🐰", palavra: "coelho" },
    { emoji: "🐸", palavra: "sapo" },
  ],
  frutas: [
    { emoji: "🍎", palavra: "maçã" },
    { emoji: "🍌", palavra: "banana" },
    { emoji: "🍇", palavra: "uva" },
    { emoji: "🍊", palavra: "laranja" },
    { emoji: "🍍", palavra: "abacaxi" },
    { emoji: "🍉", palavra: "melancia" },
  ],
  objetos: [
    { emoji: "✏️", palavra: "lápis" },
    { emoji: "📚", palavra: "livro" },
    { emoji: "✂️", palavra: "tesoura" },
    { emoji: "📏", palavra: "régua" },
    { emoji: "🖍️", palavra: "giz" },
    { emoji: "🖊️", palavra: "caneta" },
  ],
  cores_formas: [
    { emoji: "🟥", palavra: "vermelho" },
    { emoji: "🟦", palavra: "azul" },
    { emoji: "🟩", palavra: "verde" },
    { emoji: "⚪", palavra: "círculo" },
    { emoji: "🔺", palavra: "triângulo" },
    { emoji: "🟨", palavra: "amarelo" },
  ],
  numeros: [
    { emoji: "1️⃣", palavra: "um" },
    { emoji: "2️⃣", palavra: "dois" },
    { emoji: "3️⃣", palavra: "três" },
    { emoji: "4️⃣", palavra: "quatro" },
    { emoji: "5️⃣", palavra: "cinco" },
    { emoji: "6️⃣", palavra: "seis" },
  ]
};

// Parsing de parâmetros
const url = new URL(window.location.href);
const fase = parseInt(url.searchParams.get('fase') || '1', 10);
const tema = url.searchParams.get('tema') || 'animais';
qs('#faseLabel').textContent = fase;
qs('#temaLabel').textContent = tema.replace('_', ' ');
qs('#year').textContent = new Date().getFullYear();

// Grade por fase
const GRID = {
  1: [2,2],    // 2x2 (2 pares)
  2: [3,2],    // 3x2 (3 pares)
  3: [3,4],    // 3x4 (6 pares)
  4: [4,4],    // 4x4 (8 pares)
};
const [cols, rows] = GRID[fase] || GRID[1];
qs('#board').style.gridTemplateColumns = `repeat(${cols}, minmax(60px, 1fr))`;

// Escolha das cartas
function pickPairs(source, pairs){
  const shuffled = [...source].sort(()=>Math.random()-0.5).slice(0, pairs);
  // duplicar para virar pares
  const cards = shuffled.flatMap((item, idx) => [
    { id: idx+'a', ...item }, { id: idx+'b', ...item }
  ]);
  // embaralhar
  return cards.sort(()=>Math.random()-0.5);
}

const totalPairs = (cols*rows)/2;
const pool = DATASET[tema] || DATASET.animais;
const deck = pickPairs(pool, Math.min(totalPairs, pool.length));

// Estado do jogo
let first = null, lock = false;
let stars = 0;
let currentMatchedWord = null;
let lastMatchedItem = null;
const events = []; // para relatório CSV

// Render
const board = qs('#board');
deck.forEach(card => {
  const el = document.createElement('button');
  el.className = 'card-tile';
  el.setAttribute('aria-label', 'carta virada para baixo');
  el.dataset.word = card.palavra;
  el.dataset.emoji = card.emoji;
  el.innerHTML = `<span class="card-back">?</span><span class="card-face" aria-hidden="true">${card.emoji}</span>`;
  el.addEventListener('click', () => onFlip(el));
  board.appendChild(el);
});

function onFlip(el){
  if (lock || el.classList.contains('matched') || el.classList.contains('revealed')) return;
  el.classList.add('revealed');
  if (!first){ first = el; return; }
  // segunda carta
  const a = first, b = el;
  if (a.dataset.word === b.dataset.word){
    // Match -> abrir modal de digitação
    currentMatchedWord = a.dataset.word;
    lastMatchedItem = { emoji: a.dataset.emoji, palavra: a.dataset.word };
    openModalWithHint(currentMatchedWord, fase);
    a.classList.add('matched'); b.classList.add('matched');
    a.setAttribute('aria-label', `par encontrado: ${a.dataset.word}`);
    b.setAttribute('aria-label', `par encontrado: ${a.dataset.word}`);
  }else{
    lock = true;
    setTimeout(()=>{
      a.classList.remove('revealed');
      b.classList.remove('revealed');
      lock = false;
    }, 700);
  }
  first = null;
}

// Modal e dicas
const modal = qs('#modal');
const answerInput = qs('#answer');
const hintEl = qs('#hint');
const confirmBtn = qs('#confirmBtn');
const cancelBtn = qs('#cancelBtn');
const starsEl = qs('#stars');

function openModalWithHint(word, fase){
  modal.setAttribute('aria-hidden', 'false');
  answerInput.value = "";
  answerInput.focus();
  const w = normalize(word);
  let hint = "";
  if (fase === 1){ hint = `Dica: palavra curta (${w.length} letras)`; }
  else if (fase === 2){ hint = `Dica: começa com "${w[0].toUpperCase()}"`; }
  else if (fase === 3){ hint = `Dica: ${w.length} letras`; }
  else { // fase 4
    const has = ["nh","ch","lh"].find(f => w.includes(f));
    hint = has ? `Dica: contém "${has.toUpperCase()}"` : `Dica: atenção à ortografia`;
  }
  hintEl.textContent = hint;
}

function closeModal(){ modal.setAttribute('aria-hidden','true'); }

confirmBtn.addEventListener('click', () => {
  const user = normalize(answerInput.value.trim());
  const target = normalize(currentMatchedWord || '');
  const correct = user === target;
  if (correct){
    stars++;
    starsEl.textContent = String(stars);
    // TTS
    speak(currentMatchedWord);
  }
  // evento para relatório
  events.push({
    timestamp: new Date().toISOString(),
    fase, tema, palavra: currentMatchedWord, resposta: answerInput.value.trim(), correto: correct ? 'sim':'não'
  });
  // salvar progresso
  const key = `Fase ${fase} (${tema})`;
  const progress = JSON.parse(localStorage.getItem('memoriletra_progress') || '{}');
  progress[key] = (progress[key] || 0) + (correct ? 1 : 0);
  localStorage.setItem('memoriletra_progress', JSON.stringify(progress));

  closeModal();
  currentMatchedWord = null;
  lastMatchedItem = null;
  // checar fim de jogo
  const allMatched = qsa('.card-tile').every(x => x.classList.contains('matched'));
  if (allMatched){
    setTimeout(()=>{
      alert(`Fim! Você ganhou ${stars} ⭐`);
      window.location.href = 'index.html';
    }, 100);
  }
});

cancelBtn.addEventListener('click', () => {
  // registra evento de pulo sem estrela
  events.push({
    timestamp: new Date().toISOString(),
    fase, tema, palavra: currentMatchedWord, resposta: '(pulado)', correto: 'não'
  });
  closeModal();
});

// Botões de UI
qs('#speakBtn').addEventListener('click', () => {
  if (lastMatchedItem) speak(lastMatchedItem.palavra);
  else alert('Dica de áudio: encontre um par primeiro.');
});
qs('#csvBtn').addEventListener('click', () => {
  if (!events.length){ alert('Sem dados para exportar ainda.'); return; }
  const header = ['timestamp','fase','tema','palavra','resposta','correto'];
  const rows = [header.join(',')].concat(events.map(e => header.map(h => (''+e[h]).replaceAll('"','""')).map(v=>`"${v}"`).join(',')));
  const blob = new Blob([rows.join('\n')], {type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'memoriletra_relatorio.csv';
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
});

// =============== Cronômetro por fase ===============
// Fase 1 = 45s, demais = 5 minutos
let timeLeft = (fase === 1) ? 45 : 5 * 60;
const timerEl = document.getElementById('timer');

function updateTimer() {
  const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const sec = String(timeLeft % 60).padStart(2, '0');
  timerEl.textContent = `${min}:${sec}`;
  if (timeLeft <= 0) {
    clearInterval(timer);
    alert("⏱️ Tempo esgotado! O jogo foi encerrado.");
    window.location.href = "index.html";
  }
  timeLeft--;
}

updateTimer();
const timer = setInterval(updateTimer, 1000);
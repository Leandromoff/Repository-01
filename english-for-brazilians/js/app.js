/**
 * app.js - Lógica principal do site English for Brazilians
 *
 * Controla:
 * - Renderização da página de tópico
 * - Sistema de flashcards (flip)
 * - Modo de estudo (esconde traduções)
 * - Busca em tempo real
 * - Integração com Quiz e Favoritos
 */

// Aguarda o DOM estar pronto
document.addEventListener('DOMContentLoaded', () => {
  // Detecta em qual página estamos
  const isIndexPage = document.getElementById('topics-grid') !== null;
  const isTopicPage = document.getElementById('topic-content') !== null;
  const isFavoritesPage = document.getElementById('favorites-content') !== null;

  if (isIndexPage) initIndexPage();
  if (isTopicPage) initTopicPage();
  if (isFavoritesPage) initFavoritesPage();

  // Inicializa menu mobile e busca em todas as páginas
  initMobileMenu();
  initSearch();
  updateFavoriteBadge();
});

/* ============================================
   PÁGINA PRINCIPAL - lista de tópicos
   ============================================ */

function initIndexPage() {
  const grid = document.getElementById('topics-grid');
  if (!grid || !TOPICS) return;

  // Renderiza cada tópico como card clicável
  TOPICS.forEach((topic, i) => {
    const totalItems =
      topic.verbs.length +
      topic.newWords.length +
      topic.phrases.length +
      topic.grammar.length +
      topic.realLife.length;

    const card = document.createElement('a');
    card.href = `topic.html?id=${topic.id}`;
    card.className = `topic-card animate-fade-in-up delay-${Math.min(i + 1, 10)}`;
    card.innerHTML = `
      <div class="topic-card-icon">${topic.icon}</div>
      <h3>${escapeHtml(topic.title)}</h3>
      <p>${escapeHtml(topic.description)}</p>
      <div class="topic-card-stats">
        <span class="topic-card-stat">📝 ${topic.verbs.length} verbos</span>
        <span class="topic-card-stat">📖 ${topic.newWords.length} palavras</span>
        <span class="topic-card-stat">💬 ${topic.phrases.length} frases</span>
        <span class="topic-card-stat">✨ ${totalItems} itens total</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ============================================
   PÁGINA DE TÓPICO
   ============================================ */

// Estado do modo de estudo
let studyModeActive = false;
let studyProgress = {}; // { sectionKey: Set de índices revelados }
let currentTopic = null;

function initTopicPage() {
  // Pega o id do tópico pela URL
  const params = new URLSearchParams(window.location.search);
  const topicId = params.get('id');

  currentTopic = TOPICS.find(t => t.id === topicId);

  if (!currentTopic) {
    document.getElementById('topic-content').innerHTML = `
      <div class="favorites-empty">
        <div class="empty-icon">😕</div>
        <h3>Tópico não encontrado</h3>
        <p>O tópico que você procura não existe.</p>
        <a href="index.html" class="btn btn-primary" style="margin-top:16px;">← Voltar ao início</a>
      </div>
    `;
    return;
  }

  renderTopicHeader(currentTopic);
  renderTopicControls(currentTopic);
  renderAllSections(currentTopic);

  // Atualiza o título da aba do navegador
  document.title = `${currentTopic.title} | English for Brazilians`;
}

function renderTopicHeader(topic) {
  const el = document.getElementById('topic-header');
  if (!el) return;
  el.innerHTML = `
    <a href="index.html" class="back-link">← Voltar aos tópicos</a>
    <div class="topic-title">
      <span class="icon">${topic.icon}</span>
      <h2>${escapeHtml(topic.title)}</h2>
    </div>
    <p class="topic-description">${escapeHtml(topic.description)}</p>
  `;
}

function renderTopicControls(topic) {
  const el = document.getElementById('topic-controls');
  if (!el) return;
  el.innerHTML = `
    <button id="study-mode-btn" class="btn btn-primary" onclick="toggleStudyMode()">
      👁️ Study Mode
    </button>
    <button class="btn btn-warning" onclick="startFullQuiz()">
      🎯 Test Yourself (tudo)
    </button>
    <a href="index.html#favorites" onclick="showFavorites(event)" class="btn btn-secondary">
      ⭐ Meus Favoritos
      <span id="fav-badge" class="topic-card-stat" style="margin:0; padding: 2px 8px;"></span>
    </a>
  `;
  updateFavoriteBadge();
}

function renderAllSections(topic) {
  const content = document.getElementById('topic-content');
  if (!content) return;
  content.innerHTML = '';

  // Inicializa o progresso do modo estudo para cada seção
  studyProgress = {
    verbs: new Set(),
    newWords: new Set(),
    phrases: new Set(),
    grammar: new Set(),
    realLife: new Set()
  };

  // Renderiza cada seção
  renderSection(content, 'verbs', '🔤 Verbs', 'badge-verbs', topic.verbs, topic.id);
  renderSection(content, 'newWords', '📖 New Words', 'badge-words', topic.newWords, topic.id);
  renderSection(content, 'phrases', '💬 Useful Phrases', 'badge-phrases', topic.phrases, topic.id);
  renderGrammarSection(content, topic);
  renderSection(content, 'realLife', '🌎 Real Life', 'badge-reallife', topic.realLife, topic.id);
}

/**
 * Renderiza uma seção genérica (verbs, newWords, phrases, realLife)
 */
function renderSection(container, sectionKey, title, badgeClass, items, topicId) {
  const section = document.createElement('div');
  section.className = 'content-section';
  section.id = `section-${sectionKey}`;

  section.innerHTML = `
    <div class="section-header">
      <div class="section-title">
        <span class="section-badge ${badgeClass}">${title}</span>
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <div class="study-progress" id="progress-${sectionKey}">
          <div class="progress-bar">
            <div class="progress-fill" id="progress-fill-${sectionKey}"></div>
          </div>
          <span class="progress-text" id="progress-text-${sectionKey}">0 de ${items.length}</span>
        </div>
        <button class="btn btn-secondary" style="font-size:0.8rem; padding:6px 14px;"
          onclick="Quiz.start(${JSON.stringify(items).replace(/"/g, '&quot;')}, '${title}')">
          🎯 Quiz
        </button>
      </div>
    </div>
    <div class="cards-grid" id="grid-${sectionKey}"></div>
  `;

  container.appendChild(section);

  // Renderiza os flashcards
  const grid = section.querySelector(`#grid-${sectionKey}`);
  items.forEach((item, index) => {
    const card = createFlashcard(item, index, sectionKey, topicId);
    grid.appendChild(card);
  });
}

/**
 * Cria um elemento de flashcard
 */
function createFlashcard(item, index, sectionKey, topicId) {
  const wrapper = document.createElement('div');
  wrapper.className = `flashcard-wrapper animate-fade-in-up delay-${Math.min(index + 1, 10)}`;
  wrapper.dataset.index = index;
  wrapper.dataset.section = sectionKey;

  const isFav = Favorites.isFavorite(topicId, item.en);

  wrapper.innerHTML = `
    <div class="flashcard" id="card-${sectionKey}-${index}" onclick="flipCard(this, '${sectionKey}', ${index})">
      <div class="flashcard-front">
        <button class="favorite-btn ${isFav ? 'active' : ''}"
          onclick="toggleFavorite(event, '${topicId}', '${sectionKey}', this)"
          data-en="${escapeHtml(item.en)}"
          data-pt="${escapeHtml(item.pt)}"
          title="Adicionar aos favoritos">⭐</button>
        <div class="flashcard-lang">🇺🇸 English</div>
        <div class="flashcard-text">${escapeHtml(item.en)}</div>
        <div style="font-size:0.7rem; color:#aaa; margin-top:8px;">clique para ver a tradução</div>
      </div>
      <div class="flashcard-back">
        <div class="flashcard-lang">🇧🇷 Português</div>
        <div class="flashcard-text">${escapeHtml(item.pt)}</div>
      </div>
    </div>
  `;

  return wrapper;
}

/**
 * Seção de gramática com explicação + exemplos
 */
function renderGrammarSection(container, topic) {
  const section = document.createElement('div');
  section.className = 'content-section';
  section.id = 'section-grammar';

  const items = topic.grammar;
  const quizData = JSON.stringify(items).replace(/"/g, '&quot;');

  section.innerHTML = `
    <div class="section-header">
      <div class="section-title">
        <span class="section-badge badge-grammar">📐 Grammar</span>
        <h3>${escapeHtml(topic.grammarTitle)}</h3>
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <div class="study-progress" id="progress-grammar">
          <div class="progress-bar">
            <div class="progress-fill" id="progress-fill-grammar"></div>
          </div>
          <span class="progress-text" id="progress-text-grammar">0 de ${items.length}</span>
        </div>
        <button class="btn btn-secondary" style="font-size:0.8rem; padding:6px 14px;"
          onclick="Quiz.start(${quizData}, '📐 Grammar')">
          🎯 Quiz
        </button>
      </div>
    </div>
    <div class="grammar-box">
      <h4>${escapeHtml(topic.grammarTitle)}</h4>
      ${topic.grammarExplanation}
    </div>
    <div class="cards-grid" id="grid-grammar"></div>
  `;

  container.appendChild(section);

  const grid = section.querySelector('#grid-grammar');
  items.forEach((item, index) => {
    const card = createFlashcard(item, index, 'grammar', topic.id);
    grid.appendChild(card);
  });
}

/* ============================================
   FLIP DOS FLASHCARDS
   ============================================ */

function flipCard(cardEl, sectionKey, index) {
  if (studyModeActive) {
    // No modo estudo, revela a tradução sem girar
    const wrapper = cardEl.closest('.flashcard-wrapper');
    const wasRevealed = cardEl.classList.contains('revealed');
    cardEl.classList.toggle('revealed');

    // Atualiza o progresso
    if (!wasRevealed) {
      studyProgress[sectionKey].add(index);
    } else {
      studyProgress[sectionKey].delete(index);
    }
    updateStudyProgress(sectionKey);
    return;
  }

  // Modo normal: flip 3D
  cardEl.classList.toggle('flipped');
}

/* ============================================
   MODO DE ESTUDO
   ============================================ */

function toggleStudyMode() {
  studyModeActive = !studyModeActive;
  const btn = document.getElementById('study-mode-btn');
  const content = document.getElementById('topic-content');

  if (studyModeActive) {
    // Ativa modo estudo
    content.classList.add('study-mode');
    btn.classList.add('active');
    btn.textContent = '✕ Sair do Study Mode';

    // Mostra barras de progresso
    document.querySelectorAll('.study-progress').forEach(el => el.classList.add('active'));

    // Desvira todos os cards
    document.querySelectorAll('.flashcard').forEach(card => {
      card.classList.remove('flipped', 'revealed');
    });

    // Reseta progresso
    Object.keys(studyProgress).forEach(key => studyProgress[key].clear());
    updateAllProgress();
  } else {
    // Desativa modo estudo
    content.classList.remove('study-mode');
    btn.classList.remove('active');
    btn.innerHTML = '👁️ Study Mode';

    // Esconde barras de progresso
    document.querySelectorAll('.study-progress').forEach(el => el.classList.remove('active'));

    // Fecha todos os cards
    document.querySelectorAll('.flashcard').forEach(card => {
      card.classList.remove('flipped', 'revealed');
    });
  }
}

function updateStudyProgress(sectionKey) {
  if (!currentTopic) return;

  const sectionMap = {
    verbs: currentTopic.verbs,
    newWords: currentTopic.newWords,
    phrases: currentTopic.phrases,
    grammar: currentTopic.grammar,
    realLife: currentTopic.realLife
  };

  const total = sectionMap[sectionKey]?.length || 0;
  const done = studyProgress[sectionKey]?.size || 0;
  const percentage = total > 0 ? (done / total) * 100 : 0;

  const fill = document.getElementById(`progress-fill-${sectionKey}`);
  const text = document.getElementById(`progress-text-${sectionKey}`);
  if (fill) fill.style.width = `${percentage}%`;
  if (text) text.textContent = `${done} de ${total} revisados`;
}

function updateAllProgress() {
  ['verbs', 'newWords', 'phrases', 'grammar', 'realLife'].forEach(updateStudyProgress);
}

/* ============================================
   FAVORITOS
   ============================================ */

function toggleFavorite(event, topicId, sectionKey, btn) {
  event.stopPropagation(); // Não virar o card

  const en = btn.dataset.en;
  const pt = btn.dataset.pt;
  const added = Favorites.toggle(topicId, sectionKey, en, pt);

  btn.classList.toggle('active', added);

  // Micro-animação no botão
  btn.style.transform = 'scale(1.4)';
  setTimeout(() => btn.style.transform = '', 200);

  updateFavoriteBadge();
}

function updateFavoriteBadge() {
  const badge = document.getElementById('fav-badge');
  if (badge) {
    const count = Favorites.count();
    badge.textContent = count > 0 ? count : '';
  }
}

function showFavorites(event) {
  // Se estamos na topic.html, deixa o link navegar normalmente para favorites.html
  // (o link já aponta para a página correta)
}

/* ============================================
   QUIZ DE TUDO
   ============================================ */

function startFullQuiz() {
  if (!currentTopic) return;
  const allItems = [
    ...currentTopic.verbs,
    ...currentTopic.newWords,
    ...currentTopic.phrases,
    ...currentTopic.grammar,
    ...currentTopic.realLife
  ];
  Quiz.start(allItems, `${currentTopic.icon} ${currentTopic.title}`);
}

/* ============================================
   BUSCA EM TEMPO REAL
   ============================================ */

function initSearch() {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();

    if (query.length < 2) {
      results.classList.remove('active');
      results.innerHTML = '';
      return;
    }

    // Busca em todos os tópicos e seções
    const found = [];

    TOPICS.forEach(topic => {
      const sections = {
        verbs: topic.verbs,
        newWords: topic.newWords,
        phrases: topic.phrases,
        grammar: topic.grammar,
        realLife: topic.realLife
      };

      Object.entries(sections).forEach(([secKey, items]) => {
        items.forEach(item => {
          if (
            item.en.toLowerCase().includes(query) ||
            item.pt.toLowerCase().includes(query)
          ) {
            found.push({ topic, secKey, item });
          }
        });
      });
    });

    if (found.length === 0) {
      results.innerHTML = '<div class="search-result-item"><span class="result-en">Nenhum resultado encontrado</span></div>';
    } else {
      results.innerHTML = found.slice(0, 10).map(({ topic, secKey, item }) => `
        <div class="search-result-item" onclick="goToTopic('${topic.id}')">
          <div class="result-en">🇺🇸 ${escapeHtml(item.en)}</div>
          <div class="result-pt">🇧🇷 ${escapeHtml(item.pt)}</div>
          <div class="result-topic">${topic.icon} ${escapeHtml(topic.title)}</div>
        </div>
      `).join('');
    }

    results.classList.add('active');
  });

  // Fecha os resultados ao clicar fora
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !results.contains(e.target)) {
      results.classList.remove('active');
    }
  });
}

function goToTopic(topicId) {
  window.location.href = `topic.html?id=${topicId}`;
}

/* ============================================
   MENU MOBILE
   ============================================ */

function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const navList = document.getElementById('nav-list');
  if (!toggle || !navList) return;

  toggle.addEventListener('click', () => {
    navList.classList.toggle('open');
    toggle.textContent = navList.classList.contains('open') ? '✕' : '☰';
  });
}

/* ============================================
   PÁGINA DE FAVORITOS
   ============================================ */

function initFavoritesPage() {
  renderFavoritesPage();
}

function renderFavoritesPage() {
  const content = document.getElementById('favorites-content');
  if (!content) return;

  const favorites = Favorites.getAll();

  if (favorites.length === 0) {
    content.innerHTML = `
      <div class="favorites-empty animate-fade-in">
        <div class="empty-icon">⭐</div>
        <h3>Nenhum favorito ainda</h3>
        <p>Clique na estrela ⭐ em qualquer palavra ou frase para salvá-la aqui.</p>
        <a href="index.html" class="btn btn-primary" style="margin-top:20px; display:inline-flex;">
          📚 Ver Tópicos
        </a>
      </div>
    `;
    return;
  }

  // Agrupa por tópico
  const grouped = {};
  favorites.forEach(fav => {
    if (!grouped[fav.topicId]) grouped[fav.topicId] = [];
    grouped[fav.topicId].push(fav);
  });

  let html = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
      <p style="color:var(--gray-dark);">${favorites.length} item${favorites.length !== 1 ? 'ns' : ''} salvos</p>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-warning" onclick="Quiz.start(${JSON.stringify(favorites.map(f => ({en:f.en,pt:f.pt}))).replace(/"/g,'&quot;')}, '⭐ Favoritos')">
          🎯 Quiz dos Favoritos
        </button>
        <button class="btn btn-secondary" onclick="confirmClearFavorites()">
          🗑️ Limpar tudo
        </button>
      </div>
    </div>
  `;

  Object.entries(grouped).forEach(([topicId, favs]) => {
    const topic = TOPICS.find(t => t.id === topicId);
    const topicTitle = topic ? `${topic.icon} ${topic.title}` : topicId;

    html += `
      <div class="content-section">
        <div class="section-header">
          <div class="section-title">
            <span class="section-badge badge-words">${topicTitle}</span>
          </div>
          <a href="topic.html?id=${topicId}" class="btn btn-secondary" style="font-size:0.8rem; padding:6px 14px;">
            📖 Abrir tópico
          </a>
        </div>
        <div class="cards-grid">
          ${favs.map((fav, i) => `
            <div class="flashcard-wrapper animate-fade-in-up delay-${Math.min(i+1,10)}">
              <div class="flashcard" onclick="this.classList.toggle('flipped')">
                <div class="flashcard-front">
                  <button class="favorite-btn active"
                    onclick="removeFavAndRefresh(event, '${fav.topicId}', '${escapeHtml(fav.en)}')"
                    title="Remover dos favoritos">⭐</button>
                  <div class="flashcard-lang">🇺🇸 English</div>
                  <div class="flashcard-text">${escapeHtml(fav.en)}</div>
                  <div style="font-size:0.7rem; color:#aaa; margin-top:8px;">clique para ver a tradução</div>
                </div>
                <div class="flashcard-back">
                  <div class="flashcard-lang">🇧🇷 Português</div>
                  <div class="flashcard-text">${escapeHtml(fav.pt)}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });

  content.innerHTML = html;
}

function removeFavAndRefresh(event, topicId, en) {
  event.stopPropagation();
  Favorites.remove(topicId, en);
  renderFavoritesPage();
  updateFavoriteBadge();
}

function confirmClearFavorites() {
  if (confirm('Tem certeza que quer remover todos os favoritos?')) {
    Favorites.clearAll();
    renderFavoritesPage();
    updateFavoriteBadge();
  }
}

/* ============================================
   UTILITÁRIOS
   ============================================ */

/**
 * Escapa caracteres HTML para evitar XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

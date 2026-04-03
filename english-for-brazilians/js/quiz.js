/**
 * quiz.js - Sistema de quiz interativo
 * English for Brazilians
 *
 * Gera quizzes de múltipla escolha a partir dos dados do tópico.
 * Mostra uma palavra em inglês e o usuário escolhe a tradução correta.
 */

const Quiz = {
  // Estado atual do quiz
  items: [],         // itens do quiz
  currentIndex: 0,   // índice da pergunta atual
  score: 0,          // pontuação
  isActive: false,   // quiz está ativo?
  sectionName: '',   // nome da seção

  /**
   * Inicia um quiz com os itens fornecidos
   * @param {Array} items - Array de { en, pt }
   * @param {string} sectionName - Nome da seção para exibir
   */
  start(items, sectionName) {
    if (items.length < 2) {
      alert('É necessário pelo menos 2 itens para iniciar o quiz.');
      return;
    }

    // Embaralha os itens
    this.items = this._shuffle([...items]);
    this.currentIndex = 0;
    this.score = 0;
    this.isActive = true;
    this.sectionName = sectionName;

    this._showOverlay();
    this._renderQuestion();
  },

  /**
   * Embaralha um array (Fisher-Yates)
   */
  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  /**
   * Mostra o overlay do quiz
   */
  _showOverlay() {
    let overlay = document.getElementById('quiz-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'quiz-overlay';
      overlay.className = 'quiz-overlay';
      overlay.innerHTML = '<div class="quiz-container" id="quiz-container"></div>';
      document.body.appendChild(overlay);
    }
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  /**
   * Fecha o quiz
   */
  close() {
    const overlay = document.getElementById('quiz-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
    document.body.style.overflow = '';
    this.isActive = false;
  },

  /**
   * Renderiza a pergunta atual
   */
  _renderQuestion() {
    const container = document.getElementById('quiz-container');
    const item = this.items[this.currentIndex];
    const total = this.items.length;
    const current = this.currentIndex + 1;

    // Gera 4 opções (1 correta + 3 incorretas)
    const options = this._generateOptions(item);

    container.innerHTML = `
      <button class="quiz-close" onclick="Quiz.close()" title="Fechar">&times;</button>
      <p class="quiz-progress">Pergunta ${current} de ${total} — ${this.sectionName}</p>
      <h3 class="quiz-question">🇺🇸 ${this._escapeHtml(item.en)}</h3>
      <p class="quiz-hint">Escolha a tradução correta em português:</p>
      <div class="quiz-options">
        ${options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}" onclick="Quiz._checkAnswer(${i}, ${options.indexOf(item.pt)})">
            🇧🇷 ${this._escapeHtml(opt)}
          </button>
        `).join('')}
      </div>
    `;

    container.querySelector('.quiz-question').classList.add('animate-pop-in');
  },

  /**
   * Gera opções de resposta (1 correta + até 3 incorretas)
   */
  _generateOptions(correctItem) {
    const allPt = this.items.map(i => i.pt).filter(pt => pt !== correctItem.pt);
    const shuffled = this._shuffle([...allPt]);
    const incorrectCount = Math.min(3, shuffled.length);
    const options = [correctItem.pt, ...shuffled.slice(0, incorrectCount)];
    return this._shuffle(options);
  },

  /**
   * Verifica a resposta do usuário
   */
  _checkAnswer(selectedIndex, correctIndex) {
    const options = document.querySelectorAll('.quiz-option');

    // Desabilita todas as opções
    options.forEach(opt => opt.classList.add('disabled'));

    // Marca correta e incorreta
    options[correctIndex].classList.add('correct');

    if (selectedIndex === correctIndex) {
      this.score++;
    } else {
      options[selectedIndex].classList.add('incorrect');
    }

    // Avança para próxima pergunta após um breve delay
    setTimeout(() => {
      this.currentIndex++;
      if (this.currentIndex < this.items.length) {
        this._renderQuestion();
      } else {
        this._showResult();
      }
    }, 1200);
  },

  /**
   * Mostra o resultado final do quiz
   */
  _showResult() {
    const container = document.getElementById('quiz-container');
    const total = this.items.length;
    const percentage = Math.round((this.score / total) * 100);

    let emoji, message;
    if (percentage === 100) {
      emoji = '🏆';
      message = 'Perfeito! Você é incrível!';
    } else if (percentage >= 70) {
      emoji = '🎉';
      message = 'Muito bem! Continue praticando!';
    } else if (percentage >= 50) {
      emoji = '💪';
      message = 'Bom trabalho! Revise os itens que errou.';
    } else {
      emoji = '📚';
      message = 'Continue estudando! Você vai melhorar!';
    }

    container.innerHTML = `
      <button class="quiz-close" onclick="Quiz.close()" title="Fechar">&times;</button>
      <div style="font-size: 4rem; margin-bottom: 16px;">${emoji}</div>
      <h3 style="font-size: 1.3rem; margin-bottom: 8px;">Quiz Finalizado!</h3>
      <p class="quiz-score animate-pop-in">${this.score}/${total}</p>
      <p class="quiz-score-label">${percentage}% de acertos — ${message}</p>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-primary" onclick="Quiz.start(Quiz.items, Quiz.sectionName)">
          🔄 Tentar Novamente
        </button>
        <button class="btn btn-secondary" onclick="Quiz.close()">
          ✕ Fechar
        </button>
      </div>
    `;
  },

  /**
   * Escapa HTML para evitar XSS
   */
  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

/**
 * favorites.js - Sistema de favoritos usando localStorage
 * English for Brazilians
 *
 * Os favoritos são armazenados como um array de objetos no localStorage.
 * Cada favorito tem: topicId, section, en, pt
 */

const Favorites = {
  STORAGE_KEY: 'efb_favorites',

  /**
   * Retorna todos os favoritos salvos
   */
  getAll() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  /**
   * Salva a lista de favoritos no localStorage
   */
  _save(favorites) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
  },

  /**
   * Verifica se um item já é favorito
   */
  isFavorite(topicId, en) {
    const favorites = this.getAll();
    return favorites.some(f => f.topicId === topicId && f.en === en);
  },

  /**
   * Adiciona ou remove um item dos favoritos (toggle)
   * Retorna true se adicionou, false se removeu
   */
  toggle(topicId, section, en, pt) {
    const favorites = this.getAll();
    const index = favorites.findIndex(f => f.topicId === topicId && f.en === en);

    if (index >= 0) {
      // Remove o favorito
      favorites.splice(index, 1);
      this._save(favorites);
      return false;
    } else {
      // Adiciona o favorito
      favorites.push({ topicId, section, en, pt });
      this._save(favorites);
      return true;
    }
  },

  /**
   * Remove um favorito específico
   */
  remove(topicId, en) {
    const favorites = this.getAll();
    const filtered = favorites.filter(f => !(f.topicId === topicId && f.en === en));
    this._save(filtered);
  },

  /**
   * Retorna a contagem de favoritos
   */
  count() {
    return this.getAll().length;
  },

  /**
   * Limpa todos os favoritos
   */
  clearAll() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
};

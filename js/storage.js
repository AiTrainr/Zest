const Storage = {
  _get(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  },
  _set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },

  getProfile() {
    return this._get('Zest_UserProfile') || {
      dietary: [], favoriteCuisines: [], budget: null,
      viewedRestaurants: [], likedRestaurants: []
    };
  },
  saveProfile(profile) { this._set('Zest_UserProfile', profile); },

  getExclusions() {
    return this._get('Zest_Exclusions') || { restaurants: [], cuisines: [] };
  },
  addRestaurantExclusion(id) {
    const ex = this.getExclusions();
    if (!ex.restaurants.includes(id)) ex.restaurants.push(id);
    this._set('Zest_Exclusions', ex);
  },
  addCuisineExclusion(cuisine) {
    const ex = this.getExclusions();
    if (!ex.cuisines.includes(cuisine)) ex.cuisines.push(cuisine);
    this._set('Zest_Exclusions', ex);
  },

  getNotes() { return this._get('Zest_MyRestaurantNotes') || []; },
  addNote(note) {
    const notes = this.getNotes();
    const idx = notes.findIndex(n => n.restaurantId === note.restaurantId);
    if (idx >= 0) notes[idx] = note; else notes.push(note);
    this._set('Zest_MyRestaurantNotes', notes);
  },
  getNoteForRestaurant(id) {
    return this.getNotes().find(n => n.restaurantId === id) || null;
  },

  getSettings() {
    return this._get('Zest_Settings') || { whatsNewViews: 0, priorities: ['cost','distance','rating'],
      costDir: 'asc', distDir: 'asc', ratingDir: 'desc' };
  },
  saveSettings(s) { this._set('Zest_Settings', s); },

  exportAll() {
    const data = {
      profile: this.getProfile(),
      exclusions: this.getExclusions(),
      notes: this.getNotes(),
      settings: this.getSettings()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'Zest_UserData.json'; a.click();
    URL.revokeObjectURL(url);
  }
};

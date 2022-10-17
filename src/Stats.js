class Stats {
  constructor(key) {
    this.clicked = 0;
    this.guessed = 0;
    this.mistakes = 0;
    this.correctPercentage = 0;
    localStorage.setItem(key, JSON.stringify(this))
  }
}

export { Stats };

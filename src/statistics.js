import { Stats } from "./Stats.js";
import { categories, state } from "./index.js";
import { toStatsView } from "./navigation.js";

function fillStats() {
  const table = document.querySelector("#stats-table tbody");

  for (const category of categories) {
    for (let id = 0; id < 8; id++) {
      const card = category.cards[id];
      const stats = getStats(card.key);
      const row = createRow(card, stats);
      table.append(row);

      localStorage.setItem(card.key, JSON.stringify(stats));
    }
  }
  addResetListener();
}

function getStats(key) {
  const stats =
    localStorage.length === 64
      ? JSON.parse(localStorage.getItem(key))
      : new Stats(key);
  return stats;
}

function updateStats() {
  for (const category of categories) {
    for (const card of category.cards) {
      const stats = getStats(card.key);
      fillRow(card, stats);
    }
  }
}

function fillRow(card, stats) {
  const row = document.querySelector(
    `tr.cat${card.category_id}.${card.dataObj.word.replace(" ", "_")}`
  );
  const colNames = [
    "word",
    "category",
    "translation",
    "clicked",
    "guessed",
    "mistakes",
    "correctPercentage",
  ];
  const wordData = {
    word: card.dataObj.word,
    category: card.category,
    translation: card.dataObj.translation,
  };

  for (const key of colNames) {
    const elem = row.querySelector(`td.${key}`);
    elem.textContent = { ...wordData, ...stats }[key];
  }
}

function createRow(card, stats) {
  const row = document.createElement("tr");

  const colNames = [
    "word",
    "category",
    "translation",
    "clicked",
    "guessed",
    "mistakes",
    "correctPercentage",
  ];
  const wordData = {
    word: card.dataObj.word,
    category: card.category,
    translation: card.dataObj.translation,
    category_id: card.category_id,
  };
  row.classList.add(
    "cat" + wordData.category_id,
    wordData.word.replace(" ", "_")
  );

  for (const key of colNames) {
    const elem = document.createElement("td");
    elem.classList.add(key);
    elem.textContent = { ...wordData, ...stats }[key];
    row.append(elem);
  }

  return row;
}

function incrementStats(card, param) {
  const stats = JSON.parse(localStorage.getItem(card.key));
  stats[param]++;
  localStorage.setItem(card.key, JSON.stringify(stats));
}

function incrementClicks(card) {
  if (state.playMode) {
    return;
  }
  incrementStats(card, "clicked");
}

function incrementGuessed(card) {
  incrementStats(card, "guessed");
  calculatePercent(card);
}

function incrementMistakes(card) {
  incrementStats(card, "mistakes");
  calculatePercent(card);
}

function calculatePercent(card) {
  const stats = JSON.parse(localStorage.getItem(card.key));

  if (stats.mistakes === 0) {
    stats.correctPercentage = 100;
  } else {
    stats.correctPercentage = Math.round(
      (stats.guessed / (stats.mistakes + stats.guessed)) * 100
    );
  }
  localStorage.setItem(card.key, JSON.stringify(stats));
}

function addResetListener() {
  document.querySelector("#reset-btn").addEventListener("click", () => {
    resetStats();
    toStatsView();
  });
}

function resetStats() {
  localStorage.clear();
}

export {
  fillStats,
  getStats,
  updateStats,
  incrementClicks,
  incrementGuessed,
  incrementMistakes,
  calculatePercent,
};

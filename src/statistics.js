import { Stats } from "./Stats.js";
import { categories, state } from "./index.js";
import { toStatsView } from "./navigation.js";
import { sortTable } from "./sort_statistics.js";

function createStats() {
  const tbody = document.querySelector("#stats-table tbody");

  for (const category of categories) {
    for (const card of category.cards) {
      const row = createRow(card);
      tbody.append(row);
    }
  }
  addResetListener();
  const tableHeaders = tbody.querySelectorAll("th");
  for (const [i, header] of tableHeaders.entries()) {
    header.addEventListener("click", () => sortTable(i));
  }
}

function getStats(key) {
  const stats = JSON.parse(localStorage.getItem(key)) || new Stats(key);
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

  const colNames = Stats.getColNames();
  const wordData = card.getWordData();

  for (const key of colNames) {
    const elem = row.querySelector(`td.${key}`);
    elem.textContent = { ...wordData, ...stats }[key];
  }
}

function createRow(card) {
  const row = document.createElement("tr");
  const colNames = Stats.getColNames();

  row.classList.add(
    "cat" + card.category_id,
    card.dataObj.word.replace(" ", "_")
  );

  for (const key of colNames) {
    const elem = document.createElement("td");
    elem.classList.add(key);
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
    localStorage.clear();
    toStatsView();
  });
}

export {
  createStats,
  getStats,
  updateStats,
  incrementClicks,
  incrementGuessed,
  incrementMistakes,
  calculatePercent,
};

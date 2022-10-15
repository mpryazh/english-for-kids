import { Stats } from "./Stats.js";
import { categories } from "./index.js";

function fillStats() {
  const table = document.querySelector("#stats-table tbody");

  for (const category of categories) {
    for (let id = 0; id < 8; id++) {
      const card = category.cards[id];
      const stats = localStorage.length
        ? JSON.parse(localStorage.getItem(card.key))
        : new Stats();
      const row = createRow(card, stats);
      table.append(row);

      localStorage.setItem(card.key, JSON.stringify(stats));
    }
  }
}

function updateStats() {
  for (const category of categories) {
    for (let id = 0; id < 8; id++) {
      const card = category.cards[id];
      const stats = JSON.parse(localStorage.getItem(card.key));

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

export { fillStats, updateStats };

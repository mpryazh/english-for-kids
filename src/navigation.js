import { categories, state } from "./index.js";
import cards from "./data/cards.js";
import { updateStats } from "./statistics.js";
import { Category } from "./Category.js";
import { switchModes } from "./play_train_modes";
import { createDiffCards, addDiffEventListener } from "./difficultCards.js";

function addNavLinks() {
  const links = document.querySelectorAll(".nav-item.category");

  for (let i = 0; i < 8; i++) {
    links[i].textContent = cards[0][i];
    links[i].addEventListener("click", () => {
      if (state.insideStats) {
        closeStats();
      }
      const category = categories[i];
      category.toCategoryView();
      category.addStartBtn();
      hideMenu();
    });
  }
  addHomeLink();
  addStatsLink();
}

function addHomeLink() {
  const link = document.querySelector(".nav-item.home");
  link.addEventListener("click", () => {
    toMainView();
    hideMenu();
  });
}

function addStatsLink() {
  const navStatsLink = document.querySelector("#nav-stats");
  navStatsLink.addEventListener("click", () => {
    toStatsView();
    hideMenu();
  });
}

function toMainView() {
  if (state.insideStats) {
    closeStats();
  }
  Category.reInsertCategoryCards();
  Category.showCategories();
  switchModes();
}

function toStatsView() {
  state.insideCategory = false;
  state.insideStats = true;
  const view = document.querySelector("#view");
  view.classList.add("hidden");
  const stats = document.querySelector("#statistics");
  stats.classList.remove("hidden");
  document.querySelector("h1").textContent = "Statistics";
  updateStats();
  createDiffCards();
  addDiffEventListener();
  switchModes();
}

function closeStats() {
  const view = document.querySelector("#view");
  view.classList.remove("hidden");
  const stats = document.querySelector("#statistics");
  stats.classList.add("hidden");
  state.insideStats = false;
}

function hideMenu() {
  document.querySelector(".offcanvas-start").classList.remove("show");
  document.querySelector(".offcanvas-backdrop").classList.remove("show");
  document.body.style = "";
}

function clearCardsRow() {
  const row = document.querySelector("#view .row");
  row.textContent = "";
  return row;
}

export { addNavLinks, toStatsView, toMainView, clearCardsRow, closeStats };

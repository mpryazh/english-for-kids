import { categories, state } from "./index.js";
import cards from "./data/cards.js";
import { updateStats } from "./statistics.js";
import { Category } from "./Category.js";
import { switchModes } from "./play_train_modes";
import { createDiffCards, addDiffEventListener } from "./difficultCards.js";

function addNavLinks() {
  addCategoryLinks();
  addHomeLink();
  addStatsLink();
  manageMenu();
}

function manageMenu() {
  const myOffcanvas = document.querySelector(".offcanvas-start");
  const bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
  const navbar = document.querySelector(".navbar-nav");

  navbar.addEventListener("click", (e) => {
    bsOffcanvas.toggle();
    highlightCurrentLink(e.target.closest(".nav-item"));
  });
}

function addCategoryLinks() {
  const links = document.querySelectorAll(".nav-item.category");

  for (let i = 0; i < 8; i++) {
    const link = links[i];
    link.textContent = cards[0][i];
    link.addEventListener("click", () => {
      if (state.insideStats) {
        closeStats();
      }
      const category = categories[i];
      category.toCategoryView();
      category.addStartBtn();
    });
  }
}

function addHomeLink() {
  const link = document.querySelector(".nav-item.home");
  link.addEventListener("click", toMainView);
  highlightCurrentLink(link);
}

function addStatsLink() {
  document.querySelector("#nav-stats").addEventListener("click", toStatsView);
}

function highlightCurrentLink(link) {
  if (!link) {
    return;
  }
  document
    .querySelectorAll(".nav-item")
    .forEach((item) => item.classList.remove("current-nav-item"));
  link.classList.add("current-nav-item");
}

function toMainView() {
  if (state.insideStats) {
    closeStats();
  }
  Category.reInsertCategoryCards();
  Category.showCategories();
  highlightCurrentLink(document.querySelector(".nav-item.home"));
  switchModes();
}

function toStatsView() {
  state.insideCategory = false;
  state.insideStats = true;
  const view = document.querySelector("#view");
  view.classList.add("hidden");
  const stats = document.querySelector("#statistics");
  stats.classList.remove("hidden");
  document.querySelector("header").classList.add("stats-open");
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
  document.querySelector("header").classList.remove("stats-open");
  state.insideStats = false;
}

function clearCardsRow() {
  const row = document.querySelector("#view .row");
  row.textContent = "";
  return row;
}

export {
  addNavLinks,
  toStatsView,
  toMainView,
  clearCardsRow,
  closeStats,
  highlightCurrentLink,
};

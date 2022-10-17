import { categories, state } from "./index.js";
import cards from "./data/cards.js";
import { updateStats } from "./statistics.js";
import { Category } from "./Category.js";
import { switchModes } from "./play_train_modes";

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
    if (state.insideStats) {
      closeStats();
    }
    Category.reInsertCategoryCards();
    Category.showCategories();

    hideMenu();
    switchModes();
  });
}

function addStatsLink() {
  const navStatsLink = document.querySelector("#nav-stats");
  navStatsLink.addEventListener("click", () => {
    toStatsView();
    hideMenu();
  });
}

function toStatsView() {
  state.insideCategory = false;
  state.insideStats = true;
  const view = document.querySelector("#view");
  view.classList.add("hidden");
  const stats = document.querySelector("#statistics");
  stats.classList.remove("hidden");
  updateStats();
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

export { addNavLinks, toStatsView };

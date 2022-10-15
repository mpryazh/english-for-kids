import { addModeSwitchBtn, switchModes } from "./triggers.js";
import { Category } from "./Category.js";
import cards from "./data/cards.js";
import { fillStats, updateStats } from "./statistics.js";
import "./styles/style.css";
import "./styles/bootstrap.css";

const state = {
  insideCategory: false,
  insideStats: false,
  playMode: false,
  gameOn: false,
};

const categories = [];

Category.createCategoryCards();
addModeSwitchBtn();
addNavLinks();
addHomeLink();

fillStats();

function addNavLinks() {
  const links = document.querySelectorAll(".nav-item.category");

  for (let i = 0; i < 8; i++) {
    links[i].textContent = cards[0][i];
    links[i].addEventListener("click", () => {
      const category = categories[i];
      for (const card of category.cards) {
        card.fillInfo();
      }
      hideMenu();
      openCategory();
    });
  }
}

function openCategory() {
  if (state.insideStats) {
    closeStats();
  }
  state.insideCategory = true;

  const view = document.querySelector("#view");
  view.classList.add("category-view");
  view.classList.remove("main-view");

  switchModes();
}

function addHomeLink() {
  const link = document.querySelector(".nav-item.home");
  link.addEventListener("click", () => {
    if (state.insideStats) {
      closeStats();
    }
    Category.createCategoryCards();

    hideMenu();
    switchModes();
  });
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

const navLink = document.querySelector("#nav-stats");
navLink.addEventListener("click", () => {
  toStatsView();
  hideMenu();
});

function toStatsView() {
  state.insideCategory = false;
  state.insideStats = true;
  const view = document.querySelector("#view");
  view.classList.add("hidden");
  const stats = document.querySelector("#statistics");
  stats.classList.remove("hidden");
  updateStats();
}

export { state, categories };

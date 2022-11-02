import { categories, state } from "./index.js";
import { updateStats } from "./statistics.js";
import { Category } from "./Category.js";
import { switchModes } from "./modes";
import { createDiffCards } from "./difficult_cards.js";

function addNavLinks() {
  addHomeLink();
  addCategoryLinks();
  addStatsLink();
  manageMenu();
}

function addHomeLink() {
  const link = document.querySelector(".nav-item.home");
  link.addEventListener("click", toMainView);
  highlightCurrentLink(link);
}

function addCategoryLinks() {
  const links = document.querySelectorAll(".nav-item.category");

  for (const [i, link] of links.entries()) {
    const category = categories[i];
    link.textContent = category.name;
    link.addEventListener("click", () => {
      category.toCategoryView();
      category.addStartBtn();
    });
  }
}

function addStatsLink() {
  document.querySelector("#nav-stats").addEventListener("click", toStatsView);
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
  Category.showCategories();
  highlightCurrentLink(document.querySelector(".nav-item.home"));
  switchModes();
}

function toStatsView() {
  state.insideCategory = false;
  state.insideStats = true;
  switchModes();

  updateStats();
  createDiffCards();
}

function closeStats() {
  state.insideStats = false;
  switchModes();
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

import { addModeSwitchBtn, switchModes } from "./triggers.js";
import { Category } from "./Category.js";
import cards from "../data/cards.js";

const state = {
  insideCategory: false,
  playMode: false,
  gameOn: false,
};

Category.createCategoryCards();
addModeSwitchBtn();
addNavLinks();

function addNavLinks() {
  const links = document.querySelectorAll(".nav-item.category");

  for (let i = 0; i < 8; i++) {
    links[i].textContent = cards[0][i];
    links[i].addEventListener("click", () => {
      const category = new Category(i);
      category.createCards(i);
      hideMenu();
      openCategory();
    });
  }
}

function openCategory() {
  state.insideCategory = true;

  const view = document.querySelector("#view");
  view.classList.add("category-view");
  view.classList.remove("main-view");

  switchModes();
}

function addHomeLink() {
  const link = document.querySelector(".nav-item.home");
  link.addEventListener("click", () => {
    Category.createCategoryCards();
    hideMenu();
    switchModes();
  });
}

function hideMenu() {
  document.querySelector(".offcanvas-start").classList.remove("show");
  document.querySelector(".offcanvas-backdrop").classList.remove("show");
  document.body.style = "";
}

addHomeLink();

export { state };

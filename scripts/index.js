import { addModeSwitchBtn, switchModes } from "./triggers.js";
import { CategoryCard } from "./CategoryCard.js";
import cards from "../data/cards.js";

const state = {
  insideCategory: false,
  playMode: false,
  gameOn: false
};

CategoryCard.createCategoryCards();
addModeSwitchBtn();
addNavLinks()

function addNavLinks() {
  const links = document.querySelectorAll(".nav-item.category");
  console.log(links[0])
  for (let i=0; i<8; i++) {
    links[i].textContent = cards[0][i];
    links[i].addEventListener("click", (i) => CategoryCard.createCards(i));
    // why it doesnt work(((((
  }
}

function addHomeLink() {
  const link = document.querySelector(".nav-item.home");
  link.addEventListener("click", () => {
    CategoryCard.createCategoryCards();
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

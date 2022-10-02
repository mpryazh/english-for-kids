import { addModeSwitchBtn, switchModes } from "./triggers.js";
import { CategoryCard } from "./CategoryCard.js";

const state = {
  insideCategory: false,
  playMode: false,
};

CategoryCard.createCards();
addModeSwitchBtn();

function addHomeLink() {
  const link = document.querySelector(".nav-item.home");
  link.addEventListener("click", () => {
    CategoryCard.createCards();
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

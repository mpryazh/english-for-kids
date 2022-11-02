import { addModeSwitchBtn } from "./modes";
import { Category } from "./Category.js";
import { addNavLinks } from "./navigation.js";
import { createStats } from "./statistics.js";
import "./styles/style.css";
import "./styles/switchBtn.css";
import "./styles/bootstrap.css";

const state = {
  insideCategory: false,
  insideStats: false,
  playMode: false,
  gameOn: false,
};

const gameState = {
  category: null,
  wordId: null,
  mistakes: null,
  clickedCard: null,
};

const categories = [];

const cardColTemplate = document.querySelector("#view .col").cloneNode(true);

Category.createCategoryCards();

addModeSwitchBtn();

addNavLinks();

createStats();

export { state, categories, gameState, cardColTemplate };

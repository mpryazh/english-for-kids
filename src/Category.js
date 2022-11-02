import cards from "./data/cards.js";
import { Card } from "./Card.js";
import { categories, state, cardColTemplate } from "./index.js";
import { startGame } from "./game.js";
import { switchModes } from "./modes";
import {
  clearCardsRow,
  closeStats,
  highlightCurrentLink,
} from "./navigation.js";

class Category {
  constructor(id, difficultCategory = false) {
    this.id = id;
    this.startGame = startGame.bind(this);

    if (!difficultCategory) {
      this.name = cards[0][id];
      this.createCards();
      this.img = "../data/" + cards[id + 1][0].image;
      categories.push(this);
    }
  }

  static createCategoryCards() {
    for (let i = 0; i < 8; i++) {
      new Category(i);
    }
    Category.showCategories();
  }

  static showCategories() {
    Category.insert(categories);
    state.insideCategory = false;
    switchModes();

    for (const category of categories) {
      category.addNavigation();
    }
  }

  static insert(arr) {
    const row = clearCardsRow();

    for (const cardObj of arr) {
      const cardCol = cardColTemplate.cloneNode(true);
      row.append(cardCol);
      cardObj.card = cardCol.querySelector(".card");
      cardObj.fillInfo();
    }
  }

  createCards() {
    this.cards = [];

    for (let i = 0; i < 8; i++) {
      const card = new Card(this.id, i);
      this.cards.push(card);
    }
  }

  insertCards() {
    Category.insert(this.cards);
  }

  addStartBtn() {
    document.querySelector(".start-button").remove();

    const startBtn = document.createElement("button");
    startBtn.classList.add("button", "start-button");
    const icon = document.createElement("span");
    icon.classList.add("material-symbols-outlined");
    icon.textContent = "play_circle";
    const start = document.createElement("span");
    start.textContent = " Start";
    startBtn.append(icon, start);
    startBtn.addEventListener("click", this.startGame);

    document.querySelector("#game-buttons").append(startBtn);
  }

  addNavigation() {
    this.card.addEventListener("click", (e) => {
      this.toCategoryView(e.target);
      const link = document.querySelector(
        `.navbar-nav :nth-child(${this.id + 2})`
      );
      highlightCurrentLink(link);
    });
  }

  fillInfo() {
    this.card.querySelector(".card-title").textContent = this.name;
    this.card.querySelector("img").setAttribute("alt", this.name);
    this.card.querySelector("img").setAttribute("src", this.img);
  }

  toCategoryView() {
    if (state.insideStats) {
      closeStats();
    }

    this.insertCards();
    this.addStartBtn();

    document.querySelector("h1").textContent = this.name;
    state.insideCategory = true;
    switchModes();
  }
}

export { Category };

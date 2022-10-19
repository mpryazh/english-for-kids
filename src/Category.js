import cards from "./data/cards.js";
import { Card } from "./Card.js";
import { categories, state, cardColTemplate } from "./index.js";
import { startGame } from "./game.js";
import { switchModes } from "./play_train_modes";
import { clearCardsRow, closeStats } from "./navigation.js";

class Category {
  constructor(id, difficultCategory=false) {
    if (!difficultCategory) {
      this.category = cards[0][id];
      this.createCards(id);
      this.img = "../data/" + cards[id + 1][0].image;
      categories.push(this);
    }
    this.id = id;
    this.startGame = startGame.bind(this);
  }

  static showCategories() {
    for (const category of categories) {
      state.insideCategory = false;
      category.fillInfo();
      category.addNavigation();
      document.querySelector("h1").textContent = "English for kids";
    }
  }

  static createCategoryCards() {
    for (let i = 0; i < 8; i++) {
      new Category(i);
    }

    Category.reInsertCategoryCards();
  }

  static reInsertCategoryCards() {
    const row = clearCardsRow();

    for (const category of categories) {
      const cardCol = cardColTemplate.cloneNode(true);
      row.append(cardCol);
      category.card = cardCol.querySelector(".card");
    }
  }

  reInsertCards() {
    const row = clearCardsRow();

    for (const card of this.cards) {
      const cardCol = cardColTemplate.cloneNode(true);
      row.append(cardCol);
      card.card = cardCol.querySelector(".card");
      card.fillInfo();
    }
  }

  createCards(cat_id) {
    this.cards = [];

    for (let i = 0; i < 8; i++) {
      const card = new Card(cat_id, i);
      this.cards.push(card);
    }
  }

  addStartBtn() {
    document.querySelector(".start-button").remove();

    const startBtn = document.createElement("button");
    startBtn.classList.add("button", "start-button");
    startBtn.textContent = "Start";
    startBtn.addEventListener("click", this.startGame);
    document.querySelector("footer").append(startBtn);
  }

  addNavigation() {
    this.card.addEventListener("click", (e) => this.toCategoryView(e.target));
  }

  fillInfo() {
    this.card.querySelector(".card-title").textContent = this.category;
    this.card.querySelector("img").setAttribute("alt", this.category);
    this.card.querySelector("img").setAttribute("src", this.img);
  }

  toCategoryView() {
    this.reInsertCards();
    this.addStartBtn();

    if (state.insideStats) {
      closeStats();
    }

    state.insideCategory = true;
    const view = document.querySelector("#view");
    view.classList.add("category-view");
    view.classList.remove("main-view");
    document.querySelector("h1").textContent = this.category;

    switchModes();
  }
}

export { Category };

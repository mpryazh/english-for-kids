import cards from "./data/cards.js";
import { Card } from "./Card.js";
import { categories, state, cardColTemplate } from "./index.js";
import { startGame } from "./game.js";
import { switchModes } from "./play_train_modes";
import { clearCardsRow } from "./navigation.js";

class Category {
  constructor(id) {
    this.id = id;
    this.category = cards[0][id];
    this.img = "../data/" + cards[id + 1][0].image;
    this.createCards(id);
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
      const category = new Category(i);
      categories.push(category);
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

    state.insideCategory = true;
    const view = document.querySelector("#view");
    view.classList.add("category-view");
    view.classList.remove("main-view");
    document.querySelector("h1").textContent = this.category;

    switchModes();
  }
}

export { Category };

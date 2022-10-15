import cards from "./data/cards.js";
import { Card } from "./Card.js";
import CardParent from "./CardParent.js";
import { categories, state } from "./index.js";
import { switchModes, startGame } from "./triggers.js";

class Category extends CardParent {
  constructor(id) {
    super(id);
    this.category = cards[0][id];
    this.img = "../data/" + cards[id + 1][0].image;
    this.cards = [];
    this.fillInfo();
    this.createCards(id)
    this.addNavigation();
    state.insideCategory = false;
    this.startGame = startGame.bind(this);
  }

  static createCategoryCards() {
    const cardsDiv = document.querySelectorAll(".card");
    for (let i = 0; i < cardsDiv.length; i++) {
      const category = new Category(i);
      categories.push(category);
    }
  }

  createCards(cat_id) {
    const cardsDiv = document.querySelectorAll(".card");
    for (let i = 0; i < cardsDiv.length; i++) {
      const card = new Card(cat_id, i);
      this.cards.push(card);
    }
    // this.addStartBtn();
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

  toCategoryView(target) {
    if (target.closest(".card") && state.insideCategory) return;

    state.insideCategory = true;
    // this.createCards(this.id);
    this.addStartBtn();
    // надо отсюда заполнять инфо в карточках
    for(const card of this.cards) {
      card.fillInfo();
    }

    const view = document.querySelector("#view");
    view.classList.add("category-view");
    view.classList.remove("main-view");

    switchModes();
  }
}

export { Category };

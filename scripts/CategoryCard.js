import cards from "../data/cards.js";
import { Card } from "./Card.js";
import CardParent from "./CardParent.js";
import { state } from "./index.js";
import { switchModes, startGame } from "./triggers.js";

class CategoryCard extends CardParent {
  constructor(id) {
    super(id);
    this.category = cards[0][id];
    this.img = "../data/" + cards[id + 1][0].image;
    this.cards = [];
    this.fillInfo();
    this.addNavigation();
    state.insideCategory = false;
    this.startGame = startGame.bind(this);
  }

  static createCategoryCards() {
    const cardsDiv = document.querySelectorAll(".card");
    for (let i = 0; i < cardsDiv.length; i++) {
      new CategoryCard(i);
    }
  }

  createCards(cat_id) {
    const cardsDiv = document.querySelectorAll(".card");
    for (let i = 0; i < cardsDiv.length; i++) {
      const card = new Card(cat_id, i);
      this.cards.push(card);
    }
    document
      .querySelector(".start-button")
      .addEventListener("click", this.startGame);
  }

  static createCards(cat_id) {
    console.log("here")
    const cardsDiv = document.querySelectorAll(".card");
    for (let i = 0; i < cardsDiv.length; i++) {
      new Card(cat_id, i);
    }
    document
      .querySelector(".start-button")
      .addEventListener("click", this.startGame);
  }

  // нужно создавать один раз, а не каждый раз, когда перехожу к категории
  // запретить переход из меню на себя же, текущую вкладку
  addNavigation() {
    this.card.addEventListener("click", (e) => this.toCategoryView(e.target));

    // const navLinks = document.querySelectorAll(".nav-item.category");
    // this.navLink = navLinks[this.id];
    // this.navLink.textContent = this.category;
    // this.navLink.addEventListener("click", (e) => {
    //   this.toCategoryView(e.target);
    //   document.querySelector(".offcanvas-start").classList.remove("show");
    //   document.querySelector(".offcanvas-backdrop").classList.remove("show");
    //   document.body.style = "";
    // });
  }

  fillInfo() {
    this.card.querySelector(".card-title").textContent = this.category;
    this.card.querySelector("img").setAttribute("alt", this.category);
    this.card.querySelector("img").setAttribute("src", this.img);
  }

  toCategoryView(target) {
    if (target.closest(".card") && state.insideCategory) return;

    state.insideCategory = true;
    this.createCards(this.id);

    const view = document.querySelector("#view");
    view.classList.add("category-view");
    view.classList.remove("main-view");

    switchModes();
  }
}

export { CategoryCard };

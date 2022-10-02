import cards from "../data/cards.js";
import CardParent from "../scripts/CardParent.js";

class Card extends CardParent {
  constructor(cat_id, id) {
    super(id);
    this.category = cards[0][cat_id];
    this.obj = cards[cat_id + 1][id];
    this.img = "../data/" + this.obj.image;
    this.fillInfo();

    // flip cards
    // add sound
  }

  static createCards(cat_id) {
    const cardsDiv = document.querySelectorAll(".card");
    for (let i = 0; i < cardsDiv.length; i++) {
      new Card(cat_id, i);
    }
  }

  fillInfo() {
    this.card.querySelector(".card-title").textContent = this.obj.word;
    this.card.querySelector("img").setAttribute("alt", this.obj.word);
    this.card.querySelector("img").setAttribute("src", this.img);
  }
}

export { Card };

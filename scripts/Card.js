import cards from "../data/cards.js";
import CardParent from "../scripts/CardParent.js";

class Card extends CardParent {
  constructor(cat_id, id) {
    super(id);
    this.category = cards[0][cat_id];
    this.obj = cards[cat_id + 1][id];
    this.img = "../data/" + this.obj.image;
    this.sound = "../data/" + this.obj.audioSrc;
    this.fillInfo();
    this.flipped = false;
  }

  static createCards(cat_id) {
    const cardsDiv = document.querySelectorAll(".card");
    for (let i = 0; i < cardsDiv.length; i++) {
      new Card(cat_id, i);
    }
  }

  fillInfo() {
    const title = this.card.querySelector(".card-title");
    title.textContent = this.obj.word;
    this.card.querySelector("img").setAttribute("alt", this.obj.word);
    this.card.querySelector("img").setAttribute("src", this.img);
    this.card.querySelector("audio").setAttribute("src", this.sound);

    this.card
      .querySelector(".flip-button")
      .addEventListener("click", (e) => this.flipCard(e, title));
    this.card.addEventListener("mouseleave", () => this.flipCardBack(title));
    this.card.addEventListener("click", () => this.playAudio());
  }

  flipCard(e, title) {
    e.stopPropagation();
    if (!this.flipped) {
      title.textContent = this.obj.translation;
      this.flipped = true;
      this.card.classList.add("flipped");
    }
  }

  flipCardBack(title) {
    if (!this.flipped) {
      return;
    }
    title.textContent = this.obj.word;
    this.flipped = false;
    this.card.classList.remove("flipped");
  }

  playAudio() {
    if (this.flipped) {
      return;
    }
    this.card.querySelector("audio").play();
  }
}

export { Card };

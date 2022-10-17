import cards from "./data/cards.js";
import { state } from "./index.js";
import { calculatePercent, incrementClicks } from "./statistics";

class Card {
  constructor(cat_id, id) {
    this.id = id;
    this.category_id = cat_id;
    this.key = cat_id + "_" + id;
    this.category = cards[0][cat_id];
    this.dataObj = cards[cat_id + 1][id];
    this.img = "../data/" + this.dataObj.image;
    this.sound = "./data/" + this.dataObj.audioSrc;
    this.flipped = false;
  }

  fillInfo() {
    const title = this.card.querySelector(".card-title");
    title.textContent = this.dataObj.word;
    this.card.querySelector("img").setAttribute("alt", this.dataObj.word);
    this.card.querySelector("img").setAttribute("src", this.img);
    this.card.querySelector("audio").setAttribute("src", this.sound);

    this.card
      .querySelector(".flip-button")
      .addEventListener("click", (e) => this.flipCard(e, title));

    this.card.addEventListener("mouseleave", () => this.flipCardBack(title));
    this.card.addEventListener("click", () => {
      this.playAudio();
      incrementClicks(this);
    });
  }

  flipCard(e, title) {
    e.stopPropagation();
    if (!this.flipped) {
      title.textContent = this.dataObj.translation;
      this.flipped = true;
      this.card.classList.add("flipped");
    }
  }

  flipCardBack(title) {
    if (!this.flipped) return;
    title.textContent = this.dataObj.word;
    this.flipped = false;
    this.card.classList.remove("flipped");
  }

  playAudio() {
    if (this.flipped || state.playMode) {
      return;
    }
    this.card.querySelector("audio").play();
  }

}

export { Card };

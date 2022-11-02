import cards from "./data/cards.js";
import { state } from "./index.js";
import { incrementClicks } from "./statistics";

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
    const frontImg = this.card.querySelector(".front-side img");
    frontImg.setAttribute("alt", this.dataObj.word);
    frontImg.setAttribute("src", this.img);
    this.card.querySelector(".front-side .card-title").textContent =
      this.dataObj.word;
    this.card.querySelector("audio").setAttribute("src", this.sound);

    const backImg = this.card.querySelector(".back-side img");
    backImg.setAttribute("alt", "");
    backImg.setAttribute("src", this.img);
    this.card.querySelector(".back-side .card-title").textContent =
      this.dataObj.translation;

    this.addCardEventListeners();
  }

  addCardEventListeners() {
    this.card
      .querySelector(".flip-button")
      .addEventListener("click", () => this.flipCard());

    this.card
      .querySelector(".back-side")
      .addEventListener("mouseleave", () => this.flipCard());

    this.card.addEventListener("click", () => {
      if (this.flipped || state.playMode) {
        return;
      }
      this.playAudio();
      incrementClicks(this);
    });
  }

  flipCard() {
    if (!this.flipped) {
      this.flipped = true;
      this.card.classList.add("flipped");
    } else {
      this.flipped = false;
      this.card.classList.remove("flipped");
    }
  }

  playAudio() {
    this.card.querySelector("audio").play();
  }

  getWordData() {
    return {
      word: this.dataObj.word,
      category: this.category,
      translation: this.dataObj.translation,
    };
  }
}

export { Card };

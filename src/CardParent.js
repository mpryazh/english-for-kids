import { state } from "./index.js";
import { removeGameEventListeners } from "./triggers.js";

class CardParent {
  constructor(id) {
    this.id = id;
    const cardsDiv = document.querySelectorAll(".card");
    this.card = cardsDiv[id];
    removeGameEventListeners();
  }
  playAudio() {
    if (this.flipped || state.playMode) {
      return;
    }
    this.card.querySelector("audio").play();
  }
}

export default CardParent;

import { removeGameEventListeners } from "./triggers.js";

class CardParent {
  constructor(id) {
    this.id = id;
    const cardsDiv = document.querySelectorAll(".card");
    this.card = cardsDiv[id];
    removeGameEventListeners();
  }
}

export default CardParent;

class CardParent {
  constructor(id) {
    this.id = id;
    const cardsDiv = document.querySelectorAll(".card");
    this.card = cardsDiv[id];
  }
}

export default CardParent;

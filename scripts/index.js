import cards from "../data/cards.js"

const cardsDiv = document.querySelectorAll(".card");

class CategoryCard {
    constructor(id) {
        this.id = id;
        this.category = cards[0][id];
        this.card = cardsDiv[id];
        this.img = "../data/"+cards[1][id]
    }

    fillInfo() {
        this.card.querySelector(".card-title").textContent = this.category;
        this.card.querySelector("img").setAttribute("alt", this.category);
        this.card.querySelector("img").setAttribute("src", this.img);
    }


}

for(let i=0; i<cardsDiv.length; i++) {
    const card = new CategoryCard(i);
    card.fillInfo();
}

function fillMenu() {
    const navItems = document.querySelectorAll(".nav-item");
    const length = cards[0].length;
    for (let i=0; i<length; i++) {
        navItems[i].textContent = cards[0][i]
    }
}

fillMenu();

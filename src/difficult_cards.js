import { getStats } from "./statistics.js";
import { categories } from "./index.js";
import { Category } from "./Category.js";

function createDiffCards() {
  const difficultCategory = new Category(-1, true);
  difficultCategory.name = "Difficult words";
  difficultCategory.cards = [];
  const cardsWithMistakes = [];

  for (const category of categories) {
    for (const card of category.cards) {
      const stats = getStats(card.key);
      if (stats.mistakes) {
        cardsWithMistakes.push({ card: card, mistakes: stats.mistakes });
      }
    }
  }

  const difficultCards =
    cardsWithMistakes.length > 8
      ? cardsWithMistakes
          .sort((a, b) => b.mistakes - a.mistakes)
          .slice(0, 8)
          .map((obj) => obj.card)
      : cardsWithMistakes.map((obj) => obj.card);

  difficultCategory.cards.push(...difficultCards);

  addDiffEventListener(difficultCategory);
}

function addDiffEventListener(difficultCategory) {
  const repeatBtn = document.querySelector("#repeat-diff-btn");

  if (!difficultCategory.cards?.length) {
    repeatBtn.setAttribute("disabled", "true");
    return;
  }

  repeatBtn.removeAttribute("disabled");
  repeatBtn.addEventListener("click", () => {
    difficultCategory.toCategoryView();
  });
}

export { addDiffEventListener, createDiffCards };

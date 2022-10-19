import { getStats } from "./statistics.js";
import { difficultCategory, categories } from "./index.js";

function createDiffCards() {
  difficultCategory.category = "Difficult words";
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
}

function addDiffEventListener() {
  document.querySelector("#repeat-diff-btn").addEventListener("click", () => {
    if (!difficultCategory.cards?.length) {
      console.log("no cards");
      return;
    }
    difficultCategory.toCategoryView();
  });
}

export { addDiffEventListener, createDiffCards };

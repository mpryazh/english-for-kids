import { gameState } from "./index.js";
import { clearCardsRow } from "./navigation.js";
import { getPromiseFromEvent } from "./game.js";

async function showFeedback() {
  clearCardsRow();
  document.querySelector(".start-button").classList.add("hidden");

  const feedbackView = document.createElement("div");
  feedbackView.classList.add("feedback-view");

  const score = document.createElement("h3");
  const emoji = document.createElement("span");
  emoji.classList.add("emoji");

  feedbackView.append(score, emoji);
  document.querySelector("main").append(feedbackView);

  if (gameState.mistakes) {
    score.textContent = `Oh no! ${gameState.mistakes} mistakes :(`;
    emoji.textContent = "😢😢😢";
    new Audio("../data/audio/failure.mp3").play();
  } else {
    score.textContent = "Excellent! No mistakes";
    emoji.textContent = "😄😄😄";
    new Audio("../data/audio/success.mp3").play();
  }

  const wait = new Promise((r) =>
    setTimeout(() => {
      feedbackView.textContent = "";
      r("waited");
    }, 8000)
  );

  const clickOnMenu = getPromiseFromEvent(
    document.querySelector("#menu"),
    "click"
  );

  return Promise.race([wait, clickOnMenu]);
}

function removeFeedback() {
  document.querySelector(".feedback-view").remove();
}

export { showFeedback, removeFeedback };

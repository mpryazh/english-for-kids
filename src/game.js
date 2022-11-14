import { state, gameState } from "./index.js";
import { toMainView } from "./navigation.js";
import {
  calculatePercent,
  incrementMistakes,
  incrementGuessed,
} from "./statistics.js";
import { showFeedback, removeFeedback } from "./feedback.js";

async function startGame() {
  startGameState(this);

  const indexes = [...Array(this.cards.length).keys()];
  shuffle(indexes);

  try {
    for (const id of indexes) {
      gameState.wordId = id;
      await askWord(this, id);
    }
  } catch (err) {
    return;
  }

  stopGameState();

  const res = await showFeedback();
  removeFeedback();
  if (res === "waited") {
    toMainView();
  }
}

async function askWord(category, id) {
  const sound = category.cards[id].sound;
  const playSoundBinded = playSound.bind(category, sound);

  const repeatBtn = document.querySelector(".repeat-button");
  repeatBtn.addEventListener("click", playSoundBinded);

  try {
    addListeners(id);
    const cardObj = category.cards[id];

    playSoundBinded();
    await getAnswer(cardObj.card);

    incrementGuessed(cardObj);
    calculatePercent(cardObj);
  } catch (err) {
    repeatBtn.removeEventListener("click", playSoundBinded);
    stopGameState();
    throw err;
  }

  repeatBtn.removeEventListener("click", playSoundBinded);
  removeGameEventListeners();

  await new Promise((r) => setTimeout(r, 1200));
}

function addListeners(id) {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card, index) => {
    if (!card.classList.contains("inactive-card")) {
      card.addEventListener("click", (e) => handleClick(e));
      if (index === id) {
        card.addEventListener("click", handleSuccess);
      } else {
        card.addEventListener("click", handleFailure);
      }
    }
  });
}

async function getAnswer(card) {
  const receiveRightAnswer = getPromiseFromEvent(card);
  const clickOnMenu = getPromiseFromEvent(document.querySelector("#menu"));
  const switchModes = getPromiseFromEvent(
    document.querySelector("#play-train-btn")
  );
  const res = await Promise.race([
    receiveRightAnswer,
    clickOnMenu,
    switchModes,
  ]);

  if (res.id === "menu" || res.id === "play-train-btn") {
    throw Error("User left the game");
  }
}

function getPromiseFromEvent(item, event = "click") {
  return new Promise((resolve) => {
    const listener = () => {
      item.removeEventListener(event, listener);
      resolve(item);
    };
    item.addEventListener(event, listener);
  });
}

function handleClick(e) {
  if (state.gameOn === false) {
    return;
  }
  gameState.clickedCard = e.target.closest(".card");
}

function handleSuccess() {
  successSound();
  makeCardIncative();
  addStar(true);
}

function handleFailure() {
  failureSound();
  countMistakes();
  addStar(false);
}

function addStar(correct) {
  const container = document.querySelector("#stars-container");
  const star = document.createElement("p");
  star.textContent = correct ? "💎" : "💣";
  star.classList.add("star");
  container.append(star);
}

function makeCardIncative() {
  gameState.clickedCard.removeEventListener("click", handleSuccess);
  gameState.clickedCard.classList.add("inactive-card");
}

function countMistakes() {
  const card = gameState.category.cards[gameState.wordId];
  incrementMistakes(card);
  gameState.mistakes++;
}

function removeGameEventListeners() {
  document.querySelectorAll(".card").forEach((card) => {
    card.removeEventListener("click", handleSuccess);
    card.removeEventListener("click", handleFailure);
  });
}

function startGameState(category) {
  document.querySelector("main").classList.add("game-on");
  state.gameOn = true;
  gameState.category = category;
  gameState.mistakes = 0;
}

function stopGameState() {
  document
    .querySelectorAll(".card")
    .forEach((card) => card.classList.remove("inactive-card"));
  document.querySelector("main").classList.remove("game-on");
  removeGameEventListeners();
  document.querySelector("#stars-container").textContent = "";
  state.gameOn = false;
}

async function successSound() {
  await new Audio("./data/audio/correct.mp3").play();
}

async function failureSound() {
  await new Audio("./data/audio/error.mp3").play();
}

async function playSound(sound) {
  await new Audio(sound).play();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export {
  startGame,
  removeGameEventListeners,
  stopGameState,
  getPromiseFromEvent,
};

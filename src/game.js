import { state, gameState } from "./index.js";
import { clearCardsRow, toMainView } from "./navigation.js";
import { switchModes } from "./play_train_modes.js";
import {
  calculatePercent,
  incrementMistakes,
  incrementGuessed,
} from "./statistics.js";
import { showFeedback, removeFeedback } from "./feedback.js";

async function startGame() {
  console.log("start game");

  document.querySelector("main").classList.add("game-on");
  state.gameOn = true;
  gameState.category = this;
  gameState.mistakes = 0;

  const indexes = [...Array(this.cards.length).keys()];
  shuffle(indexes);

  try {
    for (const id of indexes) {
      gameState.wordId = id;
      await askWord(this, id);
    }
  } catch (err) {
    stopGame();
    console.log("game stopped");
    return;
  }

  stopGame();

  const res = await showFeedback();
  removeFeedback();
  if (res === "waited") {
    toMainView();
  }
}

async function askWord(category, id) {
  const sound = category.cards[id].sound;

  const playSoundBinded = playSound.bind(category, sound);
  playSoundBinded();

  const repeatBtn = document.querySelector(".repeat-button");
  repeatBtn.addEventListener("click", playSoundBinded);

  try {
    const success = addListeners(id, category);
    await success();

    const card = category.cards[id];
    incrementGuessed(card);
    calculatePercent(card);
  } catch (err) {
    repeatBtn.removeEventListener("click", playSoundBinded);
    removeGameEventListeners();
    throw err;
  }

  repeatBtn.removeEventListener("click", playSoundBinded);
  removeGameEventListeners();

  await new Promise((r) => setTimeout(r, 1200));
}

function addListeners(id) {
  const cards = document.querySelectorAll(".card");
  const waitSuccessBinded = waitForButtonClick.bind(this, cards[id]);

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

  return waitSuccessBinded;
}

function handleClick(e) {
  if (state.gameOn === false) {
    return;
  }
  const clickedCard = e.target.closest(".card");
  gameState.clickedCard = clickedCard;
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
  const id = gameState.wordId;
  const category = gameState.category;
  const card = category.cards[id];
  incrementMistakes(card);
  gameState.mistakes++;
}

async function waitForButtonClick(card) {
  const receiveRightAnswer = getPromiseFromEvent(card, "click");
  const clickOnMenu = getPromiseFromEvent(
    document.querySelector("#menu"),
    "click"
  );
  const switchModes = getPromiseFromEvent(
    document.querySelector("#play-train-btn"),
    "click"
  );
  const res = await Promise.race([
    receiveRightAnswer,
    clickOnMenu,
    switchModes,
  ]);
  console.log(res);
  if (res.id === "menu") {
    throw Error("menu");
  }
  if (res.id === "play-train-btn") {
    throw Error("switch");
  }
  return 1;
}

function getPromiseFromEvent(item, event) {
  return new Promise((resolve) => {
    const listener = () => {
      item.removeEventListener(event, listener);
      resolve(item);
    };
    item.addEventListener(event, listener);
  });
}

function removeGameEventListeners() {
  document.querySelectorAll(".card").forEach((card) => {
    card.removeEventListener("click", handleSuccess);
    card.removeEventListener("click", handleFailure);
  });
}

function stopGame() {
  document
    .querySelectorAll(".card")
    .forEach((card) => card.classList.remove("inactive-card"));
  document.querySelector("main").classList.remove("game-on");
  removeGameEventListeners();
  document.querySelector("#stars-container").textContent = "";
  state.gameOn = false;
}

function successSound() {
  new Audio("../data/audio/correct.mp3").play();
}

function failureSound() {
  new Audio("../data/audio/error.mp3").play();
}

function playSound(sound) {
  new Audio(sound).play();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export { startGame, removeGameEventListeners, stopGame, getPromiseFromEvent };

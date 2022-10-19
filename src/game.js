import { state, gameState } from "./index.js";
import { clearCardsRow, toMainView } from "./navigation.js";
import { switchModes } from "./play_train_modes.js";
import {
  calculatePercent,
  incrementMistakes,
  incrementGuessed,
} from "./statistics.js";

async function startGame() {
  console.log("start game");

  document.querySelector("footer").classList.add("game-on");
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

  state.gameOn = false;
  state.insideCategory = false;
  switchModes();

  const res = await showFeedback();
  if (res === "waited") {
    toMainView();
  }
}

async function showFeedback() {
  clearCardsRow();

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
    if (err.message === "menu") {
      document
        .querySelector(".start-button")
        .removeEventListener("click", category.startGame);
    }
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
  addStar("right");
}

function handleFailure() {
  failureSound();
  countMistakes();
  addStar("wrong");
}

function addStar(right_wrong) {
  const container = document.querySelector("#stars-container");
  const star = document.createElement("img");
  star.setAttribute("src", "./data/img/favicon.png");
  star.setAttribute("alt", "");
  star.classList.add("star", `${right_wrong}-star`);
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
    // card.classList.remove("inactive-card");
  });
}

function stopGame() {
  document
    .querySelectorAll(".card")
    .forEach((card) => card.classList.remove("inactive-card"));
  document.querySelector("footer").classList.remove("game-on");
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

export { startGame, removeGameEventListeners, stopGame };

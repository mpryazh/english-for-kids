import { state, gameState } from "./index.js";
import {
  calculatePercent,
  incrementMistakes,
  incrementGuessed
} from "./statistics.js";

async function startGame() {
  console.log("start game");

  document.querySelector("footer").classList.add("game-on");
  state.gameOn = true;
  gameState.category = this;

  const indexes = [...Array(8).keys()];
  shuffle(indexes);

  try {
    for (const id of indexes) {
      gameState.wordId = id;
      await askWord(this, id);
    }
  } catch (err) {
    stopGame();
  }

  console.log("all done congrats");
  state.gameOn = false;
  document.querySelector("footer").classList.remove("game-on");
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
    console.log("SUCCESS");
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

  await new Promise((r) => setTimeout(r, 3000));
}

function addListeners(id) {
  const cards = document.querySelectorAll(".card");
  const waitSuccessBinded = waitForButtonClick.bind(this, cards[id]);

  cards.forEach((card, index) => {
    if (index === id) {
      card.addEventListener("click", successSound);
    } else {
      card.addEventListener("click", failureSound);
      card.addEventListener("click", countMistakes);
    }
  });

  return waitSuccessBinded;
}

function countMistakes() {
  const id = gameState.wordId;
  const category = gameState.category;
  const card = category.cards[id];
  incrementMistakes(card);
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
    card.removeEventListener("click", successSound);
    card.removeEventListener("click", failureSound);
    card.removeEventListener("click", countMistakes);
  });
}

function stopGame() {
  document.querySelector("footer").classList.remove("game-on");
  removeGameEventListeners();
  state.gameOn = false;
}

function successSound() {
  new Audio("../data/audio/success.mp3").play();
}

function failureSound() {
  new Audio("../data/audio/failure.mp3").play();
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

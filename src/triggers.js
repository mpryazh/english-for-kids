import { state } from "./index.js";

function addModeSwitchBtn() {
  let switchBtn = document.querySelector("#play-train-btn .checkbox");
  switchBtn.addEventListener("click", toggle);

  function toggle() {
    if (switchBtn.checked) {
      state.playMode = true;
      switchModes();
    } else {
      state.playMode = false;
      switchModes();
    }
  }
}

/*
webpack, eslint, eslint-config-airbnb-base and babel are used +10
*/

function switchModes() {
  const view = document.querySelector("#view");
  if (state.insideCategory) {
    view.classList.add("category-view");
    view.classList.remove("main-view");
  }
  if (!state.insideCategory) {
    view.classList.remove("category-view");
    view.classList.add("main-view");
  }
  if (state.playMode) {
    view.classList.add("play-mode");
  }
  if (!state.playMode) {
    view.classList.remove("play-mode");
  }
  if (state.gameOn && !state.playMode) {
    stopGame();
  }
}

function stopGame() {
  document.querySelector("footer").classList.remove("game-on");
  removeGameEventListeners();
  state.gameOn = false;
}

async function startGame() {
  console.log("start game");

  document.querySelector("footer").classList.add("game-on");
  state.gameOn = true;

  const indexes = [...Array(8).keys()];
  shuffle(indexes);

  const askWordBinded = askWord.bind(this);

  try {
    for (const id of indexes) {
      await askWordBinded(id);
    }
  } catch (err) {
    stopGame();
  }

  console.log("all done congrats");
  state.gameOn = false;
  document.querySelector("footer").classList.remove("game-on");
}

async function askWord(id) {
  const sound = this.cards[id].sound;

  const playSoundBinded = playSound.bind(this, sound);
  playSoundBinded();

  const repeatBtn = document.querySelector(".repeat-button");
  repeatBtn.addEventListener("click", playSoundBinded);

  try {
    const success = addListeners(id);
    await success();
    console.log("SUCCESS");
  } catch (err) {
    if (err.message === "menu") {
      document
        .querySelector(".start-button")
        .removeEventListener("click", this.startGame);
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
    }
  });

  return waitSuccessBinded;
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
  });
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

export { addModeSwitchBtn, switchModes, startGame, removeGameEventListeners };

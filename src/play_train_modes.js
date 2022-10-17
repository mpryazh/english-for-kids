import { state } from "./index.js";
import { stopGame } from "./game";

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

function switchModes() {
  const view = document.querySelector("#view");
  if (state.insideCategory) {
    view.classList.add("category-view");
    view.classList.remove("main-view");
  }
  if (!state.insideCategory) {
    view.classList.remove("category-view");
    view.classList.add("main-view");
    stopGame();
  }
  if (state.playMode) {
    view.classList.add("play-mode");
  }
  if (!state.playMode) {
    view.classList.remove("play-mode");
    stopGame();
  }
  if (state.gameOn && !state.playMode) {
    stopGame();
  }
  if (state.insideStats) {
    stopGame();
    view.classList.remove("category-view");
  }
}

export { addModeSwitchBtn, switchModes };

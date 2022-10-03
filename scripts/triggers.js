import { state } from "./index.js";

function addModeSwitchBtn() {
  let switchBtn = document.querySelector("#play-train-btn .checkbox");
  switchBtn.addEventListener("click", toggle);

  function toggle() {
    if (switchBtn.checked) {
      console.log("Play");
      state.playMode = true;
      switchModes();
    } else {
      console.log("Train");
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
  }
  if (state.playMode) {
    view.classList.add("play-mode");
  }
  if (!state.playMode) {
    view.classList.remove("play-mode");
  }
}

export { addModeSwitchBtn, switchModes };

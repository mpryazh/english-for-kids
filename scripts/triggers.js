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
  const footer = document.querySelector("footer");
  const view = document.querySelector("#view");
  if (state.playMode && state.insideCategory) {
    footer.classList.remove("hidden");
  }
  if (state.playMode) {
    view.classList.add("play-mode");
  }
  if (!state.insideCategory) {
    footer.classList.add("hidden");
  }
  if (!state.playMode) {
    view.classList.remove("play-mode");
    footer.classList.add("hidden");
  }
}

export { addModeSwitchBtn, switchModes };

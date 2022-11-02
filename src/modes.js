import { state } from "./index.js";;

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
  const title = document.querySelector("h1");

  if (state.insideCategory) {
    view.classList.add("category-view");
    view.classList.remove("main-view");
  }
  if (!state.insideCategory) {
    view.classList.remove("category-view");
    view.classList.add("main-view");
    title.textContent = "English for kids";
  }
  if (state.playMode) {
    view.classList.add("play-mode");
  }
  if (!state.playMode) {
    view.classList.remove("play-mode");
  }
  if (state.insideStats) {
    view.classList.add("hidden");
    document.querySelector("#statistics").classList.remove("hidden");
    document.querySelector("header").classList.add("stats-open");
    title.textContent = "Statistics";
  }
  if (!state.insideStats) {
    view.classList.remove("hidden");
    document.querySelector("#statistics").classList.add("hidden");
    document.querySelector("header").classList.remove("stats-open");
  }
}

export { addModeSwitchBtn, switchModes };

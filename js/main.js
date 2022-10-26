import SceneManager from "./SceneManager.js";
import * as Settings from "./constants.js";

const canvas = document.querySelector("canvas.tunnel");
const sceneManager = new SceneManager(canvas);

const nextBtn = document.getElementById("next");

const cursor = {
  x: 0,
  y: 0
};

bindEventListeners();
render();

function bindEventListeners() {
  window.onresize = resizeCanvas;
  resizeCanvas();

  window.onmousemove = setCursor;

  nextBtn.onclick = startNext;
}

function setCursor(event) {
  cursor.x = event.clientX / Settings.SCREEN_SIZES.width - 0.5;
  cursor.y = event.clientY / Settings.SCREEN_SIZES.height - 0.5;
}

function startNext() {
  sceneManager.animateMortalMove();
  sceneManager.animateSpeechBubble();
}

function resizeCanvas() {
  sceneManager.onWindowResize();
}

function render() {
  requestAnimationFrame(render);
  sceneManager.update(cursor);
}

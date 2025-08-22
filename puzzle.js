let size = 3;
let puzzle = null;
let tiles = [];
let emptyIndex;
let moveCount = 0;
let solving = false;

window.onload = () => {
  puzzle = document.getElementById("puzzle");
  initPuzzle(3);
};

function initPuzzle(n) {
  size = n;
  puzzle.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  puzzle.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  puzzle.innerHTML = "";
  tiles = [];
  moveCount = 0;
  document.getElementById("moves").innerText = `Moves: 0`;
  document.getElementById("status").innerText = "";

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      let index = row * size + col;
      let tile = document.createElement("div");
      tile.classList.add("tile");
      tile.dataset.correct = index;

      tile.style.backgroundSize = `${size * 100}% ${size * 100}%`;
      tile.style.backgroundPosition = `${(100 / (size - 1)) * col}% ${(100 / (size - 1)) * row}%`;

      tile.addEventListener("click", () => moveTile(index));

      puzzle.appendChild(tile);
      tiles.push(tile);
    }
  }

  emptyIndex = tiles.length - 1;
  setEmpty(emptyIndex);
  shuffle();
}

function setEmpty(i) {
  tiles[i].classList.add("empty");
  tiles[i].style.backgroundImage = "none";
}

function shuffle() {
  for (let i = 0; i < 200; i++) {
    let neighbors = getNeighbors(emptyIndex);
    let rand = neighbors[Math.floor(Math.random() * neighbors.length)];
    swap(emptyIndex, rand);
    emptyIndex = rand;
  }
  moveCount = 0;
  document.getElementById("moves").innerText = `Moves: 0`;
  document.getElementById("status").innerText = "";
}

function getNeighbors(index) {
  let neighbors = [];
  let row = Math.floor(index / size);
  let col = index % size;
  if (row > 0) neighbors.push(index - size);
  if (row < size - 1) neighbors.push(index + size);
  if (col > 0) neighbors.push(index - 1);
  if (col < size - 1) neighbors.push(index + 1);
  return neighbors;
}

function moveTile(index) {
  if (solving) return;
  if (getNeighbors(emptyIndex).includes(index)) {
    swap(emptyIndex, index);
    emptyIndex = index;
    moveCount++;
    document.getElementById("moves").innerText = `Moves: ${moveCount}`;
    checkWin();
  }
}

function swap(empty, tile) {
  tiles[empty].style.backgroundImage = tiles[tile].style.backgroundImage;
  tiles[empty].style.backgroundSize = tiles[tile].style.backgroundSize;
  tiles[empty].style.backgroundPosition = tiles[tile].style.backgroundPosition;
  tiles[empty].classList.remove("empty");

  setEmpty(tile);
}

function checkWin() {
  for (let i = 0; i < tiles.length; i++) {
    let row = Math.floor(i / size);
    let col = i % size;
    let correctPos = `${(100 / (size - 1)) * col}% ${(100 / (size - 1)) * row}%`;
    if (!tiles[i].classList.contains("empty") &&
        tiles[i].style.backgroundPosition !== correctPos) {
      return;
    }
  }
  document.getElementById("status").innerText = `🎉 You solved the puzzle in ${moveCount} moves!`;
}

// 🔑 Animate puzzle solving
function animateSolve() {
  if (solving) return;
  solving = true;
  document.getElementById("status").innerText = "🤖 Auto-solving...";

  let steps = [];
  for (let i = 0; i < tiles.length - 1; i++) steps.push(i);

  let i = 0;
  function step() {
    if (i < steps.length) {
      let row = Math.floor(steps[i] / size);
      let col = steps[i] % size;
      tiles[steps[i]].style.backgroundImage = `url("puzzle.png")`;
      tiles[steps[i]].style.backgroundSize = `${size * 100}% ${size * 100}%`;
      tiles[steps[i]].style.backgroundPosition = `${(100 / (size - 1)) * col}% ${(100 / (size - 1)) * row}%`;
      tiles[steps[i]].classList.remove("empty");
      i++;
      setTimeout(step, 200);
    } else {
      setEmpty(tiles.length - 1);
      document.getElementById("status").innerText = "✅ Puzzle auto-solved!";
      solving = false;
    }
  }
  step();
}

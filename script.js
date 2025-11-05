let array = [];
let delay = 200;
let isPaused = false;
let isSorting = false;
let stopSorting = false;
const barsContainer = document.getElementById("bars");

function generateArray(force = false) {
  stopSorting = true;
  if (isSorting && !force) return;
  isSorting = false;
  isPaused = false;
  document.getElementById("pauseResumeText").innerText = "Pause";

  const size = document.getElementById("sizeSlider").value;
  array = [];
  barsContainer.innerHTML = "";
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * 500) + 10);
  }
  renderArray();
}

function renderArray(highlightIndices = [], finalSorted = false) {
  barsContainer.innerHTML = "";
  const size = array.length;
  for (let i = 0; i < size; i++) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = array[i] + "px";
    bar.style.width = (600 / size) + "px";
    if (finalSorted) {
      bar.style.background = "#22c55e";
    } else if (highlightIndices.includes(i)) {
      bar.style.background = "#f87171";
    }
    barsContainer.appendChild(bar);
  }
}

function sleep(ms) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      delay = document.getElementById("speedSlider").value;
      if (!isPaused && !stopSorting) {
        clearInterval(interval);
        resolve();
      }
    }, ms);
  });
}

function togglePause() {
  if (!isSorting) return;
  isPaused = !isPaused;
  document.getElementById("pauseResumeText").innerText = isPaused ? "Resume" : "Pause";
}

async function bubbleSort() {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (stopSorting) return;
      renderArray([j, j + 1]);
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
      await sleep(delay);
    }
  }
  renderArray([], true);
}

async function selectionSort() {
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      if (stopSorting) return;
      renderArray([minIndex, j]);
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
      await sleep(delay);
    }
    [array[i], array[minIndex]] = [array[minIndex], array[i]];
  }
  renderArray([], true);
}

async function insertionSort() {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      if (stopSorting) return;
      renderArray([j, j + 1]);
      array[j + 1] = array[j];
      j--;
      await sleep(delay);
    }
    array[j + 1] = key;
  }
  renderArray([], true);
}

async function mergeSort(start = 0, end = array.length - 1) {
  if (stopSorting) return;
  if (start >= end) return;
  let mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  if (stopSorting) return;
  let left = array.slice(start, mid + 1);
  let right = array.slice(mid + 1, end + 1);
  let i = 0, j = 0, k = start;
  while (i < left.length && j < right.length) {
    if (stopSorting) return;
    renderArray([k]);
    if (left[i] <= right[j]) {
      array[k++] = left[i++];
    } else {
      array[k++] = right[j++];
    }
    await sleep(delay);
  }
  while (i < left.length) array[k++] = left[i++];
  while (j < right.length) array[k++] = right[j++];
  renderArray();
}

async function quickSort(start = 0, end = array.length - 1) {
  if (stopSorting) return;
  if (start >= end) return;
  let index = await partition(start, end);
  await quickSort(start, index - 1);
  await quickSort(index + 1, end);
}

async function partition(start, end) {
  if (stopSorting) return;
  let pivot = array[end];
  let i = start - 1;
  for (let j = start; j < end; j++) {
    if (stopSorting) return;
    renderArray([j, end]);
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
    }
    await sleep(delay);
  }
  [array[i + 1], array[end]] = [array[end], array[i + 1]];
  return i + 1;
}

async function sort() {
  if (array.length === 0) return alert("Generate an array first!");
  delay = document.getElementById("speedSlider").value;
  let algo = document.getElementById("algorithm").value;
  isSorting = true;
  stopSorting = false;
  isPaused = false;
  document.getElementById("pauseResumeText").innerText = "Pause";

  if (algo === "bubble") await bubbleSort();
  else if (algo === "selection") await selectionSort();
  else if (algo === "insertion") await insertionSort();
  else if (algo === "merge") await mergeSort();
  else if (algo === "quick") await quickSort();

  if (!stopSorting) {
    renderArray([], true);
  }
  isSorting = false;
}

// Generate initial array on page load
generateArray();

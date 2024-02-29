// DOM elements
const formContainer = document.getElementById("form-container");
const gameContainer = document.getElementById("game-container");
const startForm = document.getElementById("start-form");
const nameInput = document.getElementById("name");
const cardCountInput = document.getElementById("card-count");
const gridContainer = document.querySelector(".grid-container");
const playerNameElement = document.querySelector(".player-name");
const timerElement = document.querySelector(".timer");

// Variables to manage game state
let cardCount;
let cards = [];
let dup = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let playerName = "";
let startTime, endTime, timerInterval;
let gameComplete = false;

// Array of JSON cards with images and names
let jsonCards = 
[
    {
      "image": "./assets/chili.png",
      "name": "chili"
  },
  {
      "image": "./assets/grapes.png",
      "name": "grapes"
  },
  {
      "image": "./assets/lemon.png",
      "name": "lemon"
  },
  {
      "image": "./assets/orange.png",
      "name": "orange"
  },
  {
      "image": "./assets/pineapple.png",
      "name": "pineapple"
  },
  {
      "image": "./assets/strawberry.png",
      "name": "strawberry"
  },
  {
      "image": "./assets/tomato.png",
      "name": "tomato"
  },
  {
      "image": "./assets/watermelon.png",
      "name": "watermelon"
  },
  {
      "image": "./assets/cherries.png",
      "name": "cherries"
  },
  {
      "image": "./assets/almond.png",
      "name": "almond"
  },
  {
      "image": "./assets/avocado.png",
      "name": "avocado"
  },
  {
      "image": "./assets/bananas.png",
      "name": "bananas"
  },
  {
      "image": "./assets/blueberries.png",
      "name": "blueberries"
  },
  {
      "image": "./assets/coconut-milk.png",
      "name": "coconut-milk"
  },
  {
      "image": "./assets/dragon-fruit.png",
      "name": "dragon-fruit"
  },
  {
      "image": "./assets/drink.png",
      "name": "drink"
  },
  {
      "image": "./assets/eggplant.png",
      "name": "eggplant"
  },
  {
      "image": "./assets/fruits.png",
      "name": "fruits"
  },
  {
      "image": "./assets/grape.png",
      "name": "grape"
  },
  {
      "image": "./assets/kiwi.png",
      "name": "kiwi"
  },
  {
      "image": "./assets/lemon2.png",
      "name": "lemon2"
  },
  {
      "image": "./assets/orange-juice.png",
      "name": "orange-juice"
  },
  {
      "image": "./assets/orange2.png",
      "name": "orange2"
  },
  {
      "image": "./assets/passion-fruit.png",
      "name": "passion-fruit"
  },
  {
      "image": "./assets/peach.png",
      "name": "peach"
  },
  {
      "image": "./assets/pear.png",
      "name": "pear"
  },
  {
      "image": "./assets/pepper.png",
      "name": "pepper"
  },
  {
      "image": "./assets/pomelo.png",
      "name": "pomelo"
  },
  {
      "image": "./assets/star-fruit.png",
      "name": "star-fruit"
  },
  {
      "image": "./assets/vegetable.png",
      "name": "vegetable"
  }
]

// Function to start the game
function startGame(event) {
  event.preventDefault();

  // Get player name and card count from form inputs
  playerName = nameInput.value.trim();
  cardCount = parseInt(cardCountInput.value);
  
  // Validate inputs
  if (playerName === "" || isNaN(cardCount)) {
    alert("Please enter a valid name and number of cards.");
    return;
  }

  if (cardCount < 2 || cardCount > 60) {
    alert("Number of cards should be between 2 and 60.");
    return;
  }

  if (cardCount % 2 !== 0) {
    cardCount -= 1;
    alert("Number of cards must be an even number. Adjusted to " + cardCount + ".");
  }

  // Hide form and display game container
  formContainer.style.display = "none";
  gameContainer.style.display = "block";

  // Set player name in the game
  playerNameElement.textContent = playerName;

  // Copy jsonCards to cards array and create pairs
  cards = [...jsonCards]; 
  cards.length = cardCount / 2;
  dup = cards;
  cards = cards.concat(dup);

  // Reset and start the timer, shuffle cards, and generate the game board
  resetTimer();
  shuffleCards();
  generateCards();
}

// Function to start the timer
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timerInterval);
}

// Function to reset the timer
function resetTimer() {
  clearInterval(timerInterval);
  timerElement.textContent = "00:00";
  startTimer();
}

// Function to update the timer
function updateTimer() {
  const currentTime = Date.now();
  const elapsedTime = Math.floor((currentTime - startTime) / 1000);
  timerElement.textContent = formatTime(elapsedTime);
}

// Function to format time
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${padTime(minutes)}:${padTime(seconds)}`;
}

// Function to pad time with leading zeros
function padTime(time) {
  return time.toString().padStart(2, "0");
}

// Function to shuffle the cards array
function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

// Function to generate the cards on the game board
function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

// Function to handle card flip
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch();

  if (isGameComplete()) {
    stopTimer();
    showGameWonMessage();
  }
}

// Function to show the game won message
function showGameWonMessage() {
  const gameWonMessage = document.getElementById("win-message");
  gameWonMessage.classList.remove("hidden");
}

// Function to remove the game won message
function removeGameWonMessage() {
  const gameWonMessage = document.getElementById("win-message");
  gameWonMessage.classList.add("hidden");
}

// Function to check if the game is complete
function isGameComplete() {
  const flippedCards = document.querySelectorAll(".card.flipped");
  const isComplete = flippedCards.length === cards.length;

  return isComplete;
}

// Function to check for a card match
function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    disableCards();
    score += 1;
    document.querySelector(".score").textContent = score;
  }
  else {
    unflipCards();
  }
}

// Function to disable matched cards
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

// Function to unflip unmatched cards
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

// Function to reset the game board
function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Function to restart the game
function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
  resetTimer();
  removeGameWonMessage();
}

// Function to return to the main page
function returnToMainPage() {
  gameContainer.style.display = "none";
  formContainer.style.display = "block";
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  clearMainPageText();
  removeGameWonMessage();
}

// Function to clear main page text inputs
function clearMainPageText() {
  nameInput.value = "";
  cardCountInput.value = "";
}
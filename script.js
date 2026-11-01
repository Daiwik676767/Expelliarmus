
// =====================================
// EXPELLIARMUS - MAIN JAVASCRIPT
// =====================================

let currentCategory = "all";
let score = 0;
let timeLeft = 10;
let gameRunning = false;
let countdown = null;
let secretNumber = 0;
let firstCard = null;
let matchedCards = 0;
let memoryLocked = false;
let reactionReady = false;
let reactionStart = 0;
let reactionTimeout = null;
let targetScore = 0;

// =====================================
// NAVIGATION
// =====================================

function scrollToGames() {
  document.getElementById("games").scrollIntoView({
    behavior: "smooth"
  });
}

// =====================================
// SEARCH AND CATEGORY FILTERS
// =====================================

document.querySelectorAll(".category").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".category").forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");
    currentCategory = button.dataset.filter;
    searchGames();
  });
});

document.getElementById("search").addEventListener("input", searchGames);

function searchGames() {
  const search = document.getElementById("search")
    .value.toLowerCase().trim();

  let visible = 0;

  document.querySelectorAll(".game-card").forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const category = card.dataset.category;

    const matchesSearch = name.includes(search);
    const matchesCategory =
      currentCategory === "all" ||
      category === currentCategory;

    const show = matchesSearch && matchesCategory;

    card.style.display = show ? "block" : "none";

    if (show) visible++;
  });

  document.getElementById("noResults").style.display =
    visible === 0 ? "block" : "none";
}

// =====================================
// GAME SCREEN
// =====================================

function showGame(title, description, content) {
  clearInterval(countdown);
  clearTimeout(reactionTimeout);

  gameRunning = false;
  reactionReady = false;
  memoryLocked = false;

  document.getElementById("gameArea").innerHTML = `
    <div class="game-content">
      <h3>${title}</h3>
      <p>${description}</p>
      <div id="gameContent">${content}</div>
    </div>
  `;

  document.getElementById("play").scrollIntoView({
    behavior: "smooth"
  });
}

function openGame(game) {

  if (game === "clicker") {
    showGame(
      "⚡ NEON CLICKER",
      "Click as fast as possible in 10 seconds!",
      `
        <div class="score" id="score">0</div>
        <p id="timer">Time: 10 seconds</p>
        <button class="game-btn" id="clickButton"
          onclick="clickGame()" disabled>CLICK ME!</button>
        <button class="restart-btn"
          onclick="startClicker()">START GAME</button>
        <p id="gameMessage">Press START GAME to begin.</p>
      `
    );
  }

  if (game === "guess") {
    secretNumber = Math.floor(Math.random() * 100) + 1;

    showGame(
      "🔢 NUMBER GUESS",
      "Find the secret number between 1 and 100.",
      `
        <input class="game-input" id="guessInput"
          type="number" min="1" max="100"
          placeholder="Enter your guess">
        <button class="restart-btn"
          onclick="guessNumber()">GUESS</button>
        <p id="guessMessage">Enter your first guess!</p>
        <button class="restart-btn"
          onclick="openGame('guess')">NEW GAME</button>
      `
    );
  }

  if (game === "rps") {
    showGame(
      "✊ ROCK PAPER SCISSORS",
      "Choose your move and challenge the computer.",
      `
        <button class="game-option" onclick="playRPS('Rock')">✊ Rock</button>
        <button class="game-option" onclick="playRPS('Paper')">✋ Paper</button>
        <button class="game-option" onclick="playRPS('Scissors')">✌️ Scissors</button>
        <p id="rpsResult">Make your move!</p>
      `
    );
  }

  if (game === "coin") {
    showGame(
      "🪙 COIN FLIP",
      "Choose heads or tails.",
      `
        <div class="score" id="coinEmoji">🪙</div>
        <button class="game-option" onclick="flipCoin('Heads')">HEADS</button>
        <button class="game-option" onclick="flipCoin('Tails')">TAILS</button>
        <p id="coinResult">Ready to flip?</p>
      `
    );
  }

  if (game === "reaction") {
    showGame(
      "⚡ REACTION TEST",
      "Wait for green, then click as quickly as possible.",
      `
        <button id="reactionButton"
          onclick="reactionClick()">PRESS START</button>
        <button class="restart-btn"
          onclick="startReaction()">START TEST</button>
        <p id="reactionResult">Your reaction time will appear here.</p>
      `
    );
  }

  if (game === "memory") {
    startMemory();
  }

  if (game === "target") {
    startTarget();
  }
}

// =====================================
// GAME 1: NEON CLICKER
// =====================================

function startClicker() {
  clearInterval(countdown);

  score = 0;
  timeLeft = 10;
  gameRunning = true;

  document.getElementById("score").textContent = score;
  document.getElementById("timer").textContent =
    "Time: " + timeLeft + " seconds";

  document.getElementById("gameMessage").textContent =
    "GO! Click as fast as you can!";

  document.getElementById("clickButton").disabled = false;

  countdown = setInterval(() => {
    timeLeft--;

    document.getElementById("timer").textContent =
      "Time: " + timeLeft + " seconds";

    if (timeLeft <= 0) {
      endClicker();
    }
  }, 1000);
}

function clickGame() {
  if (!gameRunning) return;

  score++;

  document.getElementById("score").textContent = score;
}

function endClicker() {
  clearInterval(countdown);
  gameRunning = false;

  document.getElementById("clickButton").disabled = true;

  document.getElementById("gameMessage").textContent =
    "TIME'S UP! Your final score: " + score + " clicks!";
}

// =====================================
// GAME 2: NUMBER GUESS
// =====================================

function guessNumber() {
  const input = document.getElementById("guessInput");
  const message = document.getElementById("guessMessage");

  const guess = Number(input.value);

  if (!input.value || !Number.isInteger(guess) ||
      guess < 1 || guess > 100) {
    message.textContent =
      "Enter a whole number between 1 and 100.";
    return;
  }

  if (guess === secretNumber) {
    message.textContent = "CORRECT! You found it! 🎉";
    input.disabled = true;
  } else if (guess < secretNumber) {
    message.textContent = "Too low! Try a bigger number.";
  } else {
    message.textContent = "Too high! Try a smaller number.";
  }
}

// =====================================
// GAME 3: ROCK PAPER SCISSORS
// =====================================

function playRPS(player) {
  const choices = ["Rock", "Paper", "Scissors"];

  const computer = choices[
    Math.floor(Math.random() * choices.length)
  ];

  let result;

  if (player === computer) {
    result = "IT'S A DRAW!";
  } else if (
    (player === "Rock" && computer === "Scissors") ||
    (player === "Paper" && computer === "Rock") ||
    (player === "Scissors" && computer === "Paper")
  ) {
    result = "YOU WIN! 🏆";
  } else {
    result = "COMPUTER WINS!";
  }

  document.getElementById("rpsResult").textContent =
    "You: " + player +
    " | Computer: " + computer +
    " | " + result;
}

// =====================================
// GAME 4: COIN FLIP
// =====================================

function flipCoin(choice) {
  const result = Math.random() < 0.5 ? "Heads" : "Tails";

  document.getElementById("coinEmoji").textContent =
    result === "Heads" ? "🌕" : "🌑";

  document.getElementById("coinResult").textContent =
    "Result: " + result +
    (choice === result ? " | YOU WIN! 🎉" : " | Better luck next time!");
}

// =====================================
// GAME 5: REACTION TEST
// =====================================

function startReaction() {
  clearTimeout(reactionTimeout);

  reactionReady = false;

  const button = document.getElementById("reactionButton");

  button.style.background = "#37304e";
  button.textContent = "WAIT FOR GREEN...";

  document.getElementById("reactionResult").textContent = "";

  reactionTimeout = setTimeout(() => {
    reactionReady = true;
    reactionStart = performance.now();

    button.style.background = "#20a85a";
    button.textContent = "CLICK NOW!";
  }, 1500 + Math.random() * 3000);
}

function reactionClick() {
  const button = document.getElementById("reactionButton");
  const result = document.getElementById("reactionResult");

  if (!reactionReady) {
    clearTimeout(reactionTimeout);
    reactionReady = false;

    result.textContent =
      "Too early! Wait for the green signal.";

    button.textContent = "TOO EARLY!";
    return;
  }

  const reactionTime = Math.round(
    performance.now() - reactionStart
  );

  reactionReady = false;

  button.textContent = "COMPLETED!";

  result.textContent =
    "Your reaction time: " + reactionTime + " ms!";
}

// =====================================
// GAME 6: MEMORY MATCH
// =====================================

function startMemory() {
  const symbols = [
    "🎮", "🎮",
    "🚀", "🚀",
    "⚡", "⚡",
    "👾", "👾"
  ];

  symbols.sort(() => Math.random() - 0.5);

  firstCard = null;
  matchedCards = 0;
  memoryLocked = false;

  showGame(
    "🧠 MEMORY MATCH",
    "Find all four matching pairs.",
    `
      <div class="game-board" id="memoryBoard"></div>
      <p id="memoryMessage">Find matching pairs!</p>
      <button class="restart-btn"
        onclick="startMemory()">RESTART</button>
    `
  );

  symbols.forEach(symbol => {
    const button = document.createElement("button");

    button.className = "memory-card";
    button.textContent = "?";

    button.addEventListener("click", () => {
      revealCard(button, symbol);
    });

    document.getElementById("memoryBoard")
      .appendChild(button);
  });
}

function revealCard(button, symbol) {
  if (
    memoryLocked ||
    button.disabled ||
    button.textContent !== "?"
  ) {
    return;
  }

  button.textContent = symbol;

  if (!firstCard) {
    firstCard = {
      button: button,
      symbol: symbol
    };
    return;
  }

  const first = firstCard;
  firstCard = null;

  if (first.symbol === symbol) {
    first.button.disabled = true;
    button.disabled = true;

    matchedCards++;

    if (matchedCards === 4) {
      document.getElementById("memoryMessage").textContent =
        "YOU WON! All pairs matched! 🏆";
    }
  } else {
    memoryLocked = true;

    setTimeout(() => {
      first.button.textContent = "?";
      button.textContent = "?";
      memoryLocked = false;
    }, 700);
  }
}

// =====================================
// GAME 7: TARGET CLICK
// =====================================

function startTarget() {
  targetScore = 0;

  showGame(
    "🎯 TARGET CLICK",
    "Hit the moving target ten times!",
    `
      <p>Score: <span id="targetScore">0</span> / 10</p>
      <div id="targetArea">
        <button id="target"
          onclick="hitTarget()"></button>
      </div>
      <p id="targetMessage">Click the target!</p>
      <button class="restart-btn"
        onclick="startTarget()">RESTART</button>
    `
  );

  moveTarget();
}

function moveTarget() {
  const area = document.getElementById("targetArea");
  const target = document.getElementById("target");

  if (!area || !target) return;

  const maxX = area.clientWidth - 45;
  const maxY = area.clientHeight - 45;

  target.style.left = Math.random() * maxX + "px";
  target.style.top = Math.random() * maxY + "px";
}

function hitTarget() {
  targetScore++;

  document.getElementById("targetScore").textContent =
    targetScore;

  if (targetScore >= 10) {
    document.getElementById("targetMessage").textContent =
      "YOU WON! Perfect targeting! 🏆";

    document.getElementById("target").disabled = true;
  } else {
    moveTarget();
  }
}

// =====================================
// INITIALIZE WEBSITE
// =====================================

searchGames();

console.log("EXPelliARMUS successfully loaded!");

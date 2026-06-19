const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const modeSelect = document.getElementById('mode');

// Winning combinations for a 3x3 grid
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

// Initialize game
initializeGame();

function initializeGame() {
    cells.forEach(cell => cell.addEventListener('click', cellClicked));
    restartBtn.addEventListener('click', restartGame);
    modeSelect.addEventListener('change', restartGame);
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
    running = true;
}

function cellClicked() {
    const cellIndex = this.getAttribute('data-index');

    // Ignore click if cell is full or game is paused/over
    if (options[cellIndex] !== "" || !running) {
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();

    // Trigger AI move if in AI mode and it's O's turn
    if (running && modeSelect.value === 'ai' && currentPlayer === 'O') {
        running = false; // Pause user input while AI thinks
        statusText.textContent = "AI is thinking...";
        setTimeout(aiMove, 600); // 600ms delay for realism
    }
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
}

function changePlayer() {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA === "" || cellB === "" || cellC === "") {
            continue;
        }
        if (cellA === cellB && cellB === cellC) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} Wins!`;
        running = false;
    } else if (!options.includes("")) {
        statusText.textContent = `Game ended in a draw!`;
        running = false;
    } else {
        changePlayer();
    }
}

function aiMove() {
    let availableCells = [];
    
    // Find all empty spots on the board
    for (let i = 0; i < options.length; i++) {
        if (options[i] === "") {
            availableCells.push(i);
        }
    }

    if (availableCells.length > 0) {
        // Pick a random available cell
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const cellIndex = availableCells[randomIndex];
        const cell = document.querySelector(`.cell[data-index="${cellIndex}"]`);
        
        running = true; // Unpause the game
        updateCell(cell, cellIndex);
        checkWinner();
    }
}

function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
    
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('x', 'o');
    });
    
    running = true;
}
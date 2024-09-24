document.addEventListener('DOMContentLoaded', function () {
    const gridSize = 9;
    const solveButton = document.getElementById("solve-btn");
    solveButton.addEventListener('click', solveSudoku);
    
    const resetButton = document.getElementById("reset-btn");
    resetButton.addEventListener('click', resetSudoku); // Corrected to use resetButton

    const sudokuGrid = document.getElementById("sudoku-grid");
    // Create the sudoku grid and input cells
    for (let row = 0; row < gridSize; row++) {
        const newRow = document.createElement("tr");
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.className = "cell";
            input.id = `cell-${row}-${col}`;
            input.min = 1; // Set min value
            input.max = 9; // Set max value
            cell.appendChild(input);
            newRow.appendChild(cell);
        }
        sudokuGrid.appendChild(newRow);
    }
});

async function solveSudoku() {
    const gridSize = 9;
    const sudokuArray = [];

    // Fill the sudokuArray with input values from the grid
    for (let row = 0; row < gridSize; row++) {
        sudokuArray[row] = [];
        for (let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`;
            const cellValue = document.getElementById(cellId).value;
            sudokuArray[row][col] = cellValue !== "" ? parseInt(cellValue) : 0;
        }
    }

    // Check for invalid inputs and highlight them
    const invalidInputs = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`;
            const cell = document.getElementById(cellId);

            if (sudokuArray[row][col] !== 0) {
                cell.classList.add("user-input");
                if (sudokuArray[row].filter(x => x === sudokuArray[row][col]).length > 1) {
                    invalidInputs.push(cellId);
                }
            }
        }
    }

    // If there are invalid inputs, alert the user and return
    if (invalidInputs.length > 0) {
        alert("Errore nell'inserimento dei numeri");
        invalidInputs.forEach(id => document.getElementById(id).style.backgroundColor = "red");
        return;
    }

    // Solve the sudoku and display the solution
    if (solveSudokuHelper(sudokuArray)) {
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cellId = `cell-${row}-${col}`;
                const cell = document.getElementById(cellId);

                // Fill in solved values and apply animation
                if (!cell.classList.contains("user-input")) {
                    cell.value = sudokuArray[row][col];
                    cell.classList.add("solved");
                    await sleep(20); // Add a delay for visualization
                }
            }
        }
    } else {
        alert("Nessuna soluzione trovata");
    }
}

function solveSudokuHelper(board) {
    const gridSize = 9;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValidMove(board, row, col, num)) {
                        board[row][col] = num;

                        // Recursively attempt to solve the Sudoku
                        if (solveSudokuHelper(board)) {
                            return true; // Puzzle solved
                        }

                        board[row][col] = 0; // Backtrack
                    }
                }
                return false; // No valid number found
            }
        }
    }

    return true; // All cells filled
}

function isValidMove(board, row, col, num) {
    const gridSize = 9;

    // Check row and column for conflicts
    for (let i = 0; i < gridSize; i++) {
        if (board[row][i] === num || board[i][col] === num) {
            return false; // Conflict found
        }
    }

    // Check the 3*3 subgrid for conflicts
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (board[i][j] === num) {
                return false; // Conflict found
            }
        }
    }

    return true; // No conflicts found
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to reset the Sudoku grid
function resetSudoku() {
    const gridSize = 9;
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`;
            const cell = document.getElementById(cellId);
            cell.value = ''; // Clear input
            cell.classList.remove("user-input", "solved"); // Remove classes
            cell.style.backgroundColor = ""; // Reset background color
        }
    }
}

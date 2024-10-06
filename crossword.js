let puzzle = []
let wordSlots = []; // To store possible slots for words

function displayErr(map, x, y) {

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            // if (i == x && i == y) {
            // }
            process.stdout.write(' '+map[x][y]+' ')
            // process.stdout.write(' '+map[i][j]+' ')
        }
    }
    console.log('Error')
    process.exit(0);
}

function parseMap(map) {
    let emptyPuzzle = map.split('\n').map(row => row.split(''));
    for (let i = 0; i < emptyPuzzle.length; i++) {
        for (let j = 0; j < emptyPuzzle[i].length; j++) {
            if (emptyPuzzle[i][j] != '.'
                && emptyPuzzle[i][j] != '0'
                && emptyPuzzle[i][j] != '1'
                && emptyPuzzle[i][j] != '2') {
                    displayErr(emptyPuzzle, i, j)

            }
        }
    }

}

function crosswordSolver(emptyPuzzle, words) {
    // Parse the puzzle into a 2D array
    puzzle = emptyPuzzle.split('\n').map(row => row.split(''));
    let rows = puzzle.length;
    let cols = puzzle[0].length;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (puzzle[i][j] === '1' || puzzle[i][j] === '2') {

                let hLength = 0;
                let startCol = j;
                while (startCol < cols && (puzzle[i][startCol] === '0' || puzzle[i][startCol] === '1' || puzzle[i][startCol] === '2')) {
                    hLength++;
                    startCol++;
                }
                if (hLength >= 2) {
                    wordSlots.push({ row: i, col: j, length: hLength, direction: 'H' });
                }

                let vLength = 0;
                let startRow = i;
                while (startRow < rows && (puzzle[startRow][j] === '0' || puzzle[startRow][j] === '1' || puzzle[startRow][j] === '2')) {
                    vLength++;
                    startRow++;
                }
                if (vLength >= 2) {
                    wordSlots.push({ row: i, col: j, length: vLength, direction: 'V' });
                }
            }
        }
    }
}

// Function to check if a word can fit in a slot
function canPlaceWord(word, slot) {
    if (word.length !== slot.length) return false; // Word must match the length of the slot

    // Check horizontal placement
    if (slot.direction === 'horizontal') {
        for (let i = 0; i < word.length; i++) {
            const cell = puzzle[slot.row][slot.col + i];
            // Cell must be empty or match the letter in the word
            if (cell === '.' || (cell !== '0' && cell !== '1' && cell !== '2' && cell !== word[i])) {
                return false; // Can't place the word here
            }
        }
    } else { // vertical placement
        for (let i = 0; i < word.length; i++) {
            const cell = puzzle[slot.row + i][slot.col];
            // Cell must be empty or match the letter in the word
            if (cell === '.' || (cell !== '0' && cell !== '1' && cell !== '2' && cell !== word[i])) {
                return false; // Can't place the word here
            }
        }
    }

    return true; // Word can be placed
}

// Function to place a wrd in the puzzle
function placeWord(word, slot) {
    if (slot.direction === 'horizontal') {
        for (let i = 0; i < word.length; i++) {
            puzzle[slot.row][slot.col + i] = word[i]; // Place each letter
        }
    } else { // vertical
        for (let i = 0; i < word.length; i++) {
            puzzle[slot.row + i][slot.col] = word[i]; // Place each letter
        }
    }
}

// Function to remove the word (backtracking)
function removeWord(word, slot) {
    if (slot.direction === 'horizontal') {
        for (let i = 0; i < word.length; i++) {
            puzzle[slot.row][slot.col + i] = '0'; // Reset the cell to empty
        }
    } else { // vertical
        for (let i = 0; i < word.length; i++) {
            puzzle[slot.row + i][slot.col] = '0'; // Reset the cell to empty
        }
    }
}

const emptyPuzzle = `2001
0.30
1000
0..0`
const words = ['casa', 'alan', 'ciao', 'anta']

crosswordSolver(emptyPuzzle, words)

parseMap(emptyPuzzle)
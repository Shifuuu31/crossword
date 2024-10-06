let puzzle = []; // to store map result
let freeSlots = []; // To store possible slots for words
let solutions = []; // To store all valid solutions

// -------------Recursive Backtracking logic-------------

function backtrackWords(index) {
    if (index === words.length) {
        // Copy the current puzzle state and save it as a solution
        let solution = puzzle.map(row => [...row]);
        solutions.push(solution);

        // If more than one solution is found, return false (since the solution is not unique)
        if (solutions.length > 1) return false;
        return true;
    }

    let word = words[index];

    for (let slot of freeSlots) {
        if (canPutWord(word, slot)) {
            putWord(word, slot);
            if (!backtrackWords(index + 1)) return false; // Return if more than one solution is found
            removeWord(word, slot);
        }
    }

    return true;
}

// -------------Crossword Solver-------------

function crosswordSolver(emptyPuzzle, word) {
    parseMap(emptyPuzzle);
    let original = puzzle;
    Object.freeze(original);
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
                if (isValidSlot(words, hLength)) {
                    freeSlots.push({
                        row: i,
                        col: j,
                        length: hLength,
                        direction: 'H'
                    });
                }

                let vLength = 0;
                let startRow = i;
                while (startRow < rows && (puzzle[startRow][j] === '0' || puzzle[startRow][j] === '1' || puzzle[startRow][j] === '2')) {
                    vLength++;
                    startRow++;
                }
                if (isValidSlot(words, vLength)) {
                    freeSlots.push({
                        row: i,
                        col: j,
                        length: vLength,
                        direction: 'V'
                    });
                }
            }
        }
    }

    if (backtrackWords(0)) {
        if (solutions.length === 1) {
            console.log("Unique solution found:");
            printSolution(solutions[0]);
        } else if (solutions.length > 1) {
            console.error('Error: Multiple solutions found');
        } else {
            console.error('Error: No solution found');
        }
    } else {
        console.error('Error: Multiple solutions found');
    }
}

// -------------Helper Functions-------------

function canPutWord(word, slot) {
    if (word.length !== slot.length) return false;

    if (slot.direction === 'H') {
        for (let i = 0; i < word.length; i++) {
            const cell = puzzle[slot.row][slot.col + i];
            if (cell === '.' || (cell !== '0' && cell !== '1' && cell !== '2' && cell !== word[i])) {
                return false;
            }
        }
    } else {
        for (let i = 0; i < word.length; i++) {
            const cell = puzzle[slot.row + i][slot.col];
            if (cell === '.' || (cell !== '0' && cell !== '1' && cell !== '2' && cell !== word[i])) {
                return false;
            }
        }
    }

    return true;
}

function putWord(word, slot) {
    if (slot.direction === 'H') {
        for (let i = 0; i < word.length; i++) {
            puzzle[slot.row][slot.col + i] = word[i];
        }
    } else {
        for (let i = 0; i < word.length; i++) {
            puzzle[slot.row + i][slot.col] = word[i];
        }
    }
}

function removeWord(word, slot) {
    if (slot.direction === 'H') {
        for (let i = 0; i < word.length; i++) {
            puzzle[slot.row][slot.col + i] = '0';
        }
    } else {
        for (let i = 0; i < word.length; i++) {
            puzzle[slot.row + i][slot.col] = '0';
        }
    }
}

function isValidSlot(words, slotLen) {
    return words.some(word => word.length === slotLen);
}

function parseMap(map) {

    if (typeof map !== 'string') {
        console.error('Error: puzzle must be in string format')
        process.exit(0)
    }
    puzzle = map.split('\n').map(row => row.split(''));
    let lineLength = puzzle[0].length;

    for (let i = 0; i < puzzle.length; i++) {
        for (j = 0; j < puzzle[i].length; j++){
                    ///////////  Check map size ///////////   
        if (lineLength !== puzzle[i].length) {
            console.error('Error: Invalid map size');
            process.exit(0);
        }
        if (puzzle[i][j] != '.'
            && puzzle[i][j] != '0'
            && puzzle[i][j] != '1'
            && puzzle[i][j] != '2') {
            // displayErr(emptyPuzzle, i, j) 
            console.error('Error: invalid map element \'' + puzzle[i][j] + '\'')
            process.exit(0)
        }
        
        ///////////   Check 2 horizontal ///////////  
        if (puzzle[i][j] == '2') {
            for (let k = j + 1; k < puzzle.length - j; k++) {
                if (puzzle[i][k] == '.') {
                    break
                }
                if (puzzle[i][k] == '2') {
                    console.error('Error: Invalid horizontal \'2\' position')
                    process.exit(0);
                }
            }
        }
        ///////////  Check 2 vertical ///////////   
        if (puzzle[i][j] == '2') {
            for (let k = i + 1; k < puzzle.length - i; k++) {
                if (puzzle[k][j] == '.') {
                    break
                }
                if (puzzle[k][j] == '2') {
                    console.error('Error: Invalid vertical \'2\' position')
                    process.exit(0);
                }
            }
        }
    }
}

    if (checkDuplicates(words)) {
        console.error('Error: Word duplicates found');
        process.exit(0);
    }
}

function checkDuplicates(arr) {
    if (!Array.isArray(arr)) {
        console.error('Error: words must be in a list of string (array)')
        process.exit(0)
    }
    return new Set(arr).size !== arr.length;
}

function printSolution(puzzle) {
    for (let row of puzzle) {
        console.log(row.join(''));
    }
}

// -------------Main Entry-------------

const emptyPuzzle = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`
const words = [
  'sun',
  'sunglasses',
  'suncream',
  'swimming',
  'bikini',
  'beach',
  'icecream',
  'tan',
  'deckchair',
  'sand',
  'seaside',
  'sandals',
].reverse()

crosswordSolver(emptyPuzzle, words);

// -------------Test Cases-------------

const emptyPuzzleNoSolution = '2001\n0..0\n1000\n0..0';
const wordsNoSolution = ['aaab', 'aaac', 'aaad', 'aaae'];

// Uncomment the line below to test a puzzle with no solution
// crosswordSolver(emptyPuzzleNoSolution, wordsNoSolution)

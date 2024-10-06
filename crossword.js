let puzzle = [] // to store map result
let freeSlots = []; // To store possible slots for words


// -------------Recursive Backtracking logic-------------

function backtrackWords(index) {
    if (index === words.length) return true;

    let word = words[index];

    for (let slot of freeSlots) {
        if (canPutWord(word, slot)) {
            putWord(word, slot);
            if (backtrackWords(index + 1)) return true;
            removeWord(word, slot);
        }
    }

    return false;
}


// -------------crossword solver .... -------------

function crosswordSolver(emptyPuzzle, words) {
    parseMap(emptyPuzzle)
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
    // console.log(freeSlots)
    // for (let i = 0; i < freeSlots.length; i++) {
    //     console.log('slot['+i.toFixed()+']')
    //     for (let j = 0; j < words.length; j++) {
    //         console.log(canPutWord(words[j], freeSlots[i]))
    //         }

    // }

    if (!backtrackWords(0)) {
        console.error('Error: no solution finded')
    } else {
        printSolution(puzzle)
    }
}

// -------------Parse the puzzle into a 2D array-------------
// need's to be enhanced
function parseMap(map) {
    puzzle = map.split('\n').map(row => row.split(''))
    let lineLenght = puzzle[0].length

    for (let i = 0; i < puzzle.length; i++) {
        for (let j = 0; j < puzzle[i].length; j++) {
            if (lineLenght != puzzle[i].length) {
                console.error('Error: Invalid map size')
                process.exit(0)
            }
            //check for 2 position
            // if (puzzle[i][j] != '2' && ((i != 0 && j != 0 && puzzle[i][j - 1] == puzzle[i - 1][j] == '.') || (i == 0 && puzzle[i][j - 1] == '.') || (j == 0 && puzzle[i - 1][j] == '.'))) {
            //     console.log('Error: Invalid element position \'' + puzzle[i][j] + '\'')
            //     process.exit(0);
            // }

            //check for 1 position

            if (puzzle[i][j] != '.'
                && puzzle[i][j] != '0'
                && puzzle[i][j] != '1'
                && puzzle[i][j] != '2') {
                // displayErr(emptyPuzzle, i, j) 
                console.console('Error: invalid map element \'' + puzzle[i][j] + '\'')
                process.exit(0)

            }
        }
    }
}

// -------------main entry-------------

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
  ]
crosswordSolver(emptyPuzzle, words)


// -------------func tools-------------

function canPutWord(word, slot) {
    // console.log("d")
    if (word.length !== slot.length) return false;

    if (slot.direction === 'H') {
        for (let i = 0; i < word.length; i++) {
            const cell = puzzle[slot.row][slot.col + i];
            if (cell === '.' || (cell !== '0' && cell !== '1' && cell !== '2' && cell !== word[i])) {
                return false
            }
        }
    } else {
        for (let i = 0; i < word.length; i++) {
            const cell = puzzle[slot.row + i][slot.col];
            if (cell === '.' || (cell !== '0' && cell !== '1' && cell !== '2' && cell !== word[i])) {
                return false
            }
        }
    }

    return true;
}

function putWord(word, slot) {
    if (slot.direction === 'H') {
        for (let i = 0; i < word.length; i++) {
            puzzle[slot.row][slot.col + i] = word[i]
        }
    } else { // vertical
        for (let i = 0; i < word.length; i++) {
            puzzle[slot.row + i][slot.col] = word[i]
        }
    }
}


function removeWord(word, slot) {
    if (slot.direction === 'H') {
        for (let i = 0; i < word.length; i++) {
            puzzle[slot.row][slot.col + i] = '0'
        }
    } else { // vertical
        for (let i = 0; i < word.length; i++) {
            puzzle[slot.row + i][slot.col] = '0'
        }
    }
}

function isValidSlot(words, slotLen) {
    let count = 0
    if (slotLen >= 2) {

        for (let i = 0; i < words.length; i++) {
            if (slotLen == words[i].length) {
                count++
            }
        }
        if (count > 0) {
            return true
        }
    }
    return false
}

function printSolution(puzzle) {
    for (let i = 0; i < puzzle.length; i++) {
        for (let j = 0; j < puzzle[i].length; j++) {
            process.stdout.write(puzzle[i][j])
        }
        process.stdout.write('\n')
    }
}
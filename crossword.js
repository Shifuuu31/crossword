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
    let original = puzzle
    Object.freeze(original)
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

    if (backtrackWords(0)) {
        tmp = original
        Object.freeze(tmp)
        original = puzzle
        Object.freeze
        puzzle = tmp 
        words = words.reverse()
        if (backtrackWords(0)) {
            if (original === puzzle) {
                printSolution(original)
                printSolution(puzzle)
            }
        }
    }
        console.error('Error: no solution finded')
}

// -------------Parse the puzzle into a 2D array-------------
// need's to be enhanced

function parseMap(map) {
    if (typeof map !== 'string') {
        console.error('Error: puzzle must be in string format')
        process.exit(0)

    }
    puzzle = map.split('\n').map(row => row.split(''));
    let lineLenght = puzzle[0].length

    for (let i = 0; i < puzzle.length; i++) {
        for (let j = 0; j < puzzle[i].length; j++) {

            ///////////  Check map size ///////////   
            if (lineLenght != puzzle[i].length) {
                console.error('Error: Invalid map size')
                process.exit(0);
            }

            ///////////  Check map element ///////////   
            if (puzzle[i][j] != '.'
                && puzzle[i][j] != '0'
                && puzzle[i][j] != '1'
                && puzzle[i][j] != '2') {
                console.error('Error: invalid map element \'' + puzzle[i][j] + '\'')
                process.exit(0);

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
    ///////////  word duplicates ///////////  
    if (checkDuplicates(words)) {
        console.error('Error: Word Duplicates')
        process.exit(0);
    }

}
function checkDuplicates(arr) {
    if (!Array.isArray(arr)) {
        console.error('Error: words must be in a list of string (array)')
        process.exit(0)
    }
    return new Set(arr).size !== arr.length
}

// -------------main entry-------------

const emptyPuzzle = '2000\n0...\n0...\n0...'
let words = ['abba', 'assa']
crosswordSolver(emptyPuzzle, words)


// -------------func tools-------------

function canPutWord(word, slot) {
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

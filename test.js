let output = []; // to store map result
let freeSlots = []; // To store possible slots for words
let solutions = []; // To store all valid solutions
let regex = /[^a-zA-Z]/;
// -------------Recursive Backtracking logic-------------
function backtrackWords(index) {
    if (index === words.length) {
        // Copy the current output state and save it as a solution
        let solution = output.map(row => [...row])
        solutions.push(solution);

        // If more than one solution is found, return false (since the solution is not unique)
        if (solutions.length > 1) return false
        return true;
    }
    let word = words[index];
    for (let slot of freeSlots) {
        if (canPutWord(word, slot)) {
            putWord(word, slot);
            if (!backtrackWords(index + 1)) return false
            removeWord(word, slot);
        }
    }
    return true;
}
// -------------Crossword Solver-------------
function crosswordSolver(emptyGrid, words) {
    if (!Array.isArray(words)) {
        console.error('Error')
        process.exit(1)
    }
    for (let word of words) {
        if (regex.test(word)) {
            console.error('Error')
            process.exit(1)
        }
    }
    parseMap(emptyGrid);
    let rows = output.length;
    let cols = output[0].length;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (output[i][j] === '1' || output[i][j] === '2') {
                let hLength = 0;
                let startCol = j;
                while (startCol < cols && (output[i][startCol] === '0' || output[i][startCol] === '1' || output[i][startCol] === '2')) {
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
                while (startRow < rows && (output[startRow][j] === '0' || output[startRow][j] === '1' || output[startRow][j] === '2')) {
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
            printSolution(solutions[0]);
        } else if (solutions.length > 1) {
            console.error('Error');
        } else {
            console.error('Error');
        }
    } else {
        console.error('Error');
    }
}

// -------------Parsing-------------
function parseMap(map) {
    if (typeof map !== 'string') {
        console.error('Error')
        process.exit(1)
    }
    output = map.split('\n').map(row => row.split(''));
    let lineLength = output[0].length;
    for (let i = 0; i < output.length; i++) {
        for (j = 0; j < output[i].length; j++) {
            ///////////  Check map size ///////////   
            if (lineLength !== output[i].length) {
                console.error('Error');
                process.exit(1);
            }
            if (output[i][j] != '.'
                && output[i][j] != '0'
                && output[i][j] != '1'
                && output[i][j] != '2') {
                console.error('Error')
                process.exit(1)
            }

            ///////////   Check 2 horizontal ///////////  
            if (output[i][j] == '2') {
                for (let k = j + 1; k < output.length - j; k++) {
                    if (output[i][k] == '.') {
                        break
                    }
                    if (output[i][k] == '2') {
                        console.error('Error')
                        process.exit(1);
                    }
                }
            }
            ///////////  Check 2 vertical ///////////   
            if (output[i][j] == '2') {
                for (let k = i + 1; k < output.length - i; k++) {
                    if (output[k][j] == '.') {
                        break
                    }
                    if (output[k][j] == '2') {
                        console.error('Error')
                        process.exit(1);
                    }
                }
            }
        }
    }
    if (checkDuplicates(words)) {
        console.error('Error');
        process.exit(1);
    }
}

// -------------Helper Functions-------------
function canPutWord(word, slot) {
    if (word.length !== slot.length) return false;
    if (slot.direction === 'H') {
        for (let i = 0; i < word.length; i++) {
            const cell = output[slot.row][slot.col + i];
            if (cell === '.' || (cell !== '0' && cell !== '1' && cell !== '2' && cell !== word[i])) {
                return false;
            }
        }
    } else {
        for (let i = 0; i < word.length; i++) {
            const cell = output[slot.row + i][slot.col];
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
            output[slot.row][slot.col + i] = word[i];
        }
    } else {
        for (let i = 0; i < word.length; i++) {
            output[slot.row + i][slot.col] = word[i];
        }
    }
}
function removeWord(word, slot) {
    if (slot.direction === 'H') {
        for (let i = 0; i < word.length; i++) {
            output[slot.row][slot.col + i] = '0';
        }
    } else {
        for (let i = 0; i < word.length; i++) {
            output[slot.row + i][slot.col] = '0';
        }
    }
}

function isValidSlot(words, slotLen) {
    return words.some(word => word.length === slotLen);
}


function checkDuplicates(arr) {
    if (!Array.isArray(arr)) {
        console.error('Error')
        process.exit(1)
    }
    return new Set(arr).size !== arr.length;
}
function printSolution(output) {
    for (let i = 0; i < output.length; i++) {
        for (let j = 0; j < output[0].length; j++) {
            if (output[i][j] == '0' || output[i][j] == '1' || output[i][j] == '2') {
                console.error('Error');
                process.exit(1)
            }
        }
    }
    for (let row of output) {
        console.log(row.join(''));
    }
}
// -------------Main Entry-------------
const emptyPuzzle = `2001
0..0
1000
0..0`
const words = ['casa', 'alan', 'ciao', 'anta']

crosswordSolver(emptyPuzzle, words)

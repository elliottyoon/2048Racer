
function findFurthestOpenSpace(index, arr, lendpoint) {
    // iterates backward through array starting at starting index and looks for 
    // furthest empty space such that the path to that space is empty
    let ptr = index - 1;
    let indexVal = arr[index];

    while (lendpoint < ptr) {
        if (arr[ptr] == indexVal) return {index: ptr, didMerge: true};
        if (arr[ptr] !== '') break;
        ptr -= 1;
    }
    return {index: ptr + 1, didMerge: false};
}

function generateRandomTile(gameState) {
    let temp = getEmptySpaces(gameState);
    let spaceIndices = temp["spaces"][Math.floor(Math.random() * temp["count"])]

    return {
        'space': spaceIndices,
        'val': Math.floor(Math.random() * 10) < 1 ? 4 : 2,
    }
}

function transpose(array) {
    let newArr = [['', '', '', ''], // col 0
                ['', '', '', ''], // col 1
                ['', '', '', ''], // col 2
                ['', '', '', '']] // col 3
    let val = '';

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            val = array[i][j];
            if (val !== '')  {
                newArr[j][i] = val;
            }
        }
    }

    return newArr;
}

/*
 *  input: array of arrays representing gameState, manipulated according to slide direction
 *  output: array of changes made to input matrix (modified in-place)
 */
function slideHelper(cols) {
    let changes = []
    // for each column
    for (let col = 0; col < 4; col++) {

        // left endpoint for findFurthestOpenSpace (non-inclusive)
        let lendpoint = -1;
        
        for (let i = 1; i < 4; i++) {      // we only care if this is a nonempty tile
            if (cols[col][i] !== '') {
                // temp index, didMerge
                let idxMerge = findFurthestOpenSpace(i, cols[col], lendpoint);
                // if there is a valid move
                if (idxMerge["index"] != i) {
                    // temp index
                    let index = idxMerge["index"];

                    if (idxMerge["didMerge"]) {
                        changes.push({
                            "outerIdx": col,
                            "start": i,
                            "end": idxMerge["index"],
                            "didMerge": true,
                        });

                        // updates lendpoint to the position of newly merged tile
                        lendpoint = index;

                        let mergedValue = cols[col][i] * 2;
                        // updates temporary game state
                        cols[col][index] = mergedValue;
                        cols[col][i] = '';

                    } else {
                        changes.push({
                            "outerIdx": col,
                            "start": i,
                            "end": idxMerge["index"],
                            "didMerge": false,
                        })

                        // updates gameState
                        cols[col][index] = cols[col][i];
                        cols[col][i] = '';
                    }
                }
            }
        }
    }
    return changes;
}

/* 
 *  input: gameState matrix
 *  output: struct {
 *      spaces: array of empty spaces
 *      count: number of empty spaces
 *  }
 */
function getEmptySpaces(gameState) {
    let tempGameState = [];
    let count = 0;

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (gameState[i][j] == '') {
                tempGameState.push([i,j]);
                count++;
            }
        }
    }
    return {
        'spaces': tempGameState,
        'count': count
    };
}

/* 
 *  input: gs       - gameState
 *         gsSetter - (input) => TileContainer.state.gameState = input
 *
 */
function slideUp(gs, gsSetter) {
    // temporary gameState, oriented so that we slide along inner array
    let cols = transpose(gs);
    // changes to gamestate. holds {outerIdx: int, !!for inner index: start: int, end: int ,!! merge?: bool } objects
    let changes = slideHelper(cols);
    if (changes.length > 0) {
        gsSetter(insertRandomTile(transpose(cols)));
    }
}
function slideLeft(gs, gsSetter) {
    let cols = gs;
    let changes = slideHelper(cols);
    if (changes.length > 0) {
        gsSetter(insertRandomTile(cols));
    }
}
function slideDown(gs, gsSetter) {
    let cols = transpose(gs);
    for (let c in cols) {
        cols[c].reverse();
    }
    let changes = slideHelper(cols);
    if (changes.length > 0) {
        for (let c in cols) {
            cols[c].reverse();
        }
        gsSetter(insertRandomTile(transpose(cols)));
    }
}
function slideRight(gs, gsSetter) {
    let cols = gs;
    for (let c in cols) {
        cols[c].reverse();
    }
    let changes = slideHelper(cols);
    if (changes.length > 0) {
        for (let c in cols) {
            cols[c].reverse()
        }
        gsSetter(insertRandomTile(cols));
    }
}


/* ************ AI-specific helpers ************ */

function numIslands(gameState) {
    console.log('implement this function');
    return 0;
}

function maxValue(gameState) {
    let max = 0;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (gameState[i][j] != '' && gameState[i][j] > max) {
                max = gameState[i][j];
            }
        }
    }
    return max;
}

function numEmptySpacesAvailable(gameState) {
    let count = 0;

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (gameState[i][j] == '') {
                count++;
            }
        }
    }
    return count;
}

function emptySpacesAvailable(gameState) {
    let spaces = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (gameState[i][j] == '') {
                spaces.push([i, j]);
            }
        }
    }
    return spaces;
}

function adjacentTileMatchesAvailable(gameState) {
    let tile;
    let new_i;
    let new_j;
    const directions = [[1,0], [-1,0], [0,1], [0,-1]]

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            tile = gameState[i][j];
            if (tile != '') {
                // check the tiles directly adjacent
                for (let k = 0; k < 4; k++) {
                    new_i = i + directions[k][0];
                    new_j = j + directions[k][1];

                    // check for out of bounds errors
                    if (new_i < 0 || new_j < 0 || new_i > 3 || new_j > 3) {
                        continue;
                    } else {
                        if (gameState[new_i][new_j] == tile) {
                            return true;
                        }
                    } 
                }
            }      
        }
    }
    
    return false
}

function insertRandomTile(arr) {
    let tempGameState = arr;
    let tmp = generateRandomTile(tempGameState);
    tempGameState[tmp["space"][0]][[tmp["space"][1]]] = tmp["val"]
    return tempGameState;
}

// returns gameState after desired move, or false if no change
function move(gs, dir) {
    // dir map: 0 -> up, 1 -> right, 2 -> down, 3 -> left
    let cols;
    let changes;

    switch (dir) {
        case 0: // up
            cols = transpose(gs);
            changes = slideHelper(cols);
            if (changes.length > 0) {
                return insertRandomTile(transpose(cols));
            }
            return gs;
        case 1: // right
            let cols = gs;
            for (let c in cols) {
                cols[c].reverse();
            }
            changes = slideHelper(cols);
            if (changes.length > 0) {
                for (let c in cols) {
                    cols[c].reverse()
                }
                return insertRandomTile(cols);
            }
            return gs;
        case 2: // down
            cols = transpose(gs);
            for (let c in cols) {
                cols[c].reverse();
            }
            changes = slideHelper(cols);
            if (changes.length > 0) {
                for (let c in cols) {
                    cols[c].reverse();
                }
                return insertRandomTile(transpose(cols));
            }
            return gs;
        case 3: // left
            cols = gs;
            let changes = slideHelper(cols);
            if (changes.length > 0) {
                return insertRandomTile(cols);
            }
            return gs;
    }
}



export {
    adjacentTileMatchesAvailable, 
    generateRandomTile, 
    maxValue,
    numEmptySpacesAvailable, 
    emptySpacesAvailable,
    transpose, 
    slideHelper,
    move,
    numIslands,
    slideUp,
    slideDown,
    slideLeft,
    slideRight
}
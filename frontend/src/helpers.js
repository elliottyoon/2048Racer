
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

export {generateRandomTile, transpose, slideHelper, numEmptySpacesAvailable, adjacentTileMatchesAvailable}
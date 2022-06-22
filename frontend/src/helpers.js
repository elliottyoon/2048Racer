
export function findFurthestOpenSpace(index, arr, lendpoint) {
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

export function generateRandomTile(gameState) {
    let temp = getEmptySpaces(gameState);
    let spaceIndices = temp["spaces"][Math.floor(Math.random() * temp["count"])]

    return {
        'space': spaceIndices,
        'val': Math.floor(Math.random() * 10) < 2 ? 4 : 2,
    }
    
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
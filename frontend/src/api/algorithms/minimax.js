import {
    slideUp, slideRight, slideDown, slideLeft, move,
    transpose, maxValue, numIslands, 
    numEmptySpacesAvailable, emptySpacesAvailable, 
    slideInDirection
} from '../../helpers.js';

// static evaluation function
let evaluation = function(gameState) {
    const numEmptyCells = numEmptySpacesAvailable(gameState);
    // parameter weights, may need additional fitting
    var smoothWeight = 0.1,
        monotonicityWeight   = 1.0,
        emptyWeight  = 2.7,
        maxWeight    = 1.0;

    return smoothWeight       * smoothness(gameState) 
        +  monotonicityWeight * monotonicity(gameState) 
        +  emptyWeight        * Math.log(numEmptyCells)
        +  maxWeight          * maxValue(gameState);

}
// measure of whether the values of the tiles are strictly increasing or decreasing in left/right and up/down dirs
let monotonicity = function(gs) {
    /* 
    totals = [ 
        strictly decreasing in up/down dir weight, 
        strictly increasing in up/down dir weight,
        strictly decreasing in right/left dir weight,
        strictly increasing in right/left dir weight
    ] 
    */
    let totals = [0, 0, 0, 0]; 
    // up/down
    for (let i = 0; i < 4; i++) {
        // updates increasing and decreasing weights
        let curr = 0;
        let next = 1;
        while (next < 4) {
            // traverses through row until finds nonempty tile
            while (next < 4 && gs[i][next] == '') {
                next++;
            }
            // all tiles in row are empty
            if (next == 4) next = 3;
            // getting what power of 2 the current tile value is (sets 0 if empty)
            let currentVal = (gs[i][curr] != '') ? Math.log(gs[i][curr]) / Math.log(2) : 0;
            let nextVal = (gs[i][next] != '') ? Math.log(gs[i][next]) / Math.log(2) : 0;
            // adds to strictly decreasing weight
            if (currentVal > nextVal) {
                totals[0] += nextVal - currentVal;
            } else if (currentVal < nextVal) {
                totals[1] += currentVal - nextVal;
            }
            
            curr = next;
            next++;
        }
    }

    // left/right
    for (let j = 0; j < 4; j++) {
        // updates increasing and decreasing weights
        let curr = 0;
        let next = 1;
        while (next < 4) {
            // traverses through row until finds nonempty tile
            while (next < 4 && gs[next][j] == '') {
                next++;
            }
            // all tiles in row are empty
            if (next >= 4) next--;
            // getting what power of 2 the current tile value is (sets 0 if empty)
            let currentVal = (gs[curr][j] != '') ? Math.log(gs[curr][j]) / Math.log(2) : 0;
            let nextVal = (gs[curr][j] != '') ? Math.log(gs[curr][j]) / Math.log(2) : 0;
            // adds to strictly decreasing weight
            if (currentVal > nextVal) {
                totals[2] += nextVal - currentVal;
            } else if (currentVal < nextVal) {
                totals[3] += currentVal - nextVal;
            }
            
            curr = next;
            next++;
        }
    }

    // since we are trying to maximize this value, we return the worst case scenario 
    // (expect the worst, hope for the best!)
    return Math.max(totals[0], totals[1]) + Math.max(totals[2], totals[3]);
}

// sums pairwise difference between neighboring tiles 
// (in log spaces to convey # of merges that need to occur to merge the two)
let smoothness = function(gameState) {
    const gs = gameState;
    const gsT = transpose(gs);
    let smoothness = 0;

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (gs[i][j] != '') {
                const val = Math.log(gs[i][j]) / Math.log(2);

                // horizontal dir
                let next = j + 1;
                while (next < 4 && gs[i][next] == '') {
                    next++;
                }
                if (next < 4) {
                    let targetVal = Math.log(gs[i][next]) / Math.log(2);
                    smoothness -= Math.abs(val - targetVal);
                }

                // vertical dir
                next = j + 1
                while (next < 4 && gsT[i][next] == '') {
                    next++;
                }
                if (next < 4) {
                    let targetVal = Math.log(gsT[i][next]) / Math.log(2);
                    smoothness -= Math.abs(val - targetVal);
                }

            }
        }
    }
    return smoothness;
}

// alpha-beta dfs 
let search = function(depth, alpha, beta, positions, cutoffs, playerTurn, gs) {
    let bestScore;
    let bestMove = -1;
    let res;

    // MAX player, aka user
    if (playerTurn) {
        bestScore = alpha;

        for (let dir = 0; dir < 4; dir++) {
            let newGameState = move(gs, dir);
            // if move actually changes gameState
            if (newGameState != false) {
                positions++;
                if (maxValue(newGameState) == 2048) {
                    return {
                        move: dir,
                        score: 10000,
                        positions: positions,
                        cutoff: cutoffs
                    };
                }
                if (depth == 0) {
                    res = {
                        move: dir,
                        score: evaluation(newGameState)
                    }
                } else {
                    // AI's turn
                    res = search(depth-1, bestScore, beta, positions, cutoffs, false, newGameState);
                    // AI winning condition
                    if (res.score > 9900) {
                        res.score--; 
                    }
                    positions = res.positions;
                    cutoffs = res.cutoffs;
                }

                // updates most favorable move for player
                if (res.score > bestScore) {
                    bestScore = res.score;
                    bestMove = dir;
                }
                // prunes unfavorable branch
                if (bestScore > beta) {
                    cutoffs++;
                    return {
                        move: bestMove,
                        score: beta,
                        positions: positions,
                        cutoffs: cutoffs
                    };
                }
            }
        }
    }
    // MIN player, aka computer placing tiles
    else {
        bestScore = beta;
        // place 2, 4 in each cell and measure impact on player 
        let candidates = [];
        let availableSpaces = emptySpacesAvailable(gs); // [[x,y], ...]
        let scores = {
            2: [],
            4: []
        }
        for (let val in scores) {
            for (let i in availableSpaces) {
                scores[val].push(null);
                let space = availableSpaces[i];
                let tempGameState = [['','','',''],['','','',''],['','','',''],['','','','']];
                for (let u=0; u<4; u++) {
                    for (let v=0; v<4; v++) {
                        tempGameState[u][v] = gs[u][v]
                    }
                }
                tempGameState[space[0]][space[1]] = val;
                // add 'annoyingness' to scores object
                scores[val][i] = -1 * smoothness(tempGameState) + numIslands(tempGameState);
            }
        }

        // pick most annoying move
        let maxScore = Math.max(Math.max.apply(null, scores[2]), Math.max.apply(null, scores[4]));
        for (let val in scores) { // 2, 4
            for (let i = 0; i < scores[val].length; i++) {
                if (scores[val][i] == maxScore) {
                    candidates.push({
                        position: availableSpaces[i], 
                        value: val
                    })
                }
            }
        }

        // search on each candidate
        for (let i = 0; i < candidates.length; i++) {
            let pos = candidates[i].position;
            let val = candidates[i].value;
            let newGameState = [['','','',''],['','','',''],['','','',''],['','','','']];
            for (let u=0; u<4; u++) {
                for (let v=0; v<4; v++) {
                    newGameState[u][v] = gs[u][v];
                }
            }

            newGameState[pos[0]][pos[1]] = val;
            positions++;
            res = search(depth, alpha, bestScore, positions, cutoffs, true, newGameState);
            positions = res.positions;
            cutoffs = res.cutoffs;

            if (res.score < bestScore) {
                bestScore = res.score;
            }
            if (bestScore < alpha) {
                cutoffs++;
                return {
                    move: null,
                    score: alpha,
                    positions: positions,
                    cutoffs: cutoffs
                }
            }
        }
    }
    return {
        move: bestMove,
        score: bestScore,
        positions: positions,
        cutoffs: cutoffs
    }
}

// iterative deepening over alpha-beta search
export default function iterativeDeep(getGameState, thinkTime) {
    let startTime = (new Date()).getTime(); 
    let depth = 0;
    let best = null;
    do {
        let newBest = search(depth, -10000, 10000, 0, 0, true, getGameState());

        if (newBest.move == -1) {
            // break;
        } else {
            best = newBest;
        }
        depth++;

    } while ((new Date()).getTime() - startTime < thinkTime);
    // } while( depth < 4 );
    console.log(best);
    return best;
}
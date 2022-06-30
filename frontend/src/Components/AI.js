import React from 'react';

import Square from './Square';
import BoardContainer from './BoardContainer';
import TileContainer from './TileContainer';

import {
    slideUp, slideRight, slideDown, slideLeft, move,
    transpose, maxValue, numIslands, 
    numEmptySpacesAvailable, emptySpacesAvailable, 
    slideInDirection
} from '../helpers.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo} from '@fortawesome/free-solid-svg-icons';

class AI extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            highestTile: 0,
            gameLost: false,
            thinkTime: 100 // in milliseconds
        }

        this.running = true; // is ai currently running

        this.renderSquare = this.renderSquare.bind(this);
        this.updateHighestTile = this.updateHighestTile.bind(this);
        this.onBoardMount = this.onBoardMount.bind(this);

        this.slideUp = this.slideUp.bind(this);
        this.slideRight = this.slideRight.bind(this);
        this.slideDown = this.slideDown.bind(this);
        this.slideLeft = this.slideLeft.bind(this);

        this.eval = this.eval.bind(this);
        this.smoothness = this.smoothness.bind(this);
        this.monotonicity = this.monotonicity.bind(this);

        this.search = this.search.bind(this);
        this.getBestMove = this.getBestMove.bind(this);
        this.iterativeDeep = this.iterativeDeep.bind(this);

        this.basicCorner = this.basicCorner.bind(this);
        this.run = this.run.bind(this);

        // newGameState => sets TileContainer.state.gameState = newGameState
        this.setGameState = null;
        // ()           => returns TileContainer.state.gameState
        this.getGameState = null;
        // ()           => resets TileContainer.state.gameState to random starting position
        this.resetGameState = null;

    }

    /*

    outline: Minimax search with alpha-beta pruning. Static evaluation function involves
                1. Monotonicity: values of the tiles are either increasing or decreasing along 
                   both the left/right and up/down dirs
                2. Smoothness: value difference between neighboring tiles, trying to minimize this count 
                3. Free tiles: penalty for having too few tiles 
        TODO: debug run (and monotonicity/smoothness functions)
    */

    /* ====================================== Interface Methods */
    renderSquare(i) {
        return <Square />;
    }

    updateHighestTile(update) {
        // winning condition
        if (update == 2048) {
            console.log('Good job Jarvis!');
        }

        this.setState({
            highestTile: update,
        });
    }

    onBoardMount(importFuncs) {
        this.setGameState = importFuncs[0];
        this.getGameState = importFuncs[1];
        this.resetGameState = importFuncs[2];
    }

    slideUp() {
        return slideUp(this.getGameState(), this.setGameState);
    }
    slideRight() {
        return slideRight(this.getGameState(), this.setGameState);
    }
    slideDown() {
        return slideDown(this.getGameState(), this.setGameState);
    }
    slideLeft() {
        return slideLeft(this.getGameState(), this.setGameState);
    }

    /* ====================================== AI Methods */

    // static evaluation function
    eval(gameState) {
        const numEmptyCells = numEmptySpacesAvailable(gameState);
        // parameter weights, may need additional fitting
        var smoothWeight = 0.1,
            monotonicityWeight   = 1.0,
            emptyWeight  = 2.7,
            maxWeight    = 1.0;

        return smoothWeight       * this.smoothness(gameState) 
            +  monotonicityWeight * this.monotonicity(gameState) 
            +  emptyWeight        * Math.log(numEmptyCells)
            +  maxWeight          * maxValue(gameState);

    }

    // sums pairwise difference between neighboring tiles 
    // (in log spaces to convey # of merges that need to occur to merge the two)
    smoothness(gameState) {
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
    // measure of whether the values of the tiles are strictly increasing or decreasing in left/right and up/down dirs
    monotonicity(gs) {
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

    // alpha-beta dfs 
    search(depth, alpha, beta, positions, cutoffs, playerTurn, gs) {
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
                            score: this.eval(newGameState)
                        }
                    } else {
                        // AI's turn
                        res = this.search(depth-1, bestScore, beta, positions, cutoffs, false, newGameState);
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
                    scores[val][i] = -this.smoothness(tempGameState) + numIslands(tempGameState);
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
                res = this.search(depth, alpha, bestScore, positions, cutoffs, true, newGameState);
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

    getBestMove() {
        return this.iterativeDeep();
    }

    // iterative deepening over alpha-beta search
    iterativeDeep() {
        let startTime = (new Date()).getTime(); 
        let depth = 0;
        let best = null;
        do {
            let newBest = this.search(depth, -10000, 10000, 0, 0, true, this.getGameState());

            if (newBest.move == -1) {
                // break;
            } else {
                best = newBest;
            }
            depth++;

        } while ((new Date()).getTime() - startTime < this.state.thinkTime);
        // } while( depth < 4 );
        console.log(best);
        return best;
    }

    run() {
        let intervalId = setInterval(() => {
            // if 2048 or something
            // => clearInterval(intervalID)
            let bestMove = this.getBestMove();
            if (bestMove === null) {
                clearInterval(intervalId);
            } else {
                slideInDirection(this.getGameState(), this.setGameState, bestMove.move);
            }
        }, this.state.thinkTime);
    }

    /* ====================================== Algorithms        */
    basicCorner() {
        let i = 0;
        let intervalID = setInterval(() => {
            // if 2048 or something
            // => clearInterval(intervalID);
            if (i % 2 == 0) {
                if (this.slideRight() == false) {
                    this.slideLeft();
                }
            }
            else {
                if (this.slideDown() == false) {
                    this.slideRight();
                };
            }
            i++;
        }, 50);
    }

    /* ====================================== Lifecycle Methods */

    componentDidMount() {
        this.basicCorner();
        //this.run();
    }


    render() {
        return (
            <div className="ai-container">
                <div className="ai-board">
                    <BoardContainer renderSquare={this.renderSquare}/>
                    <TileContainer 
                        highestTile={this.state.highestTile}
                        onMount={this.onBoardMount}
                        updateHighestTile={(update) => {}}/>
                </div>
                <div className="bottom">
                    <button className={"reset-board"}
                        tabIndex={"0"}
                        //onClick={this.boardSetter}
                        onClick={() => {this.resetGameState()}}
                        aria-label="Reset board"
                        data-balloon-pos="down">
                    <FontAwesomeIcon icon={ faRedo } size="lg"/>
                    </button>
                </div>
            </div>
            
        )
    }
    
}

export default AI;
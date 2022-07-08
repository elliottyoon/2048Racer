import React from 'react';

import Square from './Square';
import BoardContainer from './BoardContainer';
import TileContainer from './TileContainer';

import iterativeDeep from '../api/algorithms/minimax.js';

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

        this.iterativeDeep = iterativeDeep.bind(this);

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


    getBestMove() {
        return this.iterativeDeep(this.getGameState);
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

    /* ====================================== Lifecycle Methods */

    componentDidMount() {
        this.run();
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
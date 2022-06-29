import React from 'react';

import Square from './Square';
import BoardContainer from './BoardContainer';
import TileContainer from './TileContainer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo} from '@fortawesome/free-solid-svg-icons';

class AI extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            highestTile: 0,
        }

        this.renderSquare = this.renderSquare.bind(this);
        this.updateHighestTile = this.updateHighestTile.bind(this);
        this.onBoardMount = this.onBoardMount.bind(this);

        this.boardSetter = null;
    }

    /*

    outline: Minimax search with alpha-beta pruning. Static evaluation function involves
                1. Monotonicity: values of the tiles are either increasing or decreasing along 
                   both the left/right and up/down directions
                2. Smoothness: value difference between neighboring tiles, trying to minimize this count 
                3. Free tiles: penalty for having too few tiles
    */

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

    onBoardMount(setter) {
        console.log(setter);
        this.boardSetter = setter;
    }

    render() {
        return (
            <div className="ai-container">
                <div className="ai-board">
                    <BoardContainer renderSquare={this.renderSquare}/>
                    <TileContainer 
                        highestTile={this.state.highestTile}
                        onMount={this.onBoardMount}
                        updateHighestTile={this.updateHighestTile}/>
                </div>
                <div className="bottom">
                    <button className={"reset-board"}
                        tabIndex={"0"}
                        onClick={this.boardSetter}
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
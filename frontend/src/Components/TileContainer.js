import React from 'react';
import Tile from './Tile.js'
import {generateRandomTile, transpose, slideHelper} from '../helpers.js'

/*

* todo: 
    * animation stuff ahhhh
        - more specifically, figure out
        - how to update state after (and only after) window.requestAnimationFrame in the slide completes its taskss

    * endgame functionality  

*/

class TileContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currVal: Math.floor(Math.random() * 10) < 2 ? 4 : 2,
            highestTile: 0,
            gameState: [
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
            ],
            tileFontSize: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tile-font-size'))
        }

        this.highlightedTile = null;

        this.resetBoard = this.resetBoard.bind(this);
        
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.renderTile = this.renderTile.bind(this);
        this.insertRandomTile = this.insertRandomTile.bind(this);

        this.slideUp = this.slideUp.bind(this);
        this.slideDown = this.slideDown.bind(this);
        this.slideRight = this.slideRight.bind(this);
        this.slideLeft = this.slideLeft.bind(this);
 
        this.updateGameState = this.updateGameState.bind(this);

        // arrow key functionality
        window.addEventListener('keydown', this.handleKeyPress)

        // add first two random tiles
        const rand1 = generateRandomTile(this.state.gameState);
        this.state.gameState[rand1["space"][0]][[rand1["space"][1]]] = rand1["val"];

        const rand2 = generateRandomTile(this.state.gameState);
        this.state.gameState[rand2["space"][0]][[rand2["space"][1]]] = rand2["val"];

        this.highestTile = Math.max(rand1["val"], rand2["val"]);
        this.props.updateHighestTile(this.highestTile);

        /********************************************* */

        
    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            if (this.state.tileFontSize != parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tile-size'))) {
                this.setState({
                    // tileFontSize acts as a canary; can be any of the css variables
                    tileFontSize: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tile-size'))
                })
            }
        });
    }

    componentDidUpdate() {
        // updates highest tile if necessary
        const gsClone = this.state.gameState;
        let updated = false;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (gsClone[i][j] > this.highestTile) {
                    this.highestTile = gsClone[i][j];
                    updated = true;
                }
            }
        }
        if (updated) {
            this.props.updateHighestTile(this.highestTile);
        }
    }

    componentWillMount() {
        this.props.onMount(this.resetBoard);
    }

    resetBoard() {
        let gameState = [
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
            ];
        
         // add first two random tiles
        const rand1 = generateRandomTile(gameState);
        gameState[rand1["space"][0]][[rand1["space"][1]]] = rand1["val"];

        const rand2 = generateRandomTile(gameState);
        gameState[rand2["space"][0]][[rand2["space"][1]]] = rand2["val"];

        this.props.updateHighestTile(Math.max(rand1["val"], rand2["val"]));

        this.setState({
            gameState: gameState,
        });

    }

    handleKeyPress(event) {
        const key = event.key;

        switch(key) {
            // up
            case 'ArrowUp':
            case 'w':
                this.slideUp();
                break;
            // down
            case 'ArrowDown':
            case 's':
                this.slideDown();
                break;
            // right
            case 'ArrowRight':
            case 'd':
                this.slideRight();
                break;
            // left
            case 'ArrowLeft':
            case 'a':
                this.slideLeft();
                break;
        }
    }

    async slideUp() {
        // temporary gameState, oriented so that we slide along inner array
        let cols = transpose(this.state.gameState);
        // changes to gamestate. holds {outerIdx: int, !!for inner index: start: int, end: int ,!! merge?: bool } objects
        
        let changes = slideHelper(cols);
        if (changes.length > 0) {
            this.setState({
                gameState: this.insertRandomTile(transpose(cols))
            });
        }
        
    }

    /* broken animation functionality. was in slideDirection, but putting here for now:

    marge animation: animation: pop 200ms ease 100ms

    // iterates through slides and merges: animates accordingly and then updates state after animations finish
            let animate = new Promise((resolve, reject) => {
                window.requestAnimationFrame(async () => { 
                    for (let c in changes) {
                        let change = changes[c];
                        // merge animation
                        if (change["didMerge"] == true) {
                            await this.mergeTile(document.getElementById(`tile-${change["start"]}-${change["outerIdx"]}`), 0, change["end"] - change["start"]);
                        }
                        // slide animation
                        else {
                            console.log(`tile-${change["start"]}-${change["outerIdx"]}`);
                            await this.slideTile(document.getElementById(`tile-${change["start"]}-${change["outerIdx"]}`), 0, change["end"] - change["start"]);
                        }
                        
                    }
                });
                resolve();
            });
    */

    async slideLeft() {
        // temporary gameState, oriented so that we slide along inner array
        let cols = this.state.gameState;
        // changes to gamestate. holds {outerIdx: int, !!for inner index: start: int, end: int ,!! merge?: bool } objects
        
        let changes = slideHelper(cols);
        if (changes.length > 0) {
            this.setState({
                gameState: this.insertRandomTile(cols)
            });
        }
    }

    async slideDown() {
        // temporary gameState, oriented so that we slide along inner array
        let cols = transpose(this.state.gameState);
        for (let c in cols) {
            cols[c].reverse()
        }
        // changes to gamestate. holds {outerIdx: int, !!for inner index: start: int, end: int ,!! merge?: bool } objects
        
        let changes = slideHelper(cols);
        if (changes.length > 0) {
            for (let c in cols) {
                cols[c].reverse()
            }
            this.setState({
                gameState: this.insertRandomTile(transpose(cols))
            });
        }
    }

    async slideRight() {
        // temporary gameState, oriented so that we slide along inner array
        let cols = this.state.gameState.slice();     


        for (let c in cols) {
            cols[c] = cols[c].slice().reverse()
        }
        // changes to gamestate. holds {outerIdx: int, !!for inner index: start: int, end: int ,!! merge?: bool } objects
        let changes = slideHelper(cols);
        if (changes.length > 0) {
            for (let c in cols) {
                cols[c].reverse();
            }
            this.setState({
                gameState: this.insertRandomTile(cols)
            });
        }
    }


    updateGameState(arrays) {
        // takes array of [row, col, val] arrays
        let tempState = this.state.gameState;
        for (let i in arrays) {
            let arr = arrays[i];
            tempState[arr[0]][arr[1]] = arr[2];
        }
        
        this.setState({
            gameState: tempState, 
        });
    }

    insertRandomTile(arr) {
        let tempGameState = arr;
        let tmp = generateRandomTile(tempGameState);
        tempGameState[tmp["space"][0]][[tmp["space"][1]]] = tmp["val"]
        return tempGameState;
    }

    renderTile(i, j, val) {
        const tileMargin = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tile-margin'));
        const tileLength = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tile-size')) 
        const tileOffset = tileMargin + tileLength;

        // row i, column j
        const x = tileMargin + i * tileOffset; // tile size = (106.25 + 15) = 121.25px
        const y = tileMargin + j * tileOffset;   

        // coloring
        let background = getComputedStyle(document.documentElement).getPropertyValue(`--color-${val}x`);
        let color = '#282c34';
        let fontSize = getComputedStyle(document.documentElement).getPropertyValue('--tile-font-size');
        let styles = {};

        if (val > 4) {
            color = '#f9f6f2';
        }


        if (val < 128) {
            styles = {
                top: x + 'px',
                left: y + 'px',
                background: background,
                color: color,
                fontSize: fontSize,
            }

        } else {
            // removes highlight from current emphasized tile
            if (this.highlightedTile !== null) {
                try {
                    document.getElementById(this.highlightedTile).style.removeProperty('box-shadow')
                }
                catch {
                    console.log('Error finding tile to remove highlighting');
                }
                
            }
            
            this.highlightedTile = 'tile-'+ i + "-" + j;
            let boxShadow = '0 0 30px 10px rgb(243 215 116 / 24%), inset 0 0 0 1px rgb(255 255 255 / 14%)';
            switch (val) {
                case 128:
                    fontSize = getComputedStyle(document.documentElement).getPropertyValue('--tile-font-size-3digit');
                    break;
                case 256:
                    fontSize = getComputedStyle(document.documentElement).getPropertyValue('--tile-font-size-3digit');
                    boxShadow = '0 0 30px 10px rgb(243 215 116 / 32%), inset 0 0 0 1px rgb(255 255 255 / 19%)';
                    break;
                case 512:
                    fontSize = getComputedStyle(document.documentElement).getPropertyValue('--tile-font-size-3digit');
                    boxShadow = '0 0 30px 10px rgb(243 215 116 / 40%), inset 0 0 0 1px rgb(255 255 255 / 24%)';
                    break;
                case 1024:
                    fontSize = getComputedStyle(document.documentElement).getPropertyValue('--tile-font-size-4digit');
                    boxShadow = '0 0 30px 10px rgb(243 215 116 / 48%), inset 0 0 0 1px rgb(255 255 255 / 29%)';
                    break;
                case 2048:
                    fontSize = getComputedStyle(document.documentElement).getPropertyValue('--tile-font-size-3digit');
                    // boxShadow = ...
                    break;
            }

            styles = {
                top: x + 'px',
                left: y + 'px',
                transform: 'translate(0)',
                background: background,
                fontSize: fontSize,
                color: color,
                boxShadow: boxShadow,
            }
            
        }
        
        return (
            <Tile key={`${i} ${j}`} 
                  value={val} 
                  style={styles}
                  id={"tile-"+ i + "-" + j}/>
        )
    }
    
    render() {
        // console.log(this.state.gameState);
        const content = [];
        let temp = '';
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                temp = this.state.gameState[i][j];
                if (temp !== '') {
                    content.push(this.renderTile(i, j, temp));
                }
            }
        }
        return (
            <div className="tile-container">
                {content}
            </div>
        )
    }
}

export default TileContainer;

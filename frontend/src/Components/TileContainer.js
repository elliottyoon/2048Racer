import React from 'react';
import Tile from './Tile.js'
import {slideUp, slideDown, slideLeft, slideRight,
        generateRandomTile } from '../helpers.js'

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
            gameState: [
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
            ],
            tileFontSize: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tile-font-size'))
        }

        this.highlightedTile = null;

        this.getBoard = this.getBoard.bind(this);
        this.setBoard = this.setBoard.bind(this);
        this.resetBoard = this.resetBoard.bind(this);
        
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.renderTile = this.renderTile.bind(this);
 
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
        let tileValPlaceholder = null;
        let updated = false;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (gsClone[i][j] > this.props.highestTile) {
                    tileValPlaceholder = gsClone[i][j];
                    updated = true;
                }
            }
        }
        if (updated) {
            this.props.updateHighestTile(tileValPlaceholder);
        }
    }

    componentWillMount() {
        const exportFuncs = [
            this.setBoard, 
            this.getBoard,
            this.resetBoard,
        ]
        this.props.onMount(exportFuncs);
    }

    getBoard() {
        return this.state.gameState;
    }
    setBoard(newGameState) {
        this.setState({
            gameState: newGameState
        });
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
                slideUp(this.state.gameState, (newGameState) => {
                    this.setState({
                        gameState: newGameState
                    });
                });
                break;
            // down
            case 'ArrowDown':
            case 's':
                slideDown(this.state.gameState, (newGameState) => {
                    this.setState({
                        gameState: newGameState
                    });
                });
                break;
            // right
            case 'ArrowRight':
            case 'd':
                slideRight(this.state.gameState, (newGameState) => {
                    this.setState({
                        gameState: newGameState
                    });
                });
                break;
            // left
            case 'ArrowLeft':
            case 'a':
                slideLeft(this.state.gameState, (newGameState) => {
                    this.setState({
                        gameState: newGameState
                    });
                });
                break;
        }
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
        console.log('fred');
        
        let content = [];
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

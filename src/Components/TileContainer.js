import React from 'react';
import Tile from './Tile.js'
import {findFurthestOpenSpace, generateRandomTile} from '../helpers.js'

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
        }
        
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.renderTile = this.renderTile.bind(this);
        this.insertRandomTile = this.insertRandomTile.bind(this);

        this.slideUp = this.slideUp.bind(this);
        this.slideDown = this.slideDown.bind(this);
        this.slideRight = this.slideRight.bind(this);
        this.slideLeft = this.slideLeft.bind(this);

        this.mergeTile = this.mergeTile.bind(this);
        this.slideTile = this.slideTile.bind(this);
 
        this.slideHelper = this.slideHelper.bind(this);
        this.transpose = this.transpose.bind(this);
        this.updateGameState = this.updateGameState.bind(this);

        // arrow key functionality
        window.addEventListener('keydown', this.handleKeyPress)

        // add first two random tiles
        const rand1 = generateRandomTile(this.state.gameState);
        this.state.gameState[rand1["space"][0]][[rand1["space"][1]]] = rand1["val"];

        const rand2 = generateRandomTile(this.state.gameState);
        this.state.gameState[rand2["space"][0]][[rand2["space"][1]]] = rand2["val"];

        /********************************************* */
    }

    handleKeyPress(event) {
        const key = event.key;
        let arr = null;

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
        let cols = this.transpose(this.state.gameState);
        // changes to gamestate. holds {outerIdx: int, !!for inner index: start: int, end: int ,!! merge?: bool } objects
        
        let changes = this.slideHelper(cols);
        if (changes.length > 0) {
            this.setState({
                gameState: this.insertRandomTile(this.transpose(cols))
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
        
        let changes = this.slideHelper(cols);
        if (changes.length > 0) {
            this.setState({
                gameState: this.insertRandomTile(cols)
            });
        }
    }

    async slideDown() {
        // temporary gameState, oriented so that we slide along inner array
        let cols = this.transpose(this.state.gameState);
        for (let c in cols) {
            cols[c].reverse()
        }
        // changes to gamestate. holds {outerIdx: int, !!for inner index: start: int, end: int ,!! merge?: bool } objects
        
        let changes = this.slideHelper(cols);
        if (changes.length > 0) {
            for (let c in cols) {
                cols[c].reverse()
            }
            this.setState({
                gameState: this.insertRandomTile(this.transpose(cols))
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
        let changes = this.slideHelper(cols);
        if (changes.length > 0) {
            for (let c in cols) {
                cols[c].reverse();
            }
            this.setState({
                gameState: this.insertRandomTile(cols)
            });
        }
    }
                            


    async slideTile(tile, dx, dy) {
        // negative dx -> left
        // negative dy -> up
        tile.style.transform = `translate(${dx * 121.25}px, ${dy * 121.25}px)`;
        //await new Promise(r => setTimeout(r, 200));
        return tile.textContent;
    }

    async mergeTile(tile, dx, dy) {
        let val = Number(tile.textContent) * 2;
        tile.style.transform = `translate(${dx * 121.25}px, ${dy * 121.25}px)`;
        //await new Promise(r => setTimeout(r, 200));
        // double value 
        //tile.textContent = val;
        return val;
    }
    
    slideHelper(cols) {
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
                            
                            // updates temporary game state
                            cols[col][index] = cols[col][i] * 2;
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

    transpose(array) {
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
        // row i, column j
        const x = 15 + i * 121.25; // tile size = (106.25 + 15) = 121.25px
        const y = 15 + j * 121.25;    

        // coloring
        let background = '#abb2bf';
        let color = '#282c34';
        let fontSize = '60px';
        let styles = {};

        if (val > 4) {
            color = '#f9f6f2';
        }


        if (val < 128) {
            switch (val) {
                case 4: 
                    background = '#eee1c9';
                    break;
                case 8:
                    background = '#f3b27a';
                    break;
                case 16:
                    background = '#f69664';
                    break;
                case 32:
                    background = '#f77c5f';
                    break;
                case 64: //todo
                    background = '#f75f3b';
                    break;
            }

            styles = {
                top: x + 'px',
                left: y + 'px',
                transform: 'translate(0)',
                background: background,
                color: color,
                fontSize: fontSize,
            }

        } else {
            let boxShadow = '0 0 30px 10px rgb(243 215 116 / 24%), inset 0 0 0 1px rgb(255 255 255 / 14%)';
            switch (val) {
                case 128:
                    background = '#edd073';
                    fontSize = '45px';
                    break;
                case 256:
                    background = '#edcc62';
                    fontSize = '45px';
                    boxShadow = '0 0 30px 10px rgb(243 215 116 / 32%), inset 0 0 0 1px rgb(255 255 255 / 19%)';
                    break;
                case 512:
                    background = '#edc950';
                    fontSize = '45px';
                    boxShadow = '0 0 30px 10px rgb(243 215 116 / 40%), inset 0 0 0 1px rgb(255 255 255 / 24%)';
                    break;
                case 1024:
                    background = '#edc53f';
                    fontSize = '35px';
                    boxShadow = '0 0 30px 10px rgb(243 215 116 / 48%), inset 0 0 0 1px rgb(255 255 255 / 29%)';
                    break;
                case 2048:
                    background = '#17a589';
                    fontSize = '35px';
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
        console.log(this.state.gameState);
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

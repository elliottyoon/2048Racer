import React from 'react';
import Tile from './Tile.js'

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
        this.slideUp = this.slideUp.bind(this);

        this.findFurthestOpenSpace = this.findFurthestOpenSpace.bind(this);
        this.slideTile = this.slideTile.bind(this);

        this.transpose = this.transpose.bind(this);
        this.updateGameState = this.updateGameState.bind(this);

        // arrow key functionality
        window.addEventListener('keydown', this.handleKeyPress)

        /******** add first two initial tiles *********/
        const x1 = Math.floor(Math.random() * 4);
        const y1 = Math.floor(Math.random() * 4);
        const val1 = Math.floor(Math.random() * 10) < 2 ? 4 : 2;

        let x2 = Math.floor(Math.random() * 4);
        let y2 = Math.floor(Math.random() * 4);
        const val2 = Math.floor(Math.random() * 10) < 2 ? 4 : 2;

        while (x1 === x2 && y1 === y2) {
            x2 = Math.floor(Math.random() * 4);
            y2 = Math.floor(Math.random() * 4);
        }

        this.state.gameState[x1][y1] = val1;
        this.state.gameState[x2][y2] = val2;

        /********************************************* */
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
                break;
            // right
            case 'ArrowRight':
            case 'd':
                break;
            // left
            case 'ArrowLeft':
            case 'a':
                break;
        }
    }

    async slideUp() {
        // gets array of columns from array of rows
        const cols = this.transpose(this.state.gameState);
        // temp index
        let tempIdx = 0;
        // temp gameState
        let tempGameState = null;

        // for each column
        for (let col = 0; col < 4; col++) {
            /** Todo: add merges
             *        make slides async so that they happen at the same time
             */
            // no merges for now, just sliding
            console.log(cols[col]);
            
            for (let i = 1; i < 4; i++) {
                // we only care if this is a nonempty tile
                if (cols[col][i] !== '') {
                    tempIdx = this.findFurthestOpenSpace(i, cols[col]);
                    // if there is a valid move
                    if (tempIdx != i) {
                        // slide animation
                        this.slideTile(document.getElementById("tile-" + i + "-" + col), 0, tempIdx - i);
                        await new Promise(r => setTimeout(r, 100));
                        // updates gameState
                        cols[col][tempIdx] = cols[col][i];
                        cols[col][i] = '';
                        

                        tempGameState = this.state.gameState;
                        this.updateGameState([
                            [tempIdx, col, cols[col][tempIdx]],
                            [i, col, '']
                        ]);
                    }
                }
            }
        }

        
    }

    findFurthestOpenSpace(index, arr) {
        // iterates backward through array starting at starting index and looks for 
        // furthest empty space such that the path to that space is empty
        let ptr = index - 1;
        while (-1 < ptr) {
            if (arr[ptr] !== '') break;
            ptr -= 1;
        }
        return ptr + 1;
    }

    slideTile(tile, dx, dy) {
        // negative dx -> left
        // negative dy -> up
        tile.style.transform = `translate(${dx * 121.25}px, ${dy * 121.25}px)`;
        
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

    renderTile(i, j, val) {
        // row i, column j
        const x = 15 + i * 121.25; // tile size = (106.25 + 15) = 121.25px
        const y = 15 + j * 121.25;    
        
        const styles = {
            top: x + 'px',
            left: y + 'px',
            // transform: 'translate(' + y + 'px, ' + x + 'px)',
        }
        console.log("row: " + i + ", col: " + j + "value: "+ val);
        return (
            <Tile key={`${i} ${j}`} 
                  value={val} 
                  style={styles}
                  id={"tile-"+ i + "-" + j}/>
        )
    }
    
    render() {
        console.log(this.state.gameState);
        console.log('rendered');
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
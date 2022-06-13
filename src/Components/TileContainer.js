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
            currTiles: [],
        }
        
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.renderTile = this.renderTile.bind(this);
        this.slideUp = this.slideUp.bind(this);

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

        while (x1 == x2 && y1 == y2) {
            x2 = Math.floor(Math.random() * 4);
            y2 = Math.floor(Math.random() * 4);
        }

        this.updateGameState(x1, y1, val1);
        this.updateGameState(x2, y2, val2);

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

    slideUp() {
        // gets array of columns from array of rows
        const cols = this.transpose(this.state.gameState);

        // for each column
        for (let col = 0; col < 4; col++) {
            // no merges for now, just sliding
        }
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
                if (val != '')  {
                    newArr[j][i] = val;
                }
            }
        }

        return newArr;
    }

    updateGameState(row, col, val) {
        let tempState = this.state.gameState;
        tempState[row][col] = val;

        this.setState = {
            gameState: tempState,
            currTiles: this.state.currTiles.push({
                "row": row,
                "col": col,
                "val": val,
            })
        }
    }

    renderTile(i, j, val) {
        // row i, column j
        const x = i * 121.25; // 106.25 + 15
        const y = j * 121.25; // 106.25 + 15      
        
        const styles = {
            transform: 'translate(' + y + 'px, ' + x + 'px)',
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
        const content = [];
        let temp = '';
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                temp = this.state.gameState[i][j];
                if (temp != '') {
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
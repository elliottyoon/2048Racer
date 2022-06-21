import React from 'react';
import TileContainer from './TileContainer.js';
import Timer from './Timer.js';
import Square from './Square.js';

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeStart: (new Date()).getTime(),
      timeStopped: false,
      highestTile: 0,
    }

    this.renderSquare = this.renderSquare.bind(this);
    this.onTimerMount = this.onTimerMount.bind(this);
    this.onBoardMount = this.onBoardMount.bind(this);
    this.callStopTime = this.callStopTime.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
    this.updateHighestTile = this.updateHighestTile.bind(this);

    
    this.timeSetter = null;
    this.boardSetter = null;

  }

  renderSquare(i) {
    return <Square />;
  }

  onTimerMount(setter) {
    this.timeSetter = setter;
  }
  onBoardMount(setter) {
    console.log(setter);
    this.boardSetter = setter;
  }

  callStopTime() {
    this.timeSetter();
  }
  resetBoard() {
    this.boardSetter();
  }
  
  updateHighestTile(update) {
    this.setState({
      highestTile: update,
    });
  }
  
  

  render() {
    return (
      <div className="game">
        <main>
          <div className="heading">
            <h1 className="title">4096</h1>
          </div>
          <div className="board-container">
              <div className="board-row">
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
                {this.renderSquare(3)}
              </div>
              <div className="board-row">
                {this.renderSquare(4)}
                {this.renderSquare(5)}
                {this.renderSquare(6)}
                {this.renderSquare(7)}
              </div>
              <div className="board-row">
                {this.renderSquare(8)}
                {this.renderSquare(9)}
                {this.renderSquare(10)}
                {this.renderSquare(11)}          
              </div>
              <div className="board-row">
                {this.renderSquare(12)}
                {this.renderSquare(13)}
                {this.renderSquare(14)}
                {this.renderSquare(15)}          
              </div>
          </div>
          <TileContainer stopTime={this.callStopTime} 
                         onMount={this.onBoardMount}
                         updateHighestTile={this.updateHighestTile}/>
        </main> 
        <aside>
          <Timer timeStart={this.state.timeStart} onMount={this.onTimerMount}/>
          <p>Highest tile: {this.state.highestTile}</p>
          <button className={"reset-board"} onClick={this.resetBoard}>Reset Board</button>
        </aside>
      </div>
    );
  }
}

export default Board;
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
    }

    this.renderSquare = this.renderSquare.bind(this);
    this.onChildMount = this.onChildMount.bind(this);
    this.callStopTime = this.callStopTime.bind(this);
    
    this.setter = null;

  }

  renderSquare(i) {
    return <Square />;
  }

  onChildMount(setter) {
    this.setter = setter;
  }

  callStopTime() {
    this.setter();
  }
  
  

  render() {
    return (
      <div>
        <div className="heading">
            <h1 className="title">4096</h1>
        </div>
        <Timer timeStart={this.state.timeStart} onMount={this.onChildMount}/>
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
        <TileContainer stopTime={this.callStopTime}/>
      </div>
    );
  }
}

export default Board;
import React from 'react';
import TileContainer from './TileContainer.js'
import Square from './Square.js'

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      score: 0,
    }

  }

  renderSquare(i) {
    return <Square />;
  }

  render() {
    return (
      <div>
        <div className="heading">
            <h1 className="title">4096</h1>
        </div>
        <div className="status">{'Time: idk man'}</div>
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
        <TileContainer/>
      </div>
    );
  }
}

export default Board;
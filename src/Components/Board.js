import React from 'react';
import TileContainer from './TileContainer.js'
import Square from './Square.js'

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeStart: (new Date()).getTime(),
      minutesElapsed: 0,
      secondsElapsed: 0,
    }

    this.setTime = this.setTime.bind(this)

  }

  renderSquare(i) {
    return <Square />;
  }

  componentWillMount() {
    setInterval(this.setTime, 10);
  }

  setTime() {
    this.setState({
      minutesElapsed: Math.round(((new Date()).getTime() - this.state.timeStart) / 60000),
      secondsElapsed: (Math.round(((new Date()).getTime() - this.state.timeStart) / 1000) % 60).toString().padStart(2, '0'),
      msElapsed: (Math.round(((new Date()).getTime() - this.state.timeStart) / 10) % 100).toString().padStart(2, '0'),
    })
  }

  render() {
    return (
      <div>
        <div className="heading">
            <h1 className="title">4096</h1>
        </div>
        <div className="status">Time Elapsed: {this.state.minutesElapsed}:{this.state.secondsElapsed}.{this.state.msElapsed}</div>
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
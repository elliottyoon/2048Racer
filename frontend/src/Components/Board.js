import React from 'react';
import 'balloon-css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';

import TileContainer from './TileContainer.js';
import Timer from './Timer.js';
import Square from './Square.js';

import { connect, sendMsg, startServerTime } from "../api"

class Board extends React.Component {
  constructor(props) {
    super(props);
    connect();

    this.state = {
      timeStart: (new Date()).getTime(),
      timeStopped: false,
      highestTile: 0,
      chatHistory: [],
    }

    this.send = this.send.bind(this);

    this.renderSquare = this.renderSquare.bind(this);
    this.onTimerMount = this.onTimerMount.bind(this);
    this.onBoardMount = this.onBoardMount.bind(this);
    this.callStopTime = this.callStopTime.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
    this.updateHighestTile = this.updateHighestTile.bind(this);

    this.startTimeForAll = this.startTimeForAll.bind(this);
    
    this.timeStarter = null;
    this.timeStopper = null;
    this.boardSetter = null;

  }

  send() {
    console.log("Sending message...");
    sendMsg(`Highest tile: ${this.state.highestTile}.`);
  }

  renderSquare(i) {
    return <Square />;
  }

  onTimerMount(setter) {
    this.timeStopper = setter[0];
    this.timeStarter = setter[1];
  }
  onBoardMount(setter) {
    console.log(setter);
    this.boardSetter = setter;
  }

  startTimeForAll() {
    startServerTime();
  }

  callStopTime() {
    this.timeStopper();
  }
  resetBoard() {
    this.boardSetter();
  }
  
  updateHighestTile(update) {
    // winning condition
    if (update == 8) {
      sendMsg('User Won');
    }

    this.setState({
      highestTile: update,
    });
  }

  componentDidMount() {
    connect((msg) => {
      // handles different messages
      const messageBody = JSON.parse(msg.data).body

      if (messageBody.includes("StartTime")) {
        this.timeStarter(Number(messageBody.slice(11)))
        this.resetBoard();
      } else {
        if (messageBody.includes("won")) {
          this.callStopTime();
          console.log(messageBody);
        } else {
          console.log(messageBody);
        }


        this.setState(prevState => ({
          chatHistory: [...prevState.chatHistory, messageBody],
        }))
      }
    });
  }

  
  

  render() {
    console.log(this.state.chatHistory)
    const messages = this.state.chatHistory.map((msg, index) => (
      <p key={index}>{msg}</p>
    ))
    console.log(messages)

    return (
      <div className="window">
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
            <Timer onMount={this.onTimerMount}/>
            <p>Highest tile: {this.state.highestTile}</p>
            <button onClick={this.startTimeForAll}> Start Racing!</button>
            <div className="ChatHistory">
              {messages}
            </div>
            
          </aside>
        </div>
        <div className="bottom">
          
            <div className={"reset-board"}
                  tabIndex={"0"}
                  onClick={this.resetBoard}
                  aria-label="Reset board"
                  data-balloon-pos="down">
              <FontAwesomeIcon icon={ faRedo } />
            </div>
        </div>
      </div>
    );
  }
}

export default Board;
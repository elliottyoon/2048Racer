import React from 'react';
import 'balloon-css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faTrophy } from '@fortawesome/free-solid-svg-icons';

import BoardContainer from './BoardContainer.js'
import TileContainer from './TileContainer.js';

import ChatHistory from './ChatHistory';
import Timer from './Timer.js';
import Modal from './Modal.js';
import Square from './Square.js';

import { connect, sendMsg, startServerTime} from "../api"

class Board extends React.Component {
  constructor(props) {
    super(props);

    try {
      connect();
      this.isConnected = true;
    } catch(error) {
      console.error(error);
      this.isConnected = false;
    }

    this.state = {
      timeStart: (new Date()).getTime(),
      timeStopped: false,
      highestTile: 0,
      chatHistory: [],
      modal: null,
    }

    this.colors = {
      2: '#abb2bf',
      4: '#eee1c9',
      8: '#f3b27a',
      16: '#f69664',
      32: '#f77c5f',
      64: '#f75f3b',
      128: '#edd073',
      256: '#edcc62',
      512: '#edc950',
      1024: '#edc53f',
      2048: '#17a589'
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

  renderModal(type) {
    if (!type) {
      return;
    }
    if (type == "win") {
      return <Modal value="Cowabunga you won!" id="game-won"/>;
    }
    if (type = "lose") {
      return <Modal value="Drip drop you flop" id="game-lost"/>;
    }
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
    this.setState({
      modal: null,
    })
    startServerTime();
  }

  callStopTime() {
    this.timeStopper();
  }
  resetBoard() {
    this.boardSetter();
    this.setState({
      modal: null,
    })
  }
  
  updateHighestTile(update) {
    let stateChanges = {
      highestTile: update,
    };

    // winning condition
    if (update == 2048) {
      sendMsg('User Won');
      stateChanges["modal"] = "win";
    }

    this.setState(stateChanges);
  }


  componentDidMount() {
    connect((msg) => {
      // handles different messages
      let messageBody = JSON.parse(msg.data).body;

      if (messageBody.includes("StartTime")) {
        this.timeStarter(Number(messageBody.slice(11)))
        this.resetBoard();
        messageBody = "Starting race..."
      }
      if (messageBody.includes("won")) {
        this.callStopTime();
        // and you didn't win
        if (!this.state.modal) {
          this.setState({
            modal: "lose",
          })
        }
        console.log(messageBody);
      } else {
        console.log(messageBody);
      }


      this.setState(prevState => ({
        chatHistory: [...prevState.chatHistory, messageBody],
      }))
    }
    );
  }

  
  

  render() {
    let divColor = 'grey';
    if (this.state.highestTile > 64) {
      divColor = this.colors[this.state.highestTile];
    }

   
    return (
      <div className="board">
        <div className="game">
          <aside>
            <div className="heading">
              <h1 className="title">4096</h1>
            </div>
            <div className="iconContainer">
              <Timer onMount={this.onTimerMount}/>
              <div id="highest-tile" style={{color: divColor}}>
                <FontAwesomeIcon icon={ faTrophy } className="inlineIcon"/>
                {this.state.highestTile}
              </div>
            </div>
            <button onClick={this.startTimeForAll}>
              Start Race
            </button>
            <ChatHistory chatHistory={this.state.chatHistory} />
          </aside>
          <main>
            { this.renderModal(this.state.modal) }
            <BoardContainer renderSquare={this.renderSquare}/>
            <TileContainer 
                colors={this.colors}
                stopTime={this.callStopTime} 
                onMount={this.onBoardMount}
                updateHighestTile={this.updateHighestTile}/>
          </main> 
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
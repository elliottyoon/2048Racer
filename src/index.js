import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import Board from './Components/Board.js'




class Game extends React.Component {

  render() {
    return (
      <Board />
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

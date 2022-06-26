import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import Board from './Components/Board.js'




class Game extends React.Component {

  render() {
    return (
      <div className="window">
        <Board />
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

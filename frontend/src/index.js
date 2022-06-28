import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import Board from './Components/Board.js'
import PrivacyPolicy from './Components/PrivacyPolicy';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"



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
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Game />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    </Routes>
  </Router>
);

function About() {
  return <h2>About</h2>;
}

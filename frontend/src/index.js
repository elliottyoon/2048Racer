import React from 'react';
import ReactDOM from 'react-dom/client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faLock, faCode, faBoltLightning} from '@fortawesome/free-solid-svg-icons';

import './index.css'

import AI from './Components/AI.js';
import Board from './Components/Board.js';
import Help from './Components/Help';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom"



class Game extends React.Component {

  render() {
    return (
      <div className="window">
        <div className="top"></div>
        <Board />
        <Footer />
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
      <Route path="/ai" element={<AI />}/>
      <Route path="/how-to-play" element={<Help />} />
    </Routes>
  </Router>
);

function Footer() {
  return <div className="footer">
            <ul>
              <li>
                <Link to="/how-to-play">
                  <FontAwesomeIcon icon={ faQuestionCircle } className="footer-icon"/>Help
                </Link>
              </li> 
              <li>
                <a href="https://github.com/elliottyoon/2048Racer">
                  <FontAwesomeIcon icon={ faCode } className="footer-icon"/>Github
                </a>
              </li>
              <li>
                <Link to="/ai">
                  <FontAwesomeIcon icon={ faBoltLightning } className="footer-icon"/>AI 
                </Link>
              </li>
            </ul>
          </div>;
}

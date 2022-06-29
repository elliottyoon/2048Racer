import React from 'react';
import ReactDOM from 'react-dom/client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faLock, faCode } from '@fortawesome/free-solid-svg-icons';

import './index.css'

import AI from './Components/AI.js';
import Board from './Components/Board.js';
import PrivacyPolicy from './Components/PrivacyPolicy';
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
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/how-to-play" element={<Help />} />
    </Routes>
  </Router>
);

function Footer() {
  return <div className="footer">
            <ul>
              <li><Link to="/how-to-play">
                <FontAwesomeIcon icon={ faQuestionCircle } className="footer-icon"/>Help</Link></li>
              <li><Link to="/privacy-policy">
                <FontAwesomeIcon icon={ faLock } className="footer-icon"/>Privacy
                </Link>
              </li>
              <li>
                <a href="https://github.com/elliottyoon/2048Racer">
                  <FontAwesomeIcon icon={ faCode } className="footer-icon"/>Github
                </a>
              </li>
            </ul>
          </div>;
}

import React from 'react';
import ReactDOM from 'react-dom/client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faLock, faCode, faBoltLightning} from '@fortawesome/free-solid-svg-icons';

import '../index.css'

import AI from './AI.js';
import Board from './Board.js';
import Help from './Help';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom"



class Racer extends React.Component {
  render() {
    <Router>
      <Routes>
        <Route path="/racer" element={<Racer />} />
        <Route path="/ai" element={<AI />}/>
        <Route path="/how-to-play" element={<Help />} />
      </Routes>
    </Router>

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
            </ul>
          </div>;
}

export default Racer;

import React from 'react';
import ReactDOM from 'react-dom/client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faBoltLightning} from '@fortawesome/free-solid-svg-icons';

import './index.css';

import AI from './Components/AI.js';
import Racer from './Components/Racer.js';
import Help from './Components/Help.js';

import {
  BrowserRouter as Router,
  useNavigate,
  Routes,
  Route,
  Link
} from "react-router-dom"


// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/racer" element={<Racer />} />
        <Route path="/ai" element={<AI />}/>
        <Route path="/how-to-play" element={<Help />} />
      </Routes>
    </Router>
);

function GameButton(props) {
    const navigate = useNavigate();
    let dest = props.dest;  
    let handleClick; 

    switch (dest) {
        case "github":
            handleClick = function() {
                window.open("https://github.com/elliottyoon/2048Racer");
            }
            return (
                <button className="external-button" type="button" onClick={handleClick}>
                    View the source code.
                </button>
            )
        case "racer":
            handleClick = function() {
                navigate("/racer");
            }
            return (
                <button className="menuButton flag-button" type="button" onClick={handleClick}>
                    <FontAwesomeIcon icon={ faFlag } className="footer-icon"/>Start racing 
                </button>
                )

        case "ai":
            handleClick = function() {
                navigate("/ai");
            }
            return (
                <button className="menuButton ai-button" type="button" onClick={handleClick}>
                    <FontAwesomeIcon icon={ faBoltLightning } className="footer-icon"/>Watch an AI
                </button>
                )
    }

}

function Menu() {
  return <div className="menu">
            <h1>Welcome to 2048Racer</h1>
            <div className="menu-buttons">
                <GameButton dest="racer" />
                or 
                <GameButton dest="ai" />
            </div>


            <GameButton dest="github" />


            
            
          </div>;
}

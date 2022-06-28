import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import Board from './Components/Board.js'
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
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/how-to-play" element={<Help />} />
    </Routes>
  </Router>
);

function Footer() {
  return <div className="footer">
            <ul>
              <li><Link to="/how-to-play">Help</Link></li>
              <li>
                <Link to="/privacy-policy">Privacy</Link></li>
            </ul>
          </div>;
}

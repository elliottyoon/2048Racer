import React from 'react';


class Help extends React.Component {
  render() {
    return (
      <div className="info">
        <h1>How to Play</h1>
        <p className="warning">As of June 27, 2022, only client-side functionalities work.</p>
        <p>Press the arrow keys or WASD to move the tiles in the desired direction. 
          <br></br> <br></br>
          If a tile runs into another tile of the same value, the two will merge into one tile of double value! 
          <br></br><br></br>
          Try to get the 2048 Tile!</p>
      </div>
    );
  }
}

export default Help;
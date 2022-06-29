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
          Try to get the 2048 Tile!
        </p>
        <hr></hr>
        <h1>Why 4096?</h1>
      <p>The idea for this game originally came from the spring quarter of my freshman year of college, during which my friend and I got really into racing each other in 2048, sitting next to one another running the original game on each of our own laptops.</p>
        <p>After the quarter ended, I thought it'd be cool to create my own web app that would allow us to continue the 2048 racing tradition, even with thousands of miles between us. And so, with <b>2</b> (or more!) games of <b>2048</b> running simultaneously, <b>4096</b> was born! 
        </p>
        <p>- with love, Elliott</p>
      </div>
    );
  }
}

export default Help;
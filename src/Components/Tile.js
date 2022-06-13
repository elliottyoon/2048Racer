import React from 'react';
import ReactDOM from 'react-dom';

class Tile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    }
  }

  render() {
    return (
      <button className="tile" style={this.props.style}>
        {this.props.value}
      </button>
    );
  }
}

export default Tile;
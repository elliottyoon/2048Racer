import React from 'react';

class Tile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    }
  }

  render() {
    return (
      <button className={"tile"} id={this.props.id} style={this.props.style}>
        {this.props.value}
      </button>
    );
  }
}

export default Tile;
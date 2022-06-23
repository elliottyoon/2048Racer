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
      <div className={"tile"} id={this.props.id} style={this.props.style}>
        {this.props.value}
      </div>
    );
  }
}

export default Tile;
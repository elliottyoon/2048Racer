import React from 'react';

class Modal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id={this.props.id} className={"game-message visually-hidden"}>
        <p>{this.props.value}</p>
      </div>
    );
  }
}

export default Modal;
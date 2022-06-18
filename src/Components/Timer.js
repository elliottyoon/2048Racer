import React from 'react';

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      minutesElapsed: 0,
      secondsElapsed: 0,
    }
    
    this.setTime = this.setTime.bind(this);
  }
  componentWillMount() {
    setInterval(this.setTime, 10);
  }

  setTime() {
    this.setState({
      minutesElapsed: Math.round(((new Date()).getTime() - this.props.timeStart) / 60000),
      secondsElapsed: (Math.round(((new Date()).getTime() - this.props.timeStart) / 1000) % 60).toString().padStart(2, '0'),
      msElapsed: (Math.round(((new Date()).getTime() - this.props.timeStart) / 10) % 100).toString().padStart(2, '0'),
    })
  }

  render() {
    return (
      <div className="status">Time Elapsed: {this.state.minutesElapsed}:{this.state.secondsElapsed}.{this.state.msElapsed}</div>
    );
  }
}

export default Timer;
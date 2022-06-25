import React from 'react';

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      minutesElapsed: 0,
      secondsElapsed: 0,
      timeStopped: true,
    }

    this.stopTime = this.stopTime.bind(this);
    this.startTime = this.startTime.bind(this);
  }

  stopTime() {
    this.setState({
      timeStopped: true,
    });
  }

  startTime(utcStartTime) {
    this.setState({
      timeStopped: false,
      timeStart: utcStartTime,
    })
  }
  
  componentWillMount() {
    this.props.onMount([this.stopTime, this.startTime]);
  }

  componentDidUpdate() {
    const interval = setInterval(() => {
      if (!this.state.timeStopped) {
        this.setState({
          minutesElapsed: Math.floor(((new Date()).getTime() - this.state.timeStart) / 60000),
          secondsElapsed: (Math.round(((new Date()).getTime() - this.state.timeStart) / 1000) % 60).toString().padStart(2, '0'),
          msElapsed: (Math.round(((new Date()).getTime() - this.state.timeStart) / 10) % 100).toString().padStart(2, '0'),
        });
      } else {
        clearInterval(interval);
      }
    }, 10);
  }

  render() {
    return (
      <div className="status">Time Elapsed: {this.state.minutesElapsed}:{this.state.secondsElapsed}.{this.state.msElapsed}</div>
    );
  }
}

export default Timer;
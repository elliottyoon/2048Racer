import React from 'react';

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      minutesElapsed: 0,
      secondsElapsed: 0,
      timeStopped: false,
    }

    this.stopTime = this.stopTime.bind(this);
  }

  stopTime() {
    console.log('hi');
    this.setState({
      timeStopped: true,
    })
  }
  
  componentWillMount() {
    this.props.onMount(this.stopTime);

    const interval = setInterval(() => {
      if (!this.state.timeStopped) {
        this.setState({
          minutesElapsed: Math.floor(((new Date()).getTime() - this.props.timeStart) / 60000),
          secondsElapsed: (Math.round(((new Date()).getTime() - this.props.timeStart) / 1000) % 60).toString().padStart(2, '0'),
          msElapsed: (Math.round(((new Date()).getTime() - this.props.timeStart) / 10) % 100).toString().padStart(2, '0'),
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
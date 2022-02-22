// @flow
import React, { PureComponent } from "react";
import css from "./current-time.style.css";
import moment from "moment";

type State = {
  currentTimePosition: number
};

type Props = {};

export default class CurrentTime extends PureComponent<Props, State> {
  interval: IntervalID;

  constructor(props: Props) {
    super(props);

    this.state = {
      currentTimePosition: 0
    };

    this.interval = setInterval(() => {
      this.setState({
        currentTimePosition: this.getPosition(new Date().toString())
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getPosition = (time: string) => {
    const hour = moment(time).hour();
    const minutes = moment(time).minutes();

    return hour * 87 + minutes * 87 / 60;
  };

  render() {
    const { currentTimePosition } = this.state;

    return (
      <div
        className={css.currentTime}
        style={{
          top: currentTimePosition
        }}
      >
        <span>{moment().format("hh:mm a")}</span>
      </div>
    );
  }
}

// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";
import type { Day } from "src/redux/modules/schedule/days";
import css from "./header.style.css";

type Props = {
  scheduleDay: ?Day
};

type State = {
  value: "off" | "scheduled"
};

export default class Header extends PureComponent<Props, State> {
  state = {
    value: "off"
  };

  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      // $FlowFixMe
      value: e.target.value
    });
  };

  componentWillReceiveProps = (nextProps: Props) => {
    const { scheduleDay } = this.props;

    if (!scheduleDay && nextProps.scheduleDay) {
      this.setState({
        value: "scheduled"
      });
    }
  };

  render() {
    const { scheduleDay } = this.props;

    return (
      <div className={css.header}>
        <h2 className={css.title}>
          {scheduleDay ? "Shooting schedule" : "Non-Shooting Day"}
        </h2>
        {/* <FormControl> */}
        <Select
          onChange={this.handleChange}
          // inputProps={{
          //   name: 'age',
          //   id: 'age',
          // }}
          value={this.state.value}
          classes={{
            root: css.selectRoot,
            input: css.selectInput
          }}
          IconComponent={() => <KeyboardArrowDown className={css.selectIcon} />}
          disableUnderline
        >
          <MenuItem value={"off"}>Day Off</MenuItem>
          <MenuItem value={"scheduled"}>Scheduled</MenuItem>
        </Select>
        {/* </FormControl> */}
      </div>
    );
  }
}

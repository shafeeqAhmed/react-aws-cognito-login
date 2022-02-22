// @flow
import React, { PureComponent } from "react";
import css from "./agenda.style.css";
import moment from "moment";
import classNames from "classnames";
import Color from "color";
import CurrentTime from "./current-time";

import type { ScheduleDayEvent } from "src/redux/modules/schedule/events";
import type { ReduxProps } from "./";

export default class Agenda extends PureComponent<ReduxProps> {
  interval: IntervalID;
  hours = [
    "1 am",
    "2 am",
    "3 am",
    "4 am",
    "5 am",
    "6 am",
    "7 am",
    "8 am",
    "9 am",
    "10 am",
    "11 am",
    "12 pm",
    "1 pm",
    "2 pm",
    "3 pm",
    "4 pm",
    "5 pm",
    "6 pm",
    "7 pm",
    "8 pm",
    "9 pm",
    "10 pm",
    "11 pm",
    "12 am"
  ];

  getPosition = (time: string) => {
    const hour = moment(time).hour();
    const minutes = moment(time).minutes();

    return hour * 87 + minutes * 87 / 60;
  };

  getEventHeight = (event: Object) => {
    const start = moment(event.calendar_start);
    const end = moment(event.calendar_end);
    const diff = end.diff(start, "hours", true);

    return diff * 87 - 5;
  };

  getBackgroundColor = (event: Object) => {
    const { colors } = this.props;
    if (!event.shooting_event) return "#6a6868";

    // eslint-disable-next-line camelcase
    const { shooting_event } = event;

    const color = colors.find(
      c =>
        c.set_type === shooting_event.set.type &&
        c.set_timeofday === shooting_event.set.time_of_day
    );

    return color ? color.value : "#6a6868";
  };

  getMainLocation = (event: ScheduleDayEvent) =>
    event.locations.find(l => l.location_type === "main");

  renderScheduleDayEvents = () => {
    const { scheduleDayEvents } = this.props;

    if (!scheduleDayEvents) return null;

    let lastLocationId = "";
    return scheduleDayEvents.map(event => {
      let location = {};
      let showLocation = false;
      let title = event.title;
      const description = event.description;
      const hasFromLocation = event.locations.some(
        l => l.location_type === "from"
      );
      const color = this.getBackgroundColor(event);
      let timeOfDay = "";

      const mainLocation = this.getMainLocation(event);

      if (mainLocation) {
        if (mainLocation.location_id !== lastLocationId) {
          location = mainLocation;
          lastLocationId = mainLocation.location_id;
          showLocation = true;
        }
      }
      if (event.shooting_event) {
        if (event.shooting_event.set) {
          timeOfDay = event.shooting_event.set.time_of_day;
        }

        title = event.shooting_event.code;
      }

      return (
        <div
          style={{
            top: this.getPosition(event.calendar_start),
            height: this.getEventHeight(event)
          }}
          role="button"
          onClick={() => this.props.selectDayEvent(event.id)}
          tabIndex="-1"
          className={classNames({
            [css.event]: true,
            [css.withFromLocation]: hasFromLocation,
            [css.isFixed]: event.isFixed
          })}
          key={event.id}
        >
          <div className={css.eventLeftColumn}>
            {showLocation && location.location_name}
          </div>
          <div
            className={classNames({
              [css.eventContent]: true,
              [css.darkText]: Color(color).isLight()
            })}
            style={{
              backgroundColor: color
            }}
          >
            <div className={css.contentLeft}>
              {moment(event.calendar_start).format("hh:mm a")}
            </div>
            <div className={css.contentRight}>
              <div className={css.title}>{title}</div>
              <div className={css.info}>
                {!hasFromLocation && description}
                <br />
                {timeOfDay}
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  render() {
    const { scheduleDay } = this.props;

    if (!scheduleDay) return null;

    let callTime = null;
    let wrapGoal = null;

    if (scheduleDay.schedule_day_events.length > 0) {
      // eslint-disable-next-line camelcase
      const { schedule_day_events } = scheduleDay;
      callTime = schedule_day_events[0].calendar_start;

      wrapGoal =
        schedule_day_events[schedule_day_events.length - 1].calendar_end;
    }

    return (
      <div className={css.agenda}>
        {this.hours.map(hour => (
          <div className={css.hour} key={hour}>
            <span>{hour}</span>
          </div>
        ))}
        {this.renderScheduleDayEvents()}
        {callTime && (
          <div
            className={css.callTimeContainer}
            style={{
              top: this.getPosition(callTime)
            }}
          >
            <span className={css.time}>
              {moment(callTime).format("hh:mm a")}
            </span>
            <span className={css.callTime}>Call Time</span>
          </div>
        )}
        <CurrentTime />
        {wrapGoal && (
          <div
            className={css.wrapGoalContainer}
            style={{
              top: this.getPosition(wrapGoal)
            }}
          >
            <span className={css.time}>
              {moment(wrapGoal).format("hh:mm a")}
            </span>
            <span className={css.wrapGoal}>Wrap Goal</span>
          </div>
        )}
      </div>
    );
  }
}

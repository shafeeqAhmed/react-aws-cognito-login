// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from "react";
import Event from "./event";
import ScheduleDay from "./schedule-day";
import HTML5Backend from "react-dnd-html5-backend";
import css from "./stripboard-list.style.css";
import { type State as ShootingEventsState } from "src/redux/modules/shooting/events";
import { type ScheduleDayEvent } from "src/redux/modules/schedule/events";
import { type State as ScheduleDaysState } from "src/redux/modules/schedule/days";
import { type State as ColorsState } from "src/redux/modules/colors";
import { DragDropContext } from "react-dnd";

type Props = {
  +shootingEvents: $PropertyType<ShootingEventsState, "list">,
  +currentDayEvent: ?ScheduleDayEvent,
  +selectDayEvent: Function,
  +days: $PropertyType<ScheduleDaysState, "list">,
  +productionId: string,
  +colors: $PropertyType<ColorsState, "list">
};

class StripboardList extends Component<Props> {
  render() {
    const {
      shootingEvents,
      currentDayEvent,
      selectDayEvent,
      days,
      productionId,
      colors
    } = this.props;
    return (
      <div className={css.stripboardList}>
        <div className={css.content}>
          <div className={css.shootingEventsContainer}>
            {shootingEvents &&
              shootingEvents.map(e => (
                <Event
                  key={e.id}
                  item={e}
                  currentDayEvent={currentDayEvent}
                  selectDayEvent={selectDayEvent}
                  productionId={productionId}
                  colors={colors}
                />
              ))}
          </div>
          {days &&
            days.map(day => (
              <ScheduleDay
                key={day.id}
                day={day}
                currentDayEvent={currentDayEvent}
                selectDayEvent={selectDayEvent}
                colors={colors}
              />
            ))}
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(StripboardList);

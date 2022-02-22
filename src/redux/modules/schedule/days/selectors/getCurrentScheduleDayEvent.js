// @flow
import { createSelector } from "reselect";
import { type RootReducerState } from "src/redux/modules";
import { type ScheduleDayEvent } from "src/redux/modules/schedule/events";

const getCurrentDayEventId = (state: RootReducerState) =>
  state.schedule.days.currentDayEventId;
const getScheduleDays = (state: RootReducerState) => state.schedule.days.list;

type GetCurrentScheduleDayEvent = RootReducerState => ?ScheduleDayEvent;

const getCurrentScheduleDayEvent: GetCurrentScheduleDayEvent = createSelector(
  [getCurrentDayEventId, getScheduleDays],
  (currentDayEventId, days) => {
    if (!currentDayEventId) return null;

    console.log("ASSDD", currentDayEventId);
    // Get current day
    const day = days.filter(
      d =>
        d.schedule_day_events.filter(event => event.id === currentDayEventId)[0]
    )[0];
    console.log("DAY", days);

    // Return current day-event within that day
    if (day)
      return day.schedule_day_events.filter(
        event => event.id === currentDayEventId
      )[0];

    return null;
  }
);

export default getCurrentScheduleDayEvent;

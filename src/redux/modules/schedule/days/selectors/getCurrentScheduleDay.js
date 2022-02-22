// @flow
import { createSelector } from "reselect";
import { type RootReducerState } from "src/redux/modules";
import { type Day } from "src/redux/modules/schedule/days";

const getCurrentScheduleDayId = (state: RootReducerState) =>
  state.schedule.days.currentDayId;
const getScheduleDays = (state: RootReducerState) => state.schedule.days.list;

type GetCurrentScheduleDay = RootReducerState => ?Day;

const getCurrentScheduleDay: GetCurrentScheduleDay = createSelector(
  [getCurrentScheduleDayId, getScheduleDays],
  (currentScheduleDayId, days) => {
    if (!currentScheduleDayId) return null;

    return days.find(d => d.id === currentScheduleDayId);
  }
);

export default getCurrentScheduleDay;

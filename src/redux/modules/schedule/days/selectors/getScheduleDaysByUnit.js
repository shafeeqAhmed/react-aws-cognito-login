// @flow
import { createSelector } from "reselect";
import { type RootReducerState } from "src/redux/modules";
import { type State as ScheduleDaysState } from "src/redux/modules/schedule/days";

const getCurrentUnitId = (state: RootReducerState) => state.units.currentUnitId;
const getScheduleDays = (state: RootReducerState) => state.schedule.days.list;

type GetScheduleDaysByUnit = RootReducerState => $PropertyType<
  ScheduleDaysState,
  "list"
>;

const getScheduleDaysByUnit: GetScheduleDaysByUnit = createSelector(
  [getCurrentUnitId, getScheduleDays],
  (currentUnitId, days) => {
    if (!currentUnitId) return days;

    return days.filter(d => d.unit_id === currentUnitId);
  }
);

export default getScheduleDaysByUnit;

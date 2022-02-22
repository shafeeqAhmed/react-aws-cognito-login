// @flow
import { combineReducers } from "redux";

/**
 * State definitions.
 */
import type { State as DaysState } from "src/redux/modules/schedule/days";
import type { State as EventsState } from "src/redux/modules/schedule/events";

/**
 * Reducers
 */
import days from "./days";
import events from "./events";

export type ScheduleReducerState = {|
  +days: DaysState,
  +events: EventsState
|};

const scheduleReducer = combineReducers({
  days,
  events
});

export default scheduleReducer;

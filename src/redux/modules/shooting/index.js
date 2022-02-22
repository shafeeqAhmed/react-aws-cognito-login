// @flow
import { combineReducers } from "redux";

/**
 * State definitions.
 */
import type { State as EventsState } from "src/redux/modules/shooting/events";

/**
 * Reducers
 */
import events from "./events";

export type ShootingReducerState = {|
  +events: EventsState
|};

const shootingReducer = combineReducers({
  events
});

export default shootingReducer;

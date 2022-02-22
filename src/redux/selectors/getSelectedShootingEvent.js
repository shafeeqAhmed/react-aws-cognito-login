// @flow
import { createSelector } from "reselect";
import { get } from "lodash";
import type { RootReducerState } from "src/redux/modules";

const getShootingEvents = (state: RootReducerState) =>
  get(state, "screenplay.shootingEvents", []);

const getSelectedShootingEventId = (state: RootReducerState) =>
  get(state, "screenplay.selectedShootingEventId", "");

const getSelectedShootingEvent = createSelector(
  [getShootingEvents, getSelectedShootingEventId],
  (shootingEvents, selectedShootingEventId) =>
    shootingEvents.find(se => se.id === selectedShootingEventId)
);

export default getSelectedShootingEvent;

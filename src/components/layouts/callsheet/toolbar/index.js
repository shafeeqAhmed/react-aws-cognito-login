// @flow
import { connect } from "react-redux";
import Toolbar from "./toolbar";
import areAllScenesLocked from "src/redux/selectors/areAllScenesLocked";
import listUnits from "src/redux/selectors/listUnits";
import getSelectedShootingEvent from "src/redux/selectors/getSelectedShootingEvent";
import { createUnit, deleteUnit } from "src/redux/modules/units";
import {
  splitShootingEvent,
  deleteShootingEvent,
  collapseScenes
  // createShootingEvent
} from "src/redux/modules/screenplay";
import { type Day } from "src/redux/modules/schedule/days";
import type { RootReducerState } from "src/redux/modules";
import type { Unit } from "src/redux/modules/units";
import type { ShootingEvent } from "src/redux/modules/screenplay";
import getCurrentScheduleDay from "src/redux/modules/schedule/days/selectors/getCurrentScheduleDay";

/**
 * StateProps provide a read-only view of the state.
 */
type StateProps = {
  +shootingEvent: ?ShootingEvent,
  +allChangesPublished: boolean,
  +units: Array<Unit>,
  +areScenesCollapsed: boolean,
  +scheduleDay: ?Day,
  +maxShootingDay: number
};

type OwnProps = {
  +publishChanges: () => Promise<any>
};

function mapStateToProps(state: RootReducerState): StateProps {
  return {
    shootingEvent: getSelectedShootingEvent(state),
    allChangesPublished: areAllScenesLocked(state),
    units: listUnits(state),
    areScenesCollapsed: state.screenplay.areScenesCollapsed,
    scheduleDay: getCurrentScheduleDay(state),
    maxShootingDay: state.schedule.days.list.length
  };
}

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  +createUnit: Function,
  +deleteUnit: Function,
  +splitShootingEvent: Function,
  +deleteShootingEvent: Function,
  +collapseScenes: Function
  // +createShootingEvent: Function
};

const mapDispatchToProps: DispatchProps = {
  createUnit,
  deleteUnit,
  splitShootingEvent,
  deleteShootingEvent,
  collapseScenes
  // createShootingEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
export type Props = OwnProps & StateProps & DispatchProps;
// @flow
import { connect } from "react-redux";
import Toolbar from "./toolbar";
import listUnits from "src/redux/selectors/listUnits";
import getSelectedShootingEvent from "src/redux/selectors/getSelectedShootingEvent";
import { createUnit, deleteUnit } from "src/redux/modules/units";
import {
  splitShootingEvent,
  deleteShootingEvent,
  collapseScenes
} from "src/redux/modules/screenplay";
import type { RootReducerState } from "src/redux/modules";
import type { Unit } from "src/redux/modules/units";
import type { ShootingEvent } from "src/redux/modules/screenplay";

type StateProps = {
  +shootingEvent: ?ShootingEvent,
  +units: Array<Unit>,
  +areScenesCollapsed: boolean
};

function mapStateToProps(state: RootReducerState): StateProps {
  return {
    shootingEvent: getSelectedShootingEvent(state),
    units: listUnits(state),
    areScenesCollapsed: state.screenplay.areScenesCollapsed
  };
}

type DispatchProps = {
  +createUnit: typeof createUnit,
  +deleteUnit: typeof deleteUnit,
  +splitShootingEvent: typeof splitShootingEvent,
  +deleteShootingEvent: typeof deleteShootingEvent,
  +collapseScenes: typeof collapseScenes
};

const mapDispatchToProps: DispatchProps = {
  createUnit,
  deleteUnit,
  splitShootingEvent,
  deleteShootingEvent,
  collapseScenes
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
export type Props = StateProps & DispatchProps;

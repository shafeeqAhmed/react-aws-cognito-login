// @flow
import { connect } from "react-redux";
import { get } from "lodash";
import listUnits from "src/redux/selectors/listUnits";
import getSelectedUnit from "src/redux/selectors/getSelectedUnit";
import { createUnit, deleteUnit, selectUnit } from "src/redux/modules/units";
import type { RootReducerState } from "src/redux/modules";
import type { Unit } from "src/redux/modules/units";
import UnitMenu from "./units";

/**
 * StateProps provide a read-only view of the state.
 */
type StateProps = {
  +units: Array<Unit>,
  +selectedUnit: ?Unit,
  +productionId: ?string
};

type OwnProps = {};

function mapStateToProps(
  state: RootReducerState,
  ownProps: OwnProps
): StateProps {
  return {
    units: listUnits(state),
    selectedUnit: getSelectedUnit(state),
    productionId: get(state, "productions.activeProductionID"),
    ...ownProps
  };
}

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  +createUnit: Function,
  +deleteUnit: Function,
  +selectUnit: Function
};

const mapDispatchToProps: DispatchProps = {
  createUnit,
  deleteUnit,
  selectUnit
};

export default connect(mapStateToProps, mapDispatchToProps)(UnitMenu);
export type Props = OwnProps & StateProps & DispatchProps;

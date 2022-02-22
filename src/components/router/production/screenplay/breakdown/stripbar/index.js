// @flow
import { connect } from "react-redux";
import Component from "./stripbar";
import {
  type ShootingEvent,
  getSelectedShootingEvent
} from "src/redux/modules/screenplay";

/**
 * StateProps provide a read-only view of the state.
 */

type StateProps = {|
  +shootingEvent: ?ShootingEvent
|};

type OwnProps = {};

function mapStateToProps(
  state: RootReducerState,
  ownProps: OwnProps
): StateProps {
  return {
    shootingEvent: getSelectedShootingEvent(state),
    ...ownProps
  };
}

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {};

const mapDispatchToProps: DispatchProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
export type Props = OwnProps & StateProps & DispatchProps;

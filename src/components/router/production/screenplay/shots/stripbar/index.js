// @flow
import { connect } from "react-redux";
import Component from "./stripbar";
import {
  type ShootingEvent,
  getSelectedShootingEvent
} from "src/redux/modules/screenplay";

type StateProps = {|
  +shootingEvent: ?ShootingEvent
|};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  shootingEvent: getSelectedShootingEvent(state)
});

export default connect(mapStateToProps)(Component);
export type Props = StateProps;

// @flow
import { connect } from "react-redux";
import Component from "./shotlist";
import type { Shot, Setup } from "src/redux/modules/shots";
import type { RootReducerState } from "src/redux/modules";

type StateProps = {
  +shots: Array<Shot>,
  +setups: Array<Setup>
};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  shots: state.shots.list,
  setups: state.shots.setups
});

export default connect(mapStateToProps)(Component);
export type ReduxProps = StateProps;

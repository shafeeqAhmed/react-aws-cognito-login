// @flow
import { connect } from "react-redux";
import Component from "./right-sidebar";
import type { RootReducerState } from "src/redux/modules";
import { type UserProfile, getCurrentUser } from "src/redux/modules/users";

type StateProps = {
  +user: ?UserProfile
};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  user: getCurrentUser(state)
});

export default connect(mapStateToProps)(Component);
export type ReduxProps = StateProps;

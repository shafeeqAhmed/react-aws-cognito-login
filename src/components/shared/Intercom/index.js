// @flow
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Component from "./Intercom";
import { getCurrentUser, type UserProfile } from "src/redux/modules/users";

type OwnProps = {|
  +location: Location
|};

type StateProps = {|
  +user: ?UserProfile
|};

const mapStateToProps = (state: RootReducerState): StateProps => {
  const user = getCurrentUser(state);

  return {
    user
  };
};

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {};

const mapDispatchToProps: DispatchProps = {};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Component)
);

export type Props = OwnProps & StateProps & DispatchProps;

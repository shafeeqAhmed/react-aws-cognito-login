// @flow
import { connect } from "react-redux";
import { getCurrentUser, type UserProfile } from "src/redux/modules/users";
import Component from "./UserAvatar";

type StateProps = {|
  +user: ?UserProfile
|};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  user: getCurrentUser(state)
});

export default connect(mapStateToProps, {})(Component);

export type Props = {|
  ...StateProps
|};

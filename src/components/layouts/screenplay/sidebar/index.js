// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter, type ContextRouter } from "react-router";
import { logout } from "src/redux/modules/auth";
import type { UserProfile } from "src/redux/modules/users";
import Sidebar from "./sidebar";
import getCurrentUser from "src/redux/selectors/getCurrentUser";

type OwnProps = {|
  ...ContextRouter
|};

type StateProps = {|
  +currentUser: ?UserProfile,
  +newMessagesWidget: number
|};

function mapStateToProps(state: RootReducerState): StateProps {
  const currentUser = getCurrentUser(state);
  return {
    currentUser,
    newMessagesWidget: state.ui.newMessagesWidget
  };
}

type DispatchProps = {|
  logout: typeof logout
|};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators({ logout }, dispatch);

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Sidebar)
);
export type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|};

// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { goTo, closeSidebar } from "src/redux/modules/ui";
import getCurrentProduction from "src/redux/selectors/getCurrentProduction";
import Home from "./home";
import getCurrentUser from "src/redux/selectors/getCurrentUser";
import type { UserProfile } from "src/redux/modules/users";

type StateProps = {
  currentUser: ?UserProfile
};

const mapStateToProps = (state: RootReducerState): StateProps => {
  const currentUser = getCurrentUser(state);
  return {
    production: getCurrentProduction(state),
    currentUser
  };
};

type DispatchProps = {
  goTo: Function,
  closeSidebar: Function
};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      goTo,
      closeSidebar
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Home);
export type ReduxProps = StateProps & DispatchProps;

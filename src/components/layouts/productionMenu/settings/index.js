// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import getCurrentProduction from "src/redux/selectors/getCurrentProduction";
import { goTo, closeSidebar } from "src/redux/modules/ui";
import {
  leaveProduction,
  deleteProduction
} from "src/redux/modules/productions";
import type { Production } from "src/redux/modules/productions";
import Settings from "./settings";
import getCurrentUser from "src/redux/selectors/getCurrentUser";

type StateProps = {
  currentUser: ?Object,
  +production: ?Production,
  currentUserId: string
};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  currentUser: getCurrentUser(state),
  production: getCurrentProduction(state),
  currentUserId: state.users.currentUserId
});

type DispatchProps = {
  goTo: Function,
  leaveProduction: Function,
  deleteProduction: Function,
  closeSidebar: Function
};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      goTo,
      leaveProduction,
      deleteProduction,
      closeSidebar
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
export type ReduxProps = StateProps & DispatchProps;

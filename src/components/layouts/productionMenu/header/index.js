// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { logout } from "src/redux/modules/auth";
import { goTo, closeSidebar } from "src/redux/modules/ui";
import getCurrentProduction from "src/redux/selectors/getCurrentProduction";
import Header from "./header";
import type { Production } from "src/redux/modules/productions";

type StateProps = {
  +production: ?Production,
  productionMenuRoute: string
};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  production: getCurrentProduction(state),
  productionMenuRoute: state.ui.productionMenuRoute
});

type DispatchProps = {
  logout: Function,
  goTo: Function,
  closeSidebar: Function
};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      logout,
      goTo,
      closeSidebar
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Header);
export type ReduxProps = StateProps & DispatchProps;

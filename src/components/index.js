// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { closeSidebar } from "src/redux/modules/ui";
import App from "./App";

type StateProps = {
  sidebarOpen: boolean
};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  sidebarOpen: state.ui.sidebarOpen
});

type DispatchProps = {
  closeSidebar: Function,
  dispatch: Function
};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators({ closeSidebar, dispatch }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
export type ReduxProps = StateProps & DispatchProps;

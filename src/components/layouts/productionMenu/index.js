// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import ProductionMenu from "./productionMenu";
import { goTo } from "src/redux/modules/ui";
import type { RootReducerState } from "src/redux/modules";

type StateProps = {
  productionMenuRoute: string
};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  productionMenuRoute: state.ui.productionMenuRoute
});

type DispatchProps = {
  goTo: Function
};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      goTo
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProductionMenu)
);
export type ReduxProps = StateProps & DispatchProps;

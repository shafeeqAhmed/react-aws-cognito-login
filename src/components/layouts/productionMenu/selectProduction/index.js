// @flow
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { bindActionCreators } from "redux";
import type { Production } from "src/redux/modules/productions";
import { selectProduction } from "src/redux/modules/productions";
import SelectProduction from "./selectProduction";

type StateProps = {
  productions: Array<Production>,
  activeProductionID: number
};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  productions: state.productions.productions,
  activeProductionID: state.productions.activeProductionID
});

type DispatchProps = {
  selectProduction: Function
};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      selectProduction
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SelectProduction)
);
export type ReduxProps = StateProps & DispatchProps;

// @flow
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { bindActionCreators } from "redux";
import { changeCognitoState } from "src/redux/modules/auth";
import Success from "./Success";

type StateProps = {};

const mapStateToProps = (state: RootReducerState): StateProps => ({});

type DispatchProps = {
  changeCognitoState: Function
};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      changeCognitoState
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Success)
);
export type ReduxProps = StateProps & DispatchProps;

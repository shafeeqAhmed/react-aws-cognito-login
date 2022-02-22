// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  login,
  logout,
  step,
  CognitoUser,
  verifySession
} from "src/redux/modules/auth";
import { fetchProductions } from "src/redux/modules/productions";
import Router from "./router";
import type { Route } from "src/helpers/router/route";
import type { CognitoState } from "src/redux/modules/auth";
import type { RootReducerState } from "src/redux/modules";
import type { Production } from "src/redux/modules/productions";

type StateProps = {
  +cognitoState: CognitoState,
  +cognitoUser?: CognitoUser,
  +productions: Array<Production>
};

type OwnProps = {
  +route: Route,
  +history: Object,
  +isFetching: boolean,
  +isFetchingProductions: boolean
};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  cognitoState: state.auth.cognitoState,
  cognitoUser: state.auth.cognitoUser,
  isFetching: state.auth.isFetching,
  productions: state.productions.productions,
  isFetchingProductions: state.productions.isFetching
});

type DispatchProps = {
  login: Function,
  logout: Function,
  step: Function,
  verifySession: Function,
  fetchProductions: Function
};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      login,
      logout,
      step,
      verifySession,
      fetchProductions
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Router);
export type ReduxProps = OwnProps & StateProps & DispatchProps;

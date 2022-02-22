// @flow
import { connect } from "react-redux";
import { withRouter } from "react-router";
import type { RootReducerState } from "src/redux/modules";
import type { CognitoState } from "src/redux/modules/auth";
import IfAuthenticated from "./IfAuthenticated";

type StateProps = {
  cognitoState?: CognitoState
};

const mapStateToProps = ({
  auth: { cognitoState }
}: RootReducerState): StateProps => ({ cognitoState });

export default withRouter(connect(mapStateToProps)(IfAuthenticated));
export type ReduxProps = StateProps;

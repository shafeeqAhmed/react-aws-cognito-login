// @flow
import { connect } from "react-redux";
import { get } from "lodash";
import { withRouter } from "react-router";
import { bindActionCreators } from "redux";
import {
  registerUser,
  acceptTOS,
  type RegisterUserInput
} from "src/redux/modules/auth";
import type { RootReducerState } from "src/redux/modules";
import Component from "./tos";

type StateProps = {
  registrationData: ?RegisterUserInput,
  jwt: string
};

type RouterProps = {
  +history: Object
};

const mapStateToProps = (
  state: RootReducerState,
  props: RouterProps
): StateProps => ({
  ...props,
  registrationData: get(state, "auth.registrationData"),
  jwt: get(state, "auth.signupJWT", "")
});

type DispatchProps = {
  acceptTOS: typeof acceptTOS,
  registerUser: typeof registerUser
};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      acceptTOS,
      registerUser
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Component)
);
export type Props = StateProps & RouterProps & DispatchProps;

// @flow
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { get, isEmpty } from "lodash";
import { withRouter, type ContextRouter } from "react-router";
import { bindActionCreators } from "redux";
import { Auth } from "aws-amplify";
import {
  loginFeching,
  loginError,
  changeCognitoState,
  setTemporaryUser
} from "src/redux/modules/auth";
import { setAuthToken } from "src/helpers/auth";
import { fetchUser } from "src/redux/modules/users";
import { fetchProductions } from "src/redux/modules/productions";
import SignIn from "./SignIn";
import type { RootReducerState } from "src/redux/modules";

type OwnProps = {|
  ...ContextRouter
|};

const validate = values => {
  const errors = {};
  const requiredFields = ["username", "password"];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });
  return errors;
};

const onSubmit = async (values, dispatch, props) => {
  const { username, password } = values;
  let cognitoUser;

  try {
    dispatch(loginFeching());
    cognitoUser = await Auth.signIn(username, password);
  } catch (e) {
    dispatch(loginError(e));
    return;
  }

  if (cognitoUser && cognitoUser.challengeName === "NEW_PASSWORD_REQUIRED") {
    dispatch(setTemporaryUser(cognitoUser));
    props.history.push("/set-password");
    return;
  }

  try {
    await dispatch(fetchUser());
    setAuthToken();
    const { action } = await dispatch(fetchProductions());

    if (isEmpty(action.payload.data.items)) {
      props.history.push("/invitations");
      return;
    }

    const pId = action.payload.data.items[0].id;
    props.history.push(`/${pId}/drive`);
  } catch (e) {
    props.history.push("/invitations");
  }
};

const reduxFormConfig = {
  form: "signInForm",
  validate,
  onSubmit
};

type StateProps = {|
  isFetching: boolean,
  messageError: string
|};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  isFetching: state.auth.isFetching,
  messageError: get(state, "auth.messageError")
});

type DispatchProps = {|
  changeCognitoState: Function,
  loginError: Function
|};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      changeCognitoState,
      loginError
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    reduxForm(reduxFormConfig)(SignIn)
  )
);

export type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|};

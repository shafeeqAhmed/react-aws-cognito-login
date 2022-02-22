// @flow
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { isEmpty } from "lodash";
import { withRouter } from "react-router";
import { bindActionCreators } from "redux";
import { Auth } from "aws-amplify";
import { loginError } from "src/redux/modules/auth";
import Username from "./Username";
import type { RouterHistory } from "react-router";

const validate = values => {
  const errors = {};

  if (!values.email) {
    errors.email = "Required";
  }

  return {
    ...errors,
    _error: isEmpty(errors) ? undefined : errors
  };
};

const onSubmit = (values, dispatch, props) => {
  const { email } = values;

  return Auth.forgotPassword(email)
    .then(data => props.history.push("/reset-password/new-password"))
    .catch(err => dispatch(loginError(err)));
};

const reduxFormConfig = {
  form: "resetPasswordUser",
  validate,
  onSubmit
};

type StateProps = {
  messageError: string
};

type FormProps = {
  +valid: boolean,
  +pristine: boolean,
  +handleSubmit: Function,
  +submitting: boolean,
  +asyncValidating: boolean
};

type RouterProps = {
  +location: Location,
  +history: RouterHistory
};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  messageError: state.auth.messageError
});

type DispatchProps = {
  loginError: Function
};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      loginError
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    reduxForm(reduxFormConfig)(Username)
  )
);
export type ReduxProps = StateProps & RouterProps & FormProps & DispatchProps;

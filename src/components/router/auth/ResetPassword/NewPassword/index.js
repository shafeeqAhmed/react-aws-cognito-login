// @flow
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router";
import { bindActionCreators } from "redux";
import { Auth } from "aws-amplify";
import { loginError, changeCognitoState } from "src/redux/modules/auth";
import NewPassword from "./NewPassword";
import type { RouterHistory } from "react-router";

const validate = values => {
  const errors = {};
  const requiredFields = ["email", "code", "password1", "password2"];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = "Required";
    }

    if (values.password1 !== values.password2) {
      errors.password2 =
        "The password and the password confirmation must be the same.";
    }
  });
  return errors;
};

const onSubmit = (values, dispatch, props) => {
  const { email, code, password1 } = values;

  return Auth.forgotPasswordSubmit(email, code, password1)
    .then(data => props.history.push("/reset-password/success"))
    .catch(err => {
      dispatch(loginError(err));
    });
};

const reduxFormConfig = {
  form: "newPasswordForm",
  validate,
  onSubmit
};

type StateProps = {
  messageError: string
};

type FormProps = {
  +handleSubmit: Function,
  +submitting: boolean,
  +asyncValidating: boolean,
  +valid: boolean,
  +pristine: boolean
};

type RouterProps = {
  +history: RouterHistory,
  +location: Location
};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  messageError: state.auth.messageError
});

type DispatchProps = {
  changeCognitoState: Function,
  loginError: Function
};

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
    reduxForm(reduxFormConfig)(NewPassword)
  )
);
export type ReduxProps = StateProps & FormProps & RouterProps & DispatchProps;

// @flow
import { connect } from "react-redux";
import { reduxForm, formValueSelector } from "redux-form";
import { isEmpty } from "lodash";
import { withRouter } from "react-router";
import { bindActionCreators } from "redux";
import qs from "qs";
import {
  getSignUpAvatar,
  registerUser,
  saveUserRegistration,
  loginError
} from "src/redux/modules/auth";
import type { RootReducerState } from "src/redux/modules";

import SignUp from "./signup";

const validate = values => {
  const errors = {};
  const requiredFields = ["email", "firstName", "lastName"];

  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });

  return {
    ...errors,
    _error: isEmpty(errors) ? undefined : errors
  };
};

const onSubmit = async (values, dispatch, props) => {
  const { prefineryCode, email, invitationCode } = qs.parse(
    props.location.search,
    {
      decoder: s => s,
      ignoreQueryPrefix: true
    }
  );

  const signupData = {
    ...values,
    prefineryInvitation: prefineryCode
      ? {
          code: prefineryCode,
          email
        }
      : null,
    procliqInvitationCode: invitationCode || null
  };

  try {
    await dispatch(saveUserRegistration(signupData));
    props.history.push("/tos");
  } catch (err) {
    dispatch(loginError(err));
  }
};

const reduxFormConfig = {
  form: "signUpForm",
  validate,
  onSubmit,
  destroyOnUnmount: false
};

type StateProps = {
  +isFetching: boolean,
  +messageError: string,
  +signUpAvatar?: ArrayBuffer,
  +email?: string
};

type RouterProps = {
  +history: Object
};

type FormProps = {
  +valid: boolean,
  +pristine: boolean,
  +handleSubmit: Function,
  +change: Function
};

const mapStateToProps = (
  state: RootReducerState,
  props: FormProps & RouterProps
): StateProps => {
  const selector = formValueSelector("signUpForm");
  return {
    ...props,
    isFetching: state.auth.isFetching,
    messageError: state.auth.messageError,
    signUpAvatar: state.auth.signUpAvatar,
    email: selector(state, "email")
  };
};

type DispatchProps = {
  getSignUpAvatar: typeof getSignUpAvatar,
  registerUser: typeof registerUser,
  saveUserRegistration: typeof saveUserRegistration
};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      getSignUpAvatar,
      registerUser,
      saveUserRegistration
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    reduxForm(reduxFormConfig)(SignUp)
  )
);
export type ReduxProps = StateProps & FormProps & RouterProps & DispatchProps;

// @flow
import { connect } from "react-redux";
import { getFormValues } from "redux-form";
import CheckEmail from "./checkEmail";
import type { RootReducerState } from "src/redux/modules";

type StateProps = {
  +email: string
};

const mapStateToProps = (state: RootReducerState): StateProps => {
  const signUpForm = getFormValues("signUpForm")(state);
  const email = signUpForm ? signUpForm.email : "";
  return {
    email
  };
};

export default connect(mapStateToProps)(CheckEmail);
export type ReduxProps = StateProps;

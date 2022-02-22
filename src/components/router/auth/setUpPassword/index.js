// @flow
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { get, isEmpty } from "lodash";
import { withRouter, type ContextRouter } from "react-router";
import { bindActionCreators } from "redux";
import queryString from "query-string";
import {
  logout,
  loginFeching,
  loginError,
  setTemporaryUser
} from "src/redux/modules/auth";
import { showError } from "src/redux/modules/ui";
import { fetchUser } from "src/redux/modules/users";
import {
  fetchProductions,
  type State as ProductionsState
} from "src/redux/modules/productions";
import { Auth } from "aws-amplify";
import type { CognitoTemporaryUser } from "src/redux/modules/auth";
import SetUpPassword from "./setUpPassword";

const validate = values => {
  const errors = {};
  const requiredFields = ["password", "confirmPassword"];

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "The password did not match.";
  }

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
  const { username, password: oldPassword } = queryString.parse(
    props.location.search
  );
  const { password: newPassword } = values;

  // where is this set?
  const { temporaryUser } = props;

  dispatch(loginFeching());

  if (temporaryUser) {
    try {
      await Auth.completeNewPassword(temporaryUser, newPassword);

      await Auth.signIn(username, newPassword);
      await dispatch(fetchUser());
      const res = await dispatch(fetchProductions());

      const productions = get(res, "action.payload.data.items", []);

      if (isEmpty(productions)) {
        props.history.push("/invitations");
      } else {
        props.history.push(`/${productions[0].id}/drive`);
      }
    } catch (e) {
      dispatch(loginError(e));
    }
  } else {
    let res;

    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(user, oldPassword, newPassword);
      dispatch(fetchUser());
      res = await dispatch(fetchProductions());
    } catch (e) {
      dispatch(loginError(e));
    }

    try {
      if (res && isEmpty(res.action.payload.data.items)) {
        props.history.push("/invitations");
      } else if (res) {
        const pId = res.action.payload.data.items[0].id;
        props.history.push(`/${pId}/drive`);
      }
    } catch (e) {
      props.history.push("/invitations");
    }
  }
};

const reduxFormConfig = {
  form: "setUpPasswordForm",
  validate,
  onSubmit
};

type OwnProps = {|
  ...ContextRouter
|};

type StateProps = {|
  +isFetching: boolean,
  +messageError: string,
  +productions: $PropertyType<ProductionsState, "productions">,
  +temporaryUser?: CognitoTemporaryUser
|};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  isFetching: state.auth.isFetching,
  messageError: state.auth.messageError,
  productions: state.productions.productions,
  temporaryUser: state.auth.temporaryUser
});

type DispatchProps = {|
  logout: typeof logout,
  loginError: typeof loginError,
  showError: typeof showError,
  setTemporaryUser: typeof setTemporaryUser
|};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      logout,
      loginError,
      showError,
      setTemporaryUser
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    reduxForm(reduxFormConfig)(SetUpPassword)
  )
);
export type ReduxProps = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|};

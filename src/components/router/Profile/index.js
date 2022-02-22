// @flow
import { connect } from "react-redux";
import { reduxForm, change, formValueSelector } from "redux-form";
import { bindActionCreators } from "redux";
import {
  fetchUser,
  saveUserInfo,
  saveUserDetails,
  fetchUserRoles,
  fetchUserTags,
  saveUserAvatar,
  fetchCurrentUser
} from "src/redux/modules/users";
import { mapStateToApi } from "src/helpers/mapUserDetails";
import Profile from "./Profile";
import getCurrentUser from "src/redux/selectors/getCurrentUser";
import type { UserTags, UserProfile } from "src/redux/modules/users";

type StateProps = {
  user: ?UserProfile,
  isSaving: boolean,
  userName: string,
  creditName: string,
  userTags: ?UserTags,
  userRoles: Array<Object>,
  initialValues: UserProfile
};

function mapStateToProps(
  state: RootReducerState,
  ownProps: Object
): StateProps {
  const { users } = state;
  const selectedUser = getCurrentUser(state);
  const selector = formValueSelector("profileData");

  let userTags = { items: [], nextOffset: 0 };
  let userRoles = [];
  if (selectedUser) {
    userTags = selectedUser.tags || { items: [], nextOffset: 0 };
    userRoles = selectedUser.roles || [];
  }

  return {
    user: selectedUser,
    isSaving: users.isSaving,
    userName: selector(state, "name"),
    creditName: selector(state, "creditName"),
    userTags,
    userRoles,
    initialValues: {
      ...selectedUser
    }
  };
}

type DispatchProps = {
  getUserInfo: Function,
  saveUserInfo: Function,
  changeFieldValue: Function,
  fetchUserRoles: Function,
  fetchUserTags: Function,
  saveUserAvatar: Function,
  fetchCurrentUser: Function
};

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
  getUserInfo: bindActionCreators(fetchUser, dispatch),
  saveUserInfo: bindActionCreators(saveUserInfo, dispatch),
  fetchUserRoles: bindActionCreators(fetchUserRoles, dispatch),
  fetchUserTags: bindActionCreators(fetchUserTags, dispatch),
  changeFieldValue: (field: string, value: any) => {
    dispatch(change("profileData", field, value));
  },
  saveUserAvatar: bindActionCreators(saveUserAvatar, dispatch),
  fetchCurrentUser: bindActionCreators(fetchCurrentUser, dispatch)
});

const validate = values => {
  const errors = {};
  const requiredFields = ["name", "mention", "email"];

  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });

  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (
    values.primaryTelephone &&
    !/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(
      values.primaryTelephone
    )
  ) {
    errors.primaryTelephone = "Invalid phone format";
  }

  const additionalTelephoneErrors = [];
  if (values.additionalTelephone) {
    values.additionalTelephone.forEach((additional, additionalIndex) => {
      let additionalErrors;
      if (
        additional &&
        !/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(additional)
      ) {
        additionalErrors = "Invalid phone format";
        additionalTelephoneErrors[additionalIndex] = additionalErrors;
      }

      return additionalErrors;
    });
  }
  if (additionalTelephoneErrors.length) {
    errors.additionalTelephone = additionalTelephoneErrors;
  }

  return errors;
};

const onSubmit = (values, dispatch, props) => {
  const userId = "me";
  const info = {
    name: values.name,
    creditName: values.creditName,
    mention: values.mention,
    email: values.email
  };
  const details = mapStateToApi(values);

  saveUserInfo(userId, info)(dispatch);
  return saveUserDetails(userId, details)(dispatch).then(() => {
    props.history.goBack();
  });
};

const reduxFormConfig = {
  form: "profileData",
  validate,
  onSubmit,
  enableReinitialize: true
};

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm(reduxFormConfig)(Profile)
);

export type ReduxProps = StateProps & DispatchProps;

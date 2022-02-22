// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getUsers, updatePermission } from "src/redux/modules/users";
import { goTo } from "src/redux/modules/ui";
import getCurrentProduction from "src/redux/selectors/getCurrentProduction";
import ManageAdministrators from "./manageAdministrators";
import getCurrentUser from "src/redux/selectors/getCurrentUser";
import getAdministrators from "src/redux/selectors/getAdministrators";
import type { UsersList, UserProfile } from "src/redux/modules/users";
import type { Production } from "src/redux/modules/productions";

type StateProps = {
  users: UsersList,
  currentUser: ?UserProfile,
  selectedProduction: ?Production
};

function mapStateToProps(
  state: RootReducerState,
  ownProps: Object
): StateProps {
  return {
    users: getAdministrators(state),
    currentUser: getCurrentUser(state),
    selectedProduction: getCurrentProduction(state)
  };
}

type DispatchProps = {
  getUsers: Function,
  dispatch: Function,
  goTo: Function,
  updatePermission: Function
};

function mapDispatchToProps(dispatch: any): DispatchProps {
  return {
    dispatch,
    getUsers: bindActionCreators(getUsers, dispatch),
    goTo: bindActionCreators(goTo, dispatch),
    updatePermission: bindActionCreators(updatePermission, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ManageAdministrators
);
export type ReduxProps = StateProps & DispatchProps;

// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getUsers,
  selectUser,
  // getRoleUsers,
  updatePermission
} from "src/redux/modules/users";
import { goTo } from "src/redux/modules/ui";
import getCurrentProduction from "src/redux/selectors/getCurrentProduction";
import AddNewAdmin from "./addNewAdmin";
import type { State as UsersState } from "src/redux/modules/users";

type StateProps = {
  users: UsersState,
  selectedProduction: ?Object
};

function mapStateToProps(state: RootReducerState): StateProps {
  const { users } = state;

  return {
    users,
    selectedProduction: getCurrentProduction(state)
  };
}

type DispatchProps = {
  getUsers: Function,
  selectUser: Function,
  goTo: Function,
  updatePermission: Function
};

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
  dispatch,
  getUsers: bindActionCreators(getUsers, dispatch),
  selectUser: bindActionCreators(selectUser, dispatch),
  goTo: bindActionCreators(goTo, dispatch),
  updatePermission: bindActionCreators(updatePermission, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AddNewAdmin);
export type ReduxProps = StateProps & DispatchProps;

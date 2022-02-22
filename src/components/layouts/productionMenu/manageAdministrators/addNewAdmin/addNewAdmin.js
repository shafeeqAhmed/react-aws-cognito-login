// @flow
import React, { PureComponent } from "react";
import { debounce, indexOf, remove } from "lodash";
import img from "src/styles/images.css";
import css from "./addNewAdmin.style.css";
import { MANAGE_ADMINISTRATORS } from "../../routes";
import type { ReduxProps } from "./";

type Props = ReduxProps & {
  params: Object
};

type State = {
  canSearch: boolean,
  selectedUsers: Array<string>
};

class AddNewAdmin extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      canSearch: true,
      selectedUsers: []
    };

    this.changed = debounce(this.props.getUsers, 300);
  }

  componentDidMount() {
    const { selectedProduction } = this.props;

    if (selectedProduction) this.props.getUsers(selectedProduction.id);
  }

  changed: Function;
  searchUsers: Function;
  redirect: Function;

  searchUsers = (e: Object) => {
    const text = e.target.value;
    const { selectedProduction } = this.props;

    if (text.length >= 0 && selectedProduction) {
      this.setState({ canSearch: true });

      this.changed(selectedProduction.id, { text });
    } else {
      this.setState({ canSearch: false });
    }
  };

  selectUser = (id: string) => {
    const selectedUsers = [...this.state.selectedUsers];

    if (indexOf(selectedUsers, id) === -1) {
      selectedUsers.push(id);
    } else {
      remove(selectedUsers, el => id === el);
    }
    this.setState({
      selectedUsers
    });
  };

  props: Props;

  addNewAdministrators = () => {
    const { updatePermission, selectedProduction, goTo } = this.props;
    if (selectedProduction)
      updatePermission(
        selectedProduction.id,
        this.state.selectedUsers,
        "ADMIN"
      );

    goTo(MANAGE_ADMINISTRATORS);
  };

  render(): React$Element<any> {
    const { users } = this.props;

    let usersList = () => null;

    if (this.state.canSearch) {
      usersList = () => {
        if (users.isFetching)
          return <div className={css.loading}>Loading Users</div>;

        return Object.keys(users.users).map((item, index) => {
          let avatar = null;

          const user = users.users[item];

          if (user && user.avatar) {
            const backgroundImage = `url(${user.avatar.urls[0]})`;

            avatar = (
              <div className={css.profileImage} style={{ backgroundImage }} />
            );
          } else {
            avatar = (
              <div className={`${img.icnMovieCover} ${css.profileImage}`} />
            );
          }

          const role =
            user.roles && user.roles.length > 0 ? user.roles[0].name : null;

          const isSelected = indexOf(this.state.selectedUsers, user.id) !== -1;

          return (
            <button
              onClick={() => {
                this.selectUser(user.id);
              }}
              className={`${css.user} ${isSelected ? css.userSelected : ""}`}
              key={user.id}
            >
              {avatar}
              <div className={css.userDetails}>
                <div className={css.userName}>
                  {user.firstName}
                  <div className={css.userRole}>{role}</div>
                </div>
                <div className={css.userMention}>@{user.mention}</div>
              </div>
            </button>
          );
        });
      };
    }
    return (
      <div className={css.container}>
        <div className={css.topBar}>
          <button onClick={() => this.props.goTo(MANAGE_ADMINISTRATORS)}>
            <i className={`material-icons ${css.removeAdminIcon}`}>
              chevron_left
            </i>
            <div className={css.topTitle}>Add new administrators</div>
          </button>
          <button onClick={this.addNewAdministrators}>
            <i className={`material-icons ${css.removeAdminIcon}`}>check</i>
          </button>
        </div>
        <div className={css.searchUserBox}>
          <div className={img.searchTab} />
          <input
            type="text"
            placeholder="Search through results below..."
            className={css.inputName}
            onKeyUp={this.searchUsers}
          />
          <div className={img.btnCancelGrey} />
        </div>
        <p className={css.departmentName}>PRINCIPLE PLAYERS</p>
        <div className={css.usersList}>{usersList()}</div>
      </div>
    );
  }
}

export default AddNewAdmin;

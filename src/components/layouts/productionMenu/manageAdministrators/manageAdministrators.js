// @flow
import React, { PureComponent } from "react";
// import LinkReplace from 'src/components/shared/LinkReplace/LinkReplace.index'
import { SETTINGS, ADD_NEW_ADMIN } from "../routes";
import img from "src/styles/images.css";
import css from "./manageAdministrators.style.css";
import type { ReduxProps } from "./";

type Props = ReduxProps & {
  params: Object
};

class ManageAdministrators extends PureComponent<Props> {
  componentDidMount() {
    const { selectedProduction } = this.props;

    if (selectedProduction) {
      this.props.getUsers(selectedProduction.id, {
        permission: "ADMIN"
      });
    }
  }

  removeAdminPermission = (userId: string) => {
    const { updatePermission, selectedProduction } = this.props;

    if (selectedProduction)
      updatePermission(selectedProduction.id, [userId], "USER");
  };

  props: Props;

  render(): React$Element<any> {
    const { users } = this.props;

    const usersList = () => {
      if (users.isFetching)
        return <div className={css.loading}>Loading Administrators</div>;

      return (
        users &&
        Object.keys(users).map((item, index) => {
          let avatar = null;

          const user = users[item];

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

          let role = null;
          if (user.roles && user.roles.length > 0) {
            role = user.roles[0].name;
          }

          return (
            <div className={css.user} key={user.id}>
              {avatar}
              <div className={css.userDetails}>
                <div className={css.userName}>
                  {user.firstName}
                  <div className={css.userRole}>{role}</div>
                </div>
                <div className={css.userMention}>@{user.mention}</div>
              </div>
              <button onClick={() => this.removeAdminPermission(user.id)}>
                <i className={`material-icons ${css.removeAdminIcon}`}>close</i>
              </button>
            </div>
          );
        })
      );
    };

    return (
      <div className={css.container}>
        <div className={css.topBar}>
          <button
            onClick={() => this.props.goTo(SETTINGS)}
            className={css.backButton}
          >
            <i className={`material-icons ${css.closeIcon}`}>chevron_left</i>
            <div className={css.topTitle}>Manage Administrators</div>
          </button>
        </div>
        <div className={css.addNewAdmin}>
          <button
            className={css.addButton}
            onClick={() => this.props.goTo(ADD_NEW_ADMIN)}
          >
            <i className={`material-icons ${css.addIcon}`}>add</i>
            Add New Administrators
          </button>
        </div>
        <div className={css.usersList}>{usersList()}</div>
      </div>
    );
  }
}

export default ManageAdministrators;

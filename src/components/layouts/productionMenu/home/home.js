// @flow
import React, { PureComponent } from "react";
import { IntercomAPI } from "react-intercom";
import { get } from "lodash";
import css from "./home.style.css";
import vars from "config/variables";
import UserAvatar from "react-user-avatar";
import { SETTINGS } from "../routes";
import type { ReduxProps } from "./";
import type { Production } from "src/redux/modules/productions";
import type { RouterHistory } from "react-router";

type Props = ReduxProps & {
  history: RouterHistory,
  production: Production
};

const options = [
  {
    title: "Files",
    icon: "cloud",
    iconColor: vars.colorBlueLight,
    route: "/drive"
  },
  {
    title: "Directory",
    icon: "contacts",
    iconColor: vars.colorDark,
    route: "/directory"
  },
  {
    title: "Settings",
    productionMenuRoute: SETTINGS,
    icon: "settings",
    iconColor: vars.colorDark
  }
];

const footerOptions = [
  // { title: "FAQs", route: "/drive" },
  { title: "Help & Feedback", onClick: () => IntercomAPI("show") }
  // { title: "About ProCliq", route: "/drive" }
];

export default class Home extends PureComponent<Props> {
  handleOptionClick = (option: any) => {
    const { production, closeSidebar } = this.props;

    if (option.productionMenuRoute) {
      this.props.goTo(option.productionMenuRoute);
    } else if (option.route) {
      this.props.history.push(`/${production.id + option.route}`);
      closeSidebar();
    } else if (option.onClick) {
      option.onClick();
      closeSidebar();
    }
  };

  renderOptions = (): any =>
    options.map((option: any) => (
      <button
        className={css.option}
        key={option.title}
        onClick={() => this.handleOptionClick(option)}
      >
        <i
          className={`material-icons ${css.icon}`}
          style={{ color: option.iconColor }}
        >
          {option.icon}
        </i>
        <span className={css.optionName}>{option.title}</span>
      </button>
    ));

  renderFooterOptions = (): any =>
    footerOptions.map((option: any) => (
      <button
        className={css.footerOption}
        key={option.title}
        onClick={() => this.handleOptionClick(option)}
      >
        <span className={css.footerOptionName}>{option.title}</span>
        <i className="material-icons">chevron_right</i>
      </button>
    ));

  renderUserProfile = () => {
    const user = get(this.props, "currentUser", {});
    const avatar = get(user, "avatar.urls", null);
    const avatarURL = avatar ? `url(${avatar[0]})` : null;
    return avatarURL ? (
      <div
        className={css.avatar}
        style={{
          backgroundImage: avatarURL,
          borderColor: user.color
        }}
      />
    ) : (
      <UserAvatar
        borderRadius="15px"
        size="30"
        name={user.name || user.email || user.mention || "AA"}
        color={user.color}
        style={{ color: "#FFF" }}
      />
    );
  };

  render() {
    const { currentUser, production, history, closeSidebar } = this.props;

    return (
      <div className={css.container}>
        <div className={css.options}>{this.renderOptions()}</div>
        <div className={css.footer}>
          <div className={css.divider}>SUPPORT</div>
          <div className={css.footerOptions}>
            {this.renderFooterOptions()}
            <button
              className={css.userOption}
              onClick={() => {
                closeSidebar();
                history.push(`/${production.id}/users/profile`);
              }}
            >
              <div className={css.profile}>
                {this.renderUserProfile()}
                <span className={css.userName}>
                  {currentUser && currentUser.firstName}
                </span>
              </div>
              <i className="material-icons">chevron_right</i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

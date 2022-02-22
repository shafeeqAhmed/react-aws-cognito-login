// @flow
import React, { PureComponent } from "react";
import css from "./settings.style.css";
import vars from "config/variables";
import { MANAGE_ADMINISTRATORS } from "../routes";
import type { ReduxProps } from "./";

type Props = ReduxProps & {
  history: Object
};

const options = [
  {
    title: "Edit Production Details",
    route: "/edit",
    icon: "chevron_right",
    permission: true,
    hideSidebar: true
  },
  {
    title: "Manage Administrators",
    productionMenuRoute: MANAGE_ADMINISTRATORS,
    icon: "chevron_right",
    permission: true
  },
  // {
  //   title: "#Hashblasts",
  //   icon: "chevron_right"
  // },
  {
    title: "Export Chat History",
    icon: "unarchive"
  }
];

// const billingOptions = [
//   { title: "Billing Details & History", icon: "chevron_right" },
//   { title: "Transfer Billing Ownership", icon: "chevron_right" }
// ];

const footerOptions = [
  {
    title: "Leave Production",
    icon: "arrow_right_alt",
    backgroundColor: vars.colorYellow,
    whiteText: false,
    onClick: "leaveProduction"
  },
  {
    title: "Suspend Production",
    icon: "pause",
    backgroundColor: vars.colorOrange,
    whiteText: true,
    permission: true
  },
  {
    title: "Delete Production",
    icon: "clear",
    backgroundColor: vars.colorRed,
    whiteText: true,
    permission: true,
    onClick: "deleteProduction"
  }
];

export default class Settings extends PureComponent<Props> {
  renderOptions = (list: Array<any>): any => {
    const { production, history, closeSidebar, goTo } = this.props;

    if (!production) return null;

    return list.map(
      (option: any) =>
        production.permission === "SUPER_ADMIN" ||
        production.permission === "ADMIN" ||
        !option.permission ? (
          <button
            className={css.option}
            key={option.title}
            onClick={() => {
              if (option.productionMenuRoute) {
                goTo(option.productionMenuRoute);
              } else {
                option.hideSidebar && closeSidebar();
                option.route && history.push(`/${production.id}/edit`);
              }
            }}
          >
            {option.title}
            <i
              className={`material-icons ${css.icon}`}
              style={{ color: option.iconColor }}
            >
              {option.icon}
            </i>
          </button>
        ) : null
    );
  };

  renderFooterOptions = (): any => {
    const { production, currentUserId } = this.props;
    if (!production) return null;

    return footerOptions.map((option: any) => {
      const { backgroundColor, whiteText } = option;
      const style = {};
      style.backgroundColor = backgroundColor;
      style.color = vars.colorDark;
      if (whiteText) {
        style.color = vars.colorWhite;
      }
      const onClick = () =>
        option.onClick &&
        this.props[option.onClick](production.id, currentUserId);

      return production.permission === "SUPER_ADMIN" ||
        production.permission === "ADMIN" ||
        !option.permission ? (
        <button
          className={css.footerOption}
          style={style}
          key={option.title}
          onClick={onClick}
        >
          {option.title}
          <i className="material-icons">{option.icon}</i>
        </button>
      ) : null;
    });
  };

  render() {
    return (
      <div className={css.container}>
        <div className={css.options}>
          <div className={css.divider}>PRODUCTION CONTROLS</div>
          {this.renderOptions(options)}
        </div>
        <div className={css.footer}>
          <div className={css.footerOptions}>{this.renderFooterOptions()}</div>
        </div>
      </div>
    );
  }
}

// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import { get } from "lodash";
import { IntercomAPI } from "react-intercom";
import UserAvatar from "src/components/shared/UserAvatar";
import LogoIcon from "@material-ui/icons/ViewModule";
import BreadcrumbDividerIcon from "@material-ui/icons/ChevronRight";
import Search from "./search";
import imgQuestion from "static/images/question.png";
// import { toggleWidget } from "src/helpers/widget";
import css from "./header.style.css";
import type { Props } from "./";

export default class Header extends PureComponent<Props> {
  toggleProductionMenu = () => {
    const {
      isProductionMenuOpen,
      closeProductionMenu,
      openProductionMenu
    } = this.props;
    if (isProductionMenuOpen) return closeProductionMenu();
    return openProductionMenu();
  };

  onClickHelpAndFeedback = () => {
    IntercomAPI("show");
  };

  render() {
    const { production, currentUser, title } = this.props;
    const productionName = get(production, "name", "");

    return (
      <header className={css.header}>
        <div className={css.iconToolsContainer}>
          <button
            className={css.buttonLogo}
            onClick={this.toggleProductionMenu}
          >
            <LogoIcon className={css.logoIcon} />
          </button>
          <div className={css.headerToolsContainer}>
            <div className={css.iconWithTexContainer}>
              <button className={css.button}>
                <div className={css.textTitle}>{productionName}</div>
                <div className={css.breadcrumbDivider}>
                  <BreadcrumbDividerIcon />
                </div>
                <div className={css.breadcrumbTitle}>{title}</div>
              </button>
            </div>
          </div>
        </div>
        <div className={css.searchContainer}>
          <Search />
        </div>
        <div className={css.headerUsersContainer}>
          <div className={css.headerUsers}>
            <button className={css.button}>
              <UserAvatar user={currentUser} />
            </button>
          </div>
          <div className={css.questionIcon}>
            <button
              className={`${css.button} ${css.helpButtom}`}
              onClick={this.onClickHelpAndFeedback}
            >
              <img alt="" className={css.imgQuestion} src={imgQuestion} />
              <div className={css.textDescriptionSmall}>Help and feedback</div>
            </button>
          </div>
        </div>
      </header>
    );
  }
}

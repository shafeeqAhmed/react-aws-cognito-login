// @flow
import React, { PureComponent } from "react";
import css from "./header.style.css";
import imgLogo from "static/images/logo_procliq.png";
import imgLogout from "static/images/logout.png";
import defaultImage from "static/images/movie_cover.png";
import downArrow from "static/images/sort-down.png";
import type { ReduxProps } from "./";

import { Auth } from "aws-amplify";
import { HOME, SELECT_PRODUCTION } from "../routes";

type Props = ReduxProps & {};

export default class Header extends PureComponent<Props> {
  handleLogout = () => {
    Auth.signOut()
      .then(data => {
        this.props.closeSidebar();
        this.props.logout();
      })
      .catch(err => console.log(err));
  };

  handleProductionClick = () => {
    if (this.props.productionMenuRoute === SELECT_PRODUCTION) {
      return this.props.goTo(HOME);
    }
    return this.props.goTo(SELECT_PRODUCTION);
  };
  handleBackClick = () => {
    this.props.goTo(HOME);
  };

  renderSecondRow = () => {
    const { production, productionMenuRoute } = this.props;
    if (!production) return null;

    if (productionMenuRoute !== HOME) {
      return (
        <button className={css.backButton} onClick={this.handleBackClick}>
          <i className={`material-icons ${css.icon}`}>chevron_left</i>
          {production.name}
        </button>
      );
    }

    const image = production.poster ? (
      <img
        // $FlowFixMe
        src={production.poster && production.poster.urls[0]}
        alt="production"
        onError={e => {
          e.target.src = defaultImage;
        }}
        className={css.poster}
      />
    ) : (
      <div className={css.noPoster} />
    );

    return (
      <button
        className={css.currentProduction}
        onClick={this.handleProductionClick}
      >
        {image}
        <div className={css.info}>
          <span className={css.currentProductionLabel}>Current Production</span>
          <div className={css.productionName}>
            <span className={css.productionNameText}>{production.name}</span>
            <img src={downArrow} alt="down" className={css.downArrow} />
          </div>
        </div>
      </button>
    );
  };

  render() {
    return (
      <div className={css.container}>
        <div className={css.topBar}>
          <img src={imgLogo} alt="Procliq" className={css.logo} />
          <button onClick={() => this.handleLogout()}>
            <img src={imgLogout} alt="logout" className={css.logout} />
          </button>
        </div>
        <div className={css.secondRow}>{this.renderSecondRow()}</div>
      </div>
    );
  }
}

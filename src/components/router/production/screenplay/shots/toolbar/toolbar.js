// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import UnitMenu from "./units";
import Input from "@material-ui/core/Input";
import css from "./toolbar.style.css";
import newSceneIcon from "static/images/new-scene.svg";
import printIcon from "static/images/print.svg";
import fullScreenIcon from "static/images/full-screen.svg";
import expandIcon from "static/images/expand.svg";
import collapseIcon from "static/images/collapse.svg";
import searchIcon from "static/images/searchIcon.png";
import type { Props } from "./";

type State = {};

export default class Toolbar extends PureComponent<Props, State> {
  handleCreate = (e: Event) => {};

  handlePrint = (e: Event) => {};

  render() {
    return (
      <div className={css.toolbar}>
        <div className={css.iconToolsContainer}>
          <div className={css.iconToolsLeftContainer}>
            <div className={css.iconWithTextContainer}>
              <UnitMenu />
            </div>
            <button className={css.buttonToolbar} onClick={this.handleCreate}>
              <img
                src={newSceneIcon}
                className={css.imgTools}
                alt={"new scene"}
              />
            </button>
            <button className={css.buttonToolbar}>
              <img src={printIcon} className={css.imgTools} alt={"print"} />
            </button>
            <button className={css.buttonToolbar}>
              <img
                src={fullScreenIcon}
                className={css.imgTools}
                alt={"full screen"}
              />
            </button>
            <button className={css.buttonToolbar}>
              <img src={expandIcon} className={css.imgTools} alt={"expand"} />
            </button>
            <button className={css.buttonToolbar}>
              <img
                src={collapseIcon}
                className={css.imgTools}
                alt={"collapse"}
              />
            </button>
          </div>
        </div>

        <div className={css.iconToolsRigthContainer}>
          <div className={css.inputContainer}>
            <Input
              fullWidth
              disableUnderline
              placeholder="Search Script"
              className={css.searchInput}
            />
            <img src={searchIcon} alt={"search"} className={css.searchIcon} />
          </div>
        </div>
      </div>
    );
  }
}

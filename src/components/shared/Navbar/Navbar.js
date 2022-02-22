/* eslint-disable import/no-extraneous-dependencies */
// @flow
import React, { PureComponent } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import ChevronDownIcon from "@material-ui/icons/ChevronRight";
import CurrentUserAvatar from "src/components/shared/CurrentUserAvatar";
import type { Props } from "./";
import css from "./Navbar.styles.css";

import logo from "static/images/logo.png";

export default class NavBar extends PureComponent<Props> {
  render() {
    return (
      <AppBar elevation={0} square classes={{ root: css.appbar }}>
        <Toolbar disableGutters>
          <div className={css.logo}>
            <IconButton
              classes={{
                root: css.menuButton,
                label: css.menuButtonLabel
              }}
              color="inherit"
              aria-label="Menu"
            >
              <img alt="" className={css.logoImage} src={logo} />
            </IconButton>
          </div>

          <Button
            variant="text"
            classes={{
              root: css.toolbarButtonRoot,
              label:
                this.props.active === "drive"
                  ? css.toolbarButtonLabelActive
                  : css.toolbarButtonLabel
            }}
          >
            Files
          </Button>

          <Button
            variant="text"
            classes={{
              root: css.toolbarButtonRoot,
              label:
                this.props.active === "directory"
                  ? css.toolbarButtonLabelActive
                  : css.toolbarButtonLabel
            }}
          >
            Directory
          </Button>
          <div className={css.grow} />
          <CurrentUserAvatar />
          <IconButton
            classes={{
              root: css.userMenuButton
            }}
          >
            <ChevronDownIcon
              classes={{
                root: css.userMenuIcon
              }}
            />
          </IconButton>
        </Toolbar>
        {/* <div className={css.content}>
          <div className={css.leftSide}>
            <div className={css.logoContainer}> */}
        {/* <button
                className={css.buttonLogo}
                onClick={() =>
                  console.log(
                    'TODO: go to https://marvelapp.com/59be8g8/screen/54836428',
                  )
                }
              >
                <img alt="" className={css.logoImage} src={logo} />
              </button> */}
        {/* </div>
          </div>
          <div className={css.rightSide} />
        </div> */}
      </AppBar>
    );
  }
}

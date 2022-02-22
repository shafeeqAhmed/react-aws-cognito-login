// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent, Fragment } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import withStyles from "@material-ui/core/styles/withStyles";
import classNames from "classnames";
import type { Item } from "./";

type Props = Item & {
  classes: { subMenuItem: string },
  key?: string
};

type State = {
  open: boolean,
  anchorEl: ?HTMLElement
};

const styles = {
  subMenuItem: {
    display: "flex",
    justifyContent: "space-between"
  }
};

class SubMenuItem extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      open: false,
      anchorEl: null
    };
  }

  onClick = (e: SyntheticMouseEvent<HTMLElement>) => {
    const target = ((e.target: any): HTMLElement);

    if (!this.state.anchorEl) {
      this.setState(() => ({
        anchorEl: target
      }));
    }

    this.setState(() => ({
      open: !this.state.open
    }));
  };

  onClose = () => {
    this.setState(() => ({
      open: false
    }));
  };

  render() {
    const { caption, menuItems, classes, key } = this.props;
    const { open, anchorEl } = this.state;

    return (
      <Fragment>
        <MenuItem
          key={key}
          onClick={this.onClick}
          className={classNames(classes.subMenuItem)}
        >
          {caption}
          <ArrowRightIcon />
        </MenuItem>
        <Menu
          key={`${key}_menu`}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left"
          }}
          open={open}
          anchorEl={anchorEl}
          onClose={this.onClose}
        >
          {menuItems &&
            menuItems.map(i => (
              <MenuItem
                key={i.key}
                onClick={i.onClick}
                className={classNames(classes.subMenuItem)}
              >
                {i.caption}
              </MenuItem>
            ))}
        </Menu>
      </Fragment>
    );
  }
}

export default withStyles(styles)(SubMenuItem);

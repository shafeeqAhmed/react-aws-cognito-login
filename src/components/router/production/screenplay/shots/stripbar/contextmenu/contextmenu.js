// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { type Node, PureComponent } from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
// import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import elypsisIcon from "static/images/elypsis-white.svg";
import css from "./contextmenu.style.css";

type Props = {};

type State = {
  menuEl: Node,
  submenuOpen: string
};

export default class ContextMenu extends PureComponent<Props, State> {
  state: State;
  mergeWithEl: Node;
  changeUnitEl: Node;
  rescheduleEl: Node;

  state = {
    menuEl: null,
    submenuOpen: ""
  };

  handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({
      menuEl: event.currentTarget
    });
  };

  handleClose = () => {
    this.setState({ menuEl: null });
  };

  handleOpenSubmenu = (menu: string) => {
    this.setState(state => ({
      submenuOpen: state.submenuOpen === menu ? "" : menu
    }));
  };

  handleCloseSubmenu = (event: Event) => {
    if (
      this.mergeWithEl.contains(event.target) ||
      this.changeUnitEl.contains(event.target) ||
      this.rescheduleEl.contains(event.target)
    ) {
      return;
    }
    this.setState({ submenuOpen: "" });
  };

  render() {
    const { menuEl, submenuOpen } = this.state;

    return (
      <div>
        <Button
          aria-owns={menuEl ? "menu" : null}
          aria-haspopup="true"
          onClick={this.handleClick}
          disableFocusRipple
          disableRipple
          classes={{
            root: css.menuButton
          }}
        >
          <img src={elypsisIcon} alt="elypsis" />
        </Button>
        <Menu
          id="menu"
          anchorEl={menuEl}
          open={Boolean(menuEl)}
          onClose={this.handleClose}
          classes={{
            paper: css.menu
          }}
        >
          <MenuItem
            onClick={this.handleClose}
            classes={{
              root: css.menuItem,
              selected: css.menuItemSelected
            }}
          >
            Mark as Done
          </MenuItem>
          <MenuItem
            onClick={() => this.handleOpenSubmenu("mergeWith")}
            buttonRef={node => {
              this.mergeWithEl = node;
            }}
            aria-owns={submenuOpen === "mergeWith" ? "menu-merge-with" : null}
            aria-haspopup="true"
            selected={submenuOpen === "mergeWith"}
            classes={{
              root: css.menuItem,
              selected: css.menuItemSelected
            }}
          >
            Merge with…
          </MenuItem>
          <Popper
            style={{ zIndex: 10 }}
            open={submenuOpen === "mergeWith"}
            anchorEl={this.mergeWithEl}
            transition
            placement={"left-start"}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-merge-with"
                style={{ transformOrigin: placement }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleCloseSubmenu}>
                    <div>SEARCH SCENES</div>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          <MenuItem
            onClick={this.handleClose}
            classes={{
              root: css.menuItem,
              selected: css.menuItemSelected
            }}
          >
            Unmerge
          </MenuItem>
          <MenuItem
            onClick={this.handleClose}
            classes={{
              root: css.menuItem,
              selected: css.menuItemSelected
            }}
          >
            Add Instance
          </MenuItem>
          <MenuItem
            onClick={() => this.handleOpenSubmenu("changeUnit")}
            buttonRef={node => {
              this.changeUnitEl = node;
            }}
            aria-owns={submenuOpen === "changeUnit" ? "menu-change-unit" : null}
            aria-haspopup="true"
            selected={submenuOpen === "changeUnit"}
            classes={{
              root: css.menuItem,
              selected: css.menuItemSelected
            }}
          >
            Change Unit…
          </MenuItem>
          <Popper
            style={{ zIndex: 10 }}
            open={submenuOpen === "changeUnit"}
            anchorEl={this.changeUnitEl}
            transition
            placement={"left-start"}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-change-unit"
                style={{ transformOrigin: placement }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleCloseSubmenu}>
                    <div>UNITS</div>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          <MenuItem
            onClick={() => this.handleOpenSubmenu("reschedule")}
            buttonRef={node => {
              this.rescheduleEl = node;
            }}
            aria-owns={submenuOpen === "reschedule" ? "menu-reschedule" : null}
            aria-haspopup="true"
            selected={submenuOpen === "reschedule"}
            classes={{
              root: css.menuItem,
              selected: css.menuItemSelected
            }}
          >
            Reschedule…
          </MenuItem>
          <Popper
            style={{ zIndex: 10 }}
            open={submenuOpen === "reschedule"}
            anchorEl={this.rescheduleEl}
            transition
            placement={"left-start"}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-reschedule"
                style={{ transformOrigin: placement }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleCloseSubmenu}>
                    <div>CALENDAR</div>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          <MenuItem
            onClick={this.handleClose}
            classes={{
              root: css.menuItem,
              selected: css.menuItemSelected
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

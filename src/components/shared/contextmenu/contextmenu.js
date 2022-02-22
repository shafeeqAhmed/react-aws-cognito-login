// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import SubMenuItem from "./subMenuItem";
import type { Props } from "./";

export default class ContextMenu extends PureComponent<Props> {
  renderMenuItems = () => {
    const { menuItems } = this.props;

    return menuItems.map(menuItem => {
      if (
        typeof menuItem.menuItems !== "undefined" &&
        menuItem.menuItems.length
      ) {
        return (
          <SubMenuItem
            key={menuItem.key}
            caption={menuItem.caption}
            menuItems={menuItem.menuItems}
          />
        );
      }

      return (
        <MenuItem key={menuItem.key} onClick={menuItem.onClick}>
          {menuItem.caption}
        </MenuItem>
      );
    });
  };

  render() {
    const { anchorEl, open, onClose } = this.props;

    return (
      <Menu
        id="menu"
        anchorEl={anchorEl}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        open={!!open}
        onClose={onClose}
      >
        {this.renderMenuItems()}
      </Menu>
    );
  }
}

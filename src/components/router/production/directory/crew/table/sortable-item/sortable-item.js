// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from "react";
import dragBlack from "static/images/drag-black.svg";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ElypsisIcon from "static/images/elypsis.svg";
import { SortableElement, SortableHandle } from "react-sortable-hoc";
import css from "./sortable-item.style.css";

const Handle = SortableHandle(() => <img src={dragBlack} alt="drag" />);

type Props = {
  +user: Object
};

type State = {
  contextMenuOn: ?string
};

class SortableItem extends Component<Props, State> {
  contextMenuRefs: { [id: string]: ?HTMLElement } = {};

  state: State = {
    contextMenuOn: null
  };

  handleToggleContextMenu = (e: Event, user: Object) => {
    e.preventDefault();

    this.setState((state: State) => ({
      contextMenuOn: state.contextMenuOn === user.id ? null : user.id
    }));
  };

  renderTags = () => {
    const { productionTags } = this.props.user;

    return productionTags.map(tag => (
      <span
        key={tag.id}
        className={css.tag}
        style={{
          border: `1px solid ${tag.color}`
        }}
      >
        {tag.name}
      </span>
    ));
  };
  handleClose = (e: Event, user: Object) => {
    e.preventDefault();

    this.setState((state: State) => ({
      contextMenuOn: state.contextMenuOn === user.id ? null : user.id
    }));
  };

  renderMoreTags = () => <span className={css.moreTags}>+2</span>;

  render() {
    const { user } = this.props;

    const contextMenuOpen = this.state.contextMenuOn === user.id;
    const contextMenuAnchor = this.contextMenuRefs[user.id];

    return (
      <div className={css.row}>
        <span style={{ width: "6%" }}>
          <Handle />
        </span>
        <span style={{ width: "5.5%" }} className={css.nro}>
          {user.nro}
        </span>
        <span style={{ width: "17%" }} className={css.role}>
          {user.role}
        </span>
        <span style={{ width: "26.5%" }} className={css.name}>
          <img src={user.avatar} alt={user.name} className={css.userAvatar} />
          <span>{user.name}</span>
        </span>
        <span style={{ width: "9%" }} className={css.status}>
          {user.status}
        </span>
        <span style={{ width: "7%" }} className={css.days}>
          {user.days}
        </span>
        <span style={{ width: "25%" }} className={css.productionTags}>
          {this.renderTags()}
          {this.renderMoreTags()}
        </span>
        <span className={css.buttonContainer}>
          <Button
            classes={{
              root: css.button
            }}
            buttonRef={ref => {
              this.contextMenuRefs[user.id] = ref;
            }}
            disableRipple
            onClick={e => this.handleToggleContextMenu(e, user)}
          >
            <img src={ElypsisIcon} alt="more" className={css.elypsisIcon} />
          </Button>
          <Menu
            anchorEl={contextMenuAnchor}
            open={contextMenuOpen}
            onClose={e => this.handleClose(e, user)}
          >
            <MenuItem onClick={e => this.handleClose(e, user)}>
              Profile
            </MenuItem>
            <MenuItem onClick={e => this.handleClose(e, user)}>
              My account
            </MenuItem>
            <MenuItem onClick={e => this.handleClose(e, user)}>Logout</MenuItem>
            <MenuItem onClick={e => this.handleClose(e, user)}>Logout</MenuItem>
            <MenuItem onClick={e => this.handleClose(e, user)}>Logout</MenuItem>
          </Menu>
        </span>
      </div>
    );
  }
}

export default SortableElement(SortableItem);

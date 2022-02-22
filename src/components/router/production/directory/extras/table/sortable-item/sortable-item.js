// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from "react";
import dragBlack from "static/images/drag-black.svg";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ElypsisIcon from "static/images/elypsis.svg";
import AddNewIcon from "static/images/add-green-white.svg";
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
  handleClose = (e: Event, user: Object) => {
    e.preventDefault();

    this.setState((state: State) => ({
      contextMenuOn: state.contextMenuOn === user.id ? null : user.id
    }));
  };

  renderPeople = () => {
    const { user } = this.props;

    return user.people.map(url => (
      <img src={url} alt="people" className={css.userAvatar} />
    ));
  };

  renderMorePeople = () => <span className={css.moreNumber}>+2</span>;

  renderOtherScenes = () => {
    const { user } = this.props;

    return user.otherScenes.map(scene => (
      <span className={css.scene} style={{ backgroundColor: scene.color }}>
        {scene.number}
      </span>
    ));
  };

  renderMoreScenes = () => <span className={css.moreNumber}>+2</span>;

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

  renderMoreTags = () => <span className={css.moreNumber}>+2</span>;

  render() {
    const { user } = this.props;

    const contextMenuOpen = this.state.contextMenuOn === user.id;
    const contextMenuAnchor = this.contextMenuRefs[user.id];

    return (
      <div className={css.row}>
        <span style={{ width: "4.5%" }}>
          <Handle />
        </span>
        <span style={{ width: "3.5%" }} className={css.nro}>
          {user.nro}
        </span>
        <span style={{ width: "16%" }} className={css.role}>
          {user.role}
        </span>
        <span style={{ width: "17%" }} className={css.people}>
          <button>
            <img src={AddNewIcon} alt="add" className={css.addPeopleIcon} />
          </button>
          {this.renderPeople()}
          {this.renderMorePeople()}
        </span>
        <span style={{ width: "5.5%" }} className={css.ages}>
          {user.ages}
        </span>
        <span style={{ width: "5%" }} className={css.race}>
          {user.race}
        </span>
        <span style={{ width: "6.5%" }} className={css.gender}>
          {user.gender}
        </span>
        <span style={{ width: "17%" }} className={css.otherScenes}>
          <span className={css.scenesContainer}>
            {this.renderOtherScenes()}
            {this.renderMoreScenes()}
          </span>
        </span>
        <span style={{ width: "25%" }} className={css.productionTags}>
          <span className={css.tagsContainer}>
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
              <MenuItem onClick={e => this.handleClose(e, user)}>
                Logout
              </MenuItem>
              <MenuItem onClick={e => this.handleClose(e, user)}>
                Logout
              </MenuItem>
              <MenuItem onClick={e => this.handleClose(e, user)}>
                Logout
              </MenuItem>
            </Menu>
          </span>
        </span>
      </div>
    );
  }
}

export default SortableElement(SortableItem);

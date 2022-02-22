// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { type Node, PureComponent } from "react";
import UnitMenu from "./units";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import DropDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Input from "@material-ui/core/Input";
import css from "./toolbar.style.css";
import newSceneIcon from "static/images/new-scene.svg";
import collaboratorsIcon from "static/images/collaborators.svg";
import printIcon from "static/images/print.svg";
import scenesIcon from "static/images/scenes.svg";
import fullScreenIcon from "static/images/full-screen.svg";
import imgPublished from "static/images/published.png";
import searchIcon from "static/images/searchIcon.png";
import comment from "static/images/comment.svg";
import classNames from "classnames";
import { ShootingEventSplitTypes } from "src/redux/modules/screenplay";
import type { Props } from "./";

type State = {
  scaleMenuOpen: boolean,
  selectedScale: string,
  anchorScaleEl: Node
};

export default class Toolbar extends PureComponent<Props, State> {
  state = {
    scaleMenuOpen: false,
    selectedScale: "Fit",
    anchorScaleEl: null
  };

  scales = ["Fit", "100%", "90%", "85%"];

  handleToggle = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({
      anchorScaleEl: event.currentTarget
    });
  };

  handleClose = () => {
    this.setState({
      anchorScaleEl: null
    });
  };

  handleSelect = (s: string) => {
    this.setState({
      selectedScale: s,
      anchorScaleEl: null
    });
  };

  handleCreate = (e: Event) => {};

  handleToggleScenes = () => {
    this.props.collapseScenes();
  };

  // TODO: dropdown menu for split type
  handleSplit = (e: Event) => {
    const { shootingEvent, splitShootingEvent } = this.props;
    if (!shootingEvent) return;

    const { productionId, id } = shootingEvent;
    splitShootingEvent(productionId, id, ShootingEventSplitTypes.EXTEND);
  };

  handleDelete = (e: Event) => {
    const { shootingEvent, deleteShootingEvent } = this.props;
    if (!shootingEvent) return;

    const { productionId, id } = shootingEvent;
    deleteShootingEvent(productionId, id);
  };

  handlePrint = (e: Event) => {};

  render() {
    const { publishChanges, areScenesCollapsed } = this.props;
    const { scaleMenuOpen, selectedScale, anchorScaleEl } = this.state;

    return (
      <div className={css.toolbar}>
        <div className={css.iconToolsContainer}>
          <div className={css.iconToolsLeftContainer}>
            <div className={css.iconWithTextContainer}>
              <UnitMenu />
            </div>
            <Button
              classes={{
                root: css.toggleScenesButton
              }}
              onClick={this.handleToggleScenes}
            >
              Scenes
              <img
                src={scenesIcon}
                alt={"scenes"}
                className={classNames({
                  [css.scenesIconRotated]: !areScenesCollapsed
                })}
              />
            </Button>
            <button className={css.buttonToolbar} onClick={this.handleCreate}>
              <img
                src={newSceneIcon}
                className={css.imgTools}
                alt={"new scene"}
              />
            </button>
            <div className={css.divider} />
            <button className={css.buttonToolbar} onClick={this.handleCreate}>
              <img
                src={collaboratorsIcon}
                className={css.imgTools}
                alt={"collaborators"}
              />
            </button>
            <button className={css.buttonToolbar} onClick={this.handleCreate}>
              <img src={printIcon} className={css.imgTools} alt={"print"} />
            </button>
            <button className={css.buttonToolbar} onClick={this.handleCreate}>
              <img
                src={fullScreenIcon}
                className={css.imgTools}
                alt={"full screen"}
              />
            </button>
            <div className={css.divider} />
            <Button
              aria-owns={scaleMenuOpen ? "units-menu-list-grow" : null}
              aria-haspopup="true"
              onClick={this.handleToggle}
              classes={{
                root: css.scaleButton
              }}
            >
              <span className={css.buttonTitle}>
                {selectedScale || "Units"}
              </span>
              <DropDownIcon className={css.dropDownIcon} />
            </Button>
            <Menu
              id="scale"
              anchorEl={anchorScaleEl}
              open={Boolean(anchorScaleEl)}
              onClose={() => this.handleClose()}
            >
              {this.scales.map(s => (
                <MenuItem
                  key={s}
                  onClick={() => this.handleSelect(s)}
                  className={classNames({
                    [css.menuItem]: true,
                    [css.unitSelected]: selectedScale && selectedScale === s
                  })}
                >
                  {s}
                </MenuItem>
              ))}
            </Menu>
            <button className={css.buttonToolbar} onClick={this.handleCreate}>
              <img src={comment} className={css.imgTools} alt={"comment"} />
            </button>
            {/* <button className={css.buttonToolbar} onClick={this.handleSplit}>
              <img src={} className={css.imgTools} />
            </button>
            <button className={css.buttonToolbar} onClick={this.handleDelete}>
              <img src={} className={css.imgTools} />
            </button>
            <button className={css.buttonToolbar} onClick={this.handlePrint}>
              <img src={} className={css.imgTools} />
            </button> */}
          </div>
        </div>

        <div className={css.iconToolsRigthContainer}>
          <div className={css.iconWithTextContainer}>
            <button
              className={css.publish}
              onClick={(_: SyntheticEvent<>) => publishChanges()}
            >
              <div className={css.publishTitle}>
                <img alt="" className={css.imgToolsRight} src={imgPublished} />
              </div>
            </button>
          </div>
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

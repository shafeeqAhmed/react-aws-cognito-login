// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { type Node, PureComponent } from "react";
import moment from "moment";
import UnitMenu from "./units";
import Input from "@material-ui/core/Input";
import css from "./toolbar.style.css";
import newSceneIcon from "static/images/new-scene.svg";
import goToTodayIcon from "static/images/go-to-today.svg";
import lockedIcon from "static/images/locked.svg";
import printIcon from "static/images/print.svg";
import fullScreenIcon from "static/images/full-screen.svg";
import imgPublished from "static/images/published.png";
import searchIcon from "static/images/searchIcon.png";
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
    const { publishChanges, scheduleDay, maxShootingDay } = this.props;

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
            <div className={css.divider} />
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
            <button className={css.buttonToolbar} onClick={this.handleCreate}>
              <img
                src={goToTodayIcon}
                className={css.imgTools}
                alt={"full screen"}
              />
            </button>
            <div className={css.divider} />
            <div className={css.dayContainer}>
              {scheduleDay &&
                scheduleDay.locked && (
                  <img
                    src={lockedIcon}
                    className={css.lockedIcon}
                    alt={"locked"}
                  />
                )}
              <span className={css.day}>
                {scheduleDay &&
                  moment(scheduleDay.calendar_date).format("dddd L")}
              </span>
              <span className={css.dayCounter}>
                Day {scheduleDay && scheduleDay.shooting_day} of{" "}
                {maxShootingDay}
              </span>
            </div>
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

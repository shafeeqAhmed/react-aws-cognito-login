// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from "react";
import Shot from "../shot";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Checkbox from "@material-ui/core/Checkbox";
import DropDownIcon from "@material-ui/icons/KeyboardArrowDown";
import cameraIcon from "static/images/video-camera.svg";
import arrowIcon from "static/images/up-arrow-inside-circle.svg";
import elypsisIcon from "static/images/elypsis.svg";
import classNames from "classnames";
import css from "./setup.style.css";
import type { Props } from "./";

type State = {
  expanded: boolean
};
class Setup extends Component<Props, State> {
  state = {
    expanded: false
  };

  handleExpand = () => {
    this.setState(state => ({
      expanded: !state.expanded
    }));
  };

  render() {
    const { connectDropTarget, hovered, shots, setup } = this.props;
    const { expanded } = this.state;
    const completed = !!shots.length && shots.every(s => s.completed);
    const opacity = completed ? 0.5 : 1;

    return connectDropTarget(
      <div
        style={{
          opacity
        }}
      >
        <ExpansionPanel
          expanded={hovered || expanded}
          classes={{
            root: css.setupContainer
          }}
        >
          <ExpansionPanelSummary
            onClick={this.handleExpand}
            classes={{
              root: css.setupHeaderRoot,
              content: css.setupHeaderContent,
              expanded: css.setupHeaderExpanded
            }}
          >
            <div className={css.checkboxContainer}>
              <Checkbox
                checked={completed}
                disableRipple
                disableTouchRipple
                classes={{
                  root: css.checkboxRoot,
                  checked: css.checkboxChecked
                }}
              />
            </div>
            <div className={css.nameContainer}>
              <span className={css.setupTitle}>{setup.name}</span>
              <span className={css.shotsCounter}>
                (
                {shots.reduce((count, shot) => {
                  if (shot.completed) {
                    return count + 1;
                  }
                  return count;
                }, 0)}
                /
                {shots.length}
                )
              </span>
              <DropDownIcon
                className={classNames({
                  [css.expandSetupIcon]: true,
                  [css.expanded]: expanded
                })}
              />
            </div>
            <div className={css.rightInfo}>
              <div className={css.cameraContainer}>
                <span className={css.camerasCounter}>1x</span>
                <img src={cameraIcon} className={css.cameraIcon} alt="camera" />
              </div>
              <div className={css.arrowIconContainer}>
                <img src={arrowIcon} className={css.arrowIcon} alt="arrow" />
              </div>
              <div className={css.timeTracking}>
                <span className={`${css.time} ${css.left}`}>30m</span>
                <div className={css.timeBarTotal}>
                  <div className={css.trackedBar} />
                </div>
                <span className={css.time}>30m</span>
              </div>
              <div className={css.elypsisContainer}>
                <button className={css.elypsisButton}>
                  <img
                    src={elypsisIcon}
                    className={css.elypsisIcon}
                    alt="elypsis"
                  />
                </button>
              </div>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails
            classes={{
              root: css.shotsContainerRoot
            }}
          >
            {shots.map((shot, index) => (
              <Shot
                key={shot.id}
                index={shot.index}
                item={shot}
                faded={shot.tempSetupId === setup.id}
              />
            ))}
            <div className={css.addShotContainer}>
              <button className={css.addShotButton}>Add Shot</button>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default Setup;

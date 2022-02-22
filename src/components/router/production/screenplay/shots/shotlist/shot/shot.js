// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import cameraIcon from "static/images/video-camera.svg";
import elypsisIcon from "static/images/elypsis.svg";
import classNames from "classnames";
import css from "./shot.style.css";
import type { Props } from "./";

class Shot extends Component<Props> {
  render() {
    const {
      item,
      isDragging,
      connectDragSource,
      connectDropTarget,
      faded,
      toggleShotStatus
    } = this.props;
    let opacity = faded || item.completed ? 0.5 : 1;
    if (isDragging) {
      opacity = 0;
    }

    return connectDragSource(
      connectDropTarget(
        <div className={css.shotContainer} style={{ opacity }}>
          <div className={css.checkboxContainer}>
            <Checkbox
              checked={item.completed}
              disableRipple
              disableTouchRipple
              onChange={() => toggleShotStatus(item.id)}
              classes={{
                root: css.checkboxRoot,
                checked: css.checkboxChecked
              }}
            />
          </div>
          <div className={css.shotInfoContainer}>
            <div className={css.shotCodeContainer}>
              <div className={css.shotCode}>{item.code}</div>
            </div>
            <span className={css.shotDescription}>{item.description}</span>
            <div className={css.shotSegments}>
              {item.segments.map(s => (
                <div className={css.segment} key={s.id}>
                  <span className={css.segmentDot} />
                  {s.description}
                </div>
              ))}
            </div>
            <div className={css.shotDotContainer}>
              <div className={css.shotDot} />
            </div>
            <div className={css.shotTime}>{item.time}</div>
          </div>
          <div className={css.rightInfo}>
            <div className={css.cameraContainer}>
              <img
                src={cameraIcon}
                className={classNames({
                  [css.cameraIcon]: true,
                  [css.shotCameraIcon]: true
                })}
                alt="camera"
              />
              <span className={css.camerasCounter}>{item.cameras}</span>
            </div>
            <div className={css.playIconContainer}>
              {!item.backlog ? (
                <div className={css.playIcon}>
                  <PlayArrowIcon
                    classes={{
                      root: css.playIconRoot
                    }}
                  />
                </div>
              ) : (
                <div className={css.camerasCounter}>{item.relatedSetupId}</div>
              )}
            </div>
            <div className={css.timeTracking}>
              <span className={`${css.time} ${css.left}`}>
                {item.spentTime}
              </span>
              <div className={css.timeBarTotal}>
                <div className={css.trackedBar} />
              </div>
              <span className={css.time}>{item.remainingTime}</span>
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
        </div>
      )
    );
  }
}

export default Shot;

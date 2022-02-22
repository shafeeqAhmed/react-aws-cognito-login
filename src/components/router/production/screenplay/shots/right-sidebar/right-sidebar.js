// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from "react";
import classNames from "classnames";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import elypsisIcon from "static/images/elypsis.svg";
import drawingActive from "static/images/drawing-active.svg";
import cameraActive from "static/images/camera-light.svg";
import mockShotImg from "static/images/mock-shot-image.png";
import pauseIcon from "static/images/pauseIcon.svg";
import cameraWhiteIcon from "static/images/video-camera-white.svg";
import cupsIcon from "static/images/cups-icon.svg";
import masksIcon from "static/images/masks-icon.svg";
import soundIcon from "static/images/sound-icon.svg";
import plusBlueIcon from "static/images/plus-blue.svg";
import ClearIcon from "@material-ui/icons/Clear";
import css from "./right-sidebar.style.css";
import type { ReduxProps } from "./";

import { takes } from "./mock";

type Props = ReduxProps & {};

export default class RightSidebar extends Component<Props> {
  render() {
    const { user } = this.props;

    return (
      <div className={css.container}>
        <div className={css.header}>
          <div className={css.leftButtons}>
            <Checkbox
              checked
              disableRipple
              disableTouchRipple
              classes={{
                root: css.checkboxRoot,
                checked: css.checkboxChecked
              }}
            />
            <div className={css.shot}>
              <span>A13A</span>
            </div>
            <div className={css.dot} />
          </div>
          <div className={css.rightButtons}>
            <IconButton component="span" className={css.headerButton}>
              <img src={elypsisIcon} alt="elypsis" className={css.elypsis} />
            </IconButton>
            <IconButton component="span" className={css.headerButton}>
              <ClearIcon className={css.clearIcon} fontSize={"large"} />
            </IconButton>
          </div>
        </div>
        <div className={css.shotSection}>
          <p className={css.title}>Dolly Single Sam Slate</p>
          <img src={mockShotImg} alt={"mock img"} className={css.shotImg} />
          <p className={css.shotDetails}>
            10m - shoot down hillside Sam Slate up into frame - Dolly back - he
            steps R-L - turns CC to look L-R - (Dolly Back with him L-R - turns
            to run L-R side of frame - #1 only]
          </p>
        </div>
        <div className={css.section}>
          <p className={css.sectionTitle}>
            <span>TIME TRACKING</span>
          </p>
          <div className={css.sectionContent}>
            <ul className={css.segments}>
              <li className={css.segment}>
                Cut-in | Birds-eye | Dolly Zoom
                <span>
                  <img
                    src={drawingActive}
                    alt={"segment img"}
                    className={css.segmentIcon}
                  />
                  <img
                    src={cameraActive}
                    alt={"segment img"}
                    className={css.segmentIcon}
                  />
                </span>
              </li>
              <li className={css.segment}>
                MS | High
                <span>
                  <img
                    src={drawingActive}
                    alt={"segment img"}
                    className={css.segmentIcon}
                  />
                  <img
                    src={cameraActive}
                    alt={"segment img"}
                    className={css.segmentIcon}
                  />
                </span>
              </li>
            </ul>
            <div className={css.addSegment}>
              <span>+</span>
              Add Segment
            </div>
          </div>
        </div>
        <div className={css.section}>
          <p className={css.sectionTitle}>
            <span>LINKED SHOTS</span>
          </p>
          <div className={css.sectionContent}>
            <div className={css.linkedShots}>
              <div className={css.linkedShot}>A13A</div>
            </div>
          </div>
        </div>
        <div className={css.section}>
          <p className={css.sectionTitle}>
            <span>EST. SCREEN TIME</span>
            <span>EST. SHOOT TIME</span>
          </p>
          <div className={css.sectionContent}>
            <div className={css.timesContainer}>
              <div className={css.greyBox}>3:35</div>
              <div className={css.shotTime}>30m</div>
            </div>
          </div>
        </div>
        <div className={css.section}>
          <p className={css.sectionTitle}>
            <span>TIME TRACKING</span>
            <img alt="" src={pauseIcon} />
          </p>
          <div className={`${css.sectionContent} ${css.sectionTimeTracking}`}>
            <div className={css.trBottomText}>
              <p className={css.logged}>
                <span>1h 23m</span> logged
              </p>
              <p className={css.remaining}>
                remaining <span>17h 34m</span>
              </p>
            </div>
            <div className={css.barOut}>
              <div className={css.barIn} />
            </div>
          </div>
        </div>
        <div className={css.section}>
          <p className={css.sectionTitle}>
            <span>TAKES</span>
          </p>
          <ul className={css.takes}>
            {takes.map(t => (
              <li className={css.take} key={t.id}>
                <p
                  className={classNames({
                    [css.takeNumber]: true,
                    [css.takeNumberOutlined]: t.numberStyle === "outlined",
                    [css.takeNumberFilled]: t.numberStyle === "filled"
                  })}
                >
                  {t.number}
                </p>
                <div
                  className={classNames({
                    [css.takeBox]: true,
                    [css.backgroundRed]: t.camera === 2,
                    [css.backgroundGrey]: t.camera === 3
                  })}
                >
                  <img
                    src={cameraWhiteIcon}
                    alt={"camera"}
                    className={css.takeIcon}
                  />
                  {!!t.badges.camera && (
                    <div
                      className={classNames({
                        [css.takeBadge]: true,
                        [css.backgroundRed]: t.badges.camera === 2,
                        [css.backgroundGrey]: t.badges.camera === 3
                      })}
                    />
                  )}
                </div>
                <div
                  className={classNames({
                    [css.takeBox]: true,
                    [css.backgroundRed]: t.cups === 2,
                    [css.backgroundGrey]: t.cups === 3
                  })}
                >
                  <img src={cupsIcon} alt={"cups"} className={css.takeIcon} />
                  {!!t.badges.cups && (
                    <div
                      className={classNames({
                        [css.takeBadge]: true,
                        [css.backgroundRed]: t.badges.cups === 2,
                        [css.backgroundGrey]: t.badges.cups === 3
                      })}
                    />
                  )}
                </div>
                <div
                  className={classNames({
                    [css.takeBox]: true,
                    [css.backgroundRed]: t.masks === 2,
                    [css.backgroundGrey]: t.masks === 3
                  })}
                >
                  <img src={masksIcon} alt={"masks"} className={css.takeIcon} />
                  {!!t.badges.takes && (
                    <div
                      className={classNames({
                        [css.takeBadge]: true,
                        [css.backgroundRed]: t.badges.takes === 2,
                        [css.backgroundGrey]: t.badges.takes === 3
                      })}
                    />
                  )}
                </div>
                <div
                  className={classNames({
                    [css.takeBox]: true,
                    [css.backgroundRed]: t.sound === 2,
                    [css.backgroundGrey]: t.sound === 3
                  })}
                >
                  <img src={soundIcon} alt={"sound"} className={css.takeIcon} />
                  {!!t.badges.sound && (
                    <div
                      className={classNames({
                        [css.takeBadge]: true,
                        [css.backgroundRed]: t.badges.sound === 2,
                        [css.backgroundGrey]: t.badges.sound === 3
                      })}
                    />
                  )}
                </div>
                <p className={css.takeTime}>3:30</p>
                {t.wild && <p className={css.takeRightText}>Wild</p>}
              </li>
            ))}
          </ul>
          <button className={css.addTake}>
            <img
              src={plusBlueIcon}
              alt={"add take"}
              className={css.addTakeIcon}
            />
            Add Take
          </button>
        </div>
        <div className={css.section}>
          <p className={css.sectionTitle}>
            <span>CAMERA DETAILS</span>
          </p>
          <div className={css.sectionContent}>
            <div className={css.detailsContainer}>
              <div className={css.greyBox}>Steadycam</div>
              <div className={css.greyBox}>10mm</div>
              <div className={css.greyBox}>Polarizer</div>
            </div>
          </div>
        </div>
        <div className={css.section}>
          <p className={css.sectionTitle}>
            <span>ON SCREEN</span>
          </p>
          <div className={css.sectionContent}>
            <div className={css.screensContainer}>
              <div className={css.screen}>Maximus</div>
              <div className={css.screen}>Proximo</div>
              <div className={css.screen}>Catapult</div>
              <div className={css.screen}>Max&apos;s Sword</div>
              <div className={css.screen}>Chariot</div>
              <div className={css.screen}>Max&apos;s Shield</div>
              <button className={css.addScreenButton}>
                <img
                  src={plusBlueIcon}
                  alt={"add screen"}
                  className={css.addScreen}
                />
              </button>
            </div>
          </div>
        </div>
        <div className={css.section}>
          <p className={css.sectionTitle}>
            <span>NOTES</span>
          </p>
          <ul>
            <li className={css.note}>
              <div className={css.avatarContainer}>
                <img
                  src={user && user.avatar ? user.avatar.urls[0] : null}
                  alt={user && user.mention}
                  className={css.noteAvatar}
                />
              </div>
              <div className={css.noteInfo}>
                <p className={css.noteHeader}>
                  <span className={css.noteName}>John Gholson</span>
                  <span className={css.noteTime}>3 days ago</span>
                </p>
                <p className={css.noteMessage}>
                  Let&apos;s move this shot to tomorrow morning&apos;s schedule.
                  We need morning light.
                </p>
              </div>
            </li>
            <li className={css.note}>
              <div className={css.avatarContainer}>
                <img
                  src={user && user.avatar ? user.avatar.urls[0] : null}
                  alt={user && user.mention}
                  className={css.noteAvatar}
                />
              </div>
              <div className={css.noteInfo}>
                <p className={css.noteHeader}>
                  <span className={css.noteName}>Katherine Harvey</span>
                  <span className={css.noteTime}>3 days ago</span>
                </p>
                <p className={css.noteMessage}>
                  We may be able to combine this shot with the dolly move on
                  A13C
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

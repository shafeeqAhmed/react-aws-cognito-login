// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";
import { ShootingEventSceneTypes } from "src/redux/modules/screenplay";
import Chip from "@material-ui/core/Chip";
import ClearIcon from "@material-ui/icons/Clear";
import linkIcon from "static/images/linkIcon.svg";
import parallelIcon from "static/images/parallelIcon.svg";
import sceneDoneIcon from "static/images/sceneDoneIcon.svg";
import classNames from "classnames";
import css from "./scene.style.css";
import type { Props } from "./";

export default class SceneComponent extends PureComponent<Props> {
  componentDidMount() {
    const { connectDragPreview } = this.props;
    connectDragPreview &&
      connectDragPreview(getEmptyImage(), { captureDraggingState: true });
  }

  renderScene() {
    const { scene, selected, name, connectDragSource, style } = this.props;
    const s = style || {};

    const body = (
      <div className={css.container} style={s}>
        <div className={css.sceneCodeContainer}>
          <div
            className={classNames({
              [css.sceneCode]: true,
              /* TO-DO: Replace with real data */
              [css.scenePublished]: scene.sceneCode === "5",
              [css.sceneDone]: scene.sceneCode === "6"
            })}
          >
            {scene.sceneCode === "6" && <img src={sceneDoneIcon} alt="✓" />}
            <span>{scene.sceneCode}</span>
          </div>
        </div>
        <div className={selected ? css.sceneTitleBold : css.sceneTitle}>
          {name}
        </div>
        <div className={css.sceneBandRight} />
      </div>
    );

    return connectDragSource ? connectDragSource(body) : body;
  }

  renderChip() {
    const {
      scene,
      onClick,
      onContextMenu,
      onRemove,
      connectDragSource,
      style
    } = this.props;

    const s = style || {};

    const body = (
      <div
        role="presentation"
        className={css.chipContainer}
        onClick={e => onClick(e, scene)}
        onContextMenu={e => onContextMenu(e, scene)}
        style={s}
      >
        {/* $FlowFixMe */}
        <Chip
          className={css.chip}
          classes={{
            label: css.chipLabel,
            root: css.chipRoot
          }}
          deleteIcon={<ClearIcon className={css.clearIcon} />}
          label={scene.sceneCode}
          onClick={e => onClick(e, scene)}
          onDelete={() => onRemove(scene)}
          avatar={
            scene.sceneType === ShootingEventSceneTypes.PRIMARY ? (
              <img
                src={linkIcon}
                alt={"link"}
                className={css.iconPrimaryScene}
              />
            ) : (
              <img
                src={parallelIcon}
                alt={"link"}
                className={css.iconPrimaryScene}
              />
            )
          }
        />
      </div>
    );

    return connectDragSource ? connectDragSource(body) : body;
  }

  render() {
    const { chip } = this.props;
    return chip ? this.renderChip() : this.renderScene();
  }
}

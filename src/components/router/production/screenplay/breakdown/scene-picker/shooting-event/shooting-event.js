// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import Scene from "../scene";
import Dropzone from "../dropzone";
import Color from "color";
import { getSceneColor } from "src/helpers/api";
import css from "./shooting-event.style.css";
import type { Props } from "./";
import { ShootingEventSceneTypes } from "src/redux/modules/screenplay";

export default class ShootingEventComponent extends PureComponent<Props> {
  renderCollapsed() {
    const { shootingEvent, onClick, onContextMenu } = this.props;

    return (
      <div
        className={`${css.shootingEvent} ${css.shootingEventCollapsed}`}
        style={{ borderLeftColor: getSceneColor(shootingEvent.name) }}
        key={shootingEvent.id}
        role="button"
        tabIndex="0"
        onClick={(e: SyntheticMouseEvent<HTMLElement>) => {
          console.log("onClick", e, shootingEvent);
          e.persist();
          onClick(e, shootingEvent);
        }}
        onContextMenu={(e: SyntheticMouseEvent<HTMLElement>) => {
          console.log("onContextMenu", e, shootingEvent);
          e.persist();
          onContextMenu(e, shootingEvent);
        }}
      >
        <div className={`${css.container} ${css.containerCollapsed}`}>
          <div className={css.sceneCode}>{shootingEvent.code}</div>
        </div>
      </div>
    );
  }

  renderExpanded() {
    const {
      shootingEvent,
      onClick,
      onClickScene,
      onContextMenu,
      onRemoveScene,
      selected,
      connectDropTarget,
      isOver,
      draggedScene
    } = this.props;

    const hasDraggedScene =
      draggedScene &&
      shootingEvent.scenes.some(s => s.sceneId === draggedScene.sceneId);
    const showDropzones = isOver && !hasDraggedScene;
    const firstScene = shootingEvent.scenes[0];
    const scenes = shootingEvent.scenes.slice(1);
    const color = Color(getSceneColor(shootingEvent.name));
    const split =
      shootingEvent.splitCount > 0 || !!shootingEvent.splittedFromId;

    return connectDropTarget(
      <div
        className={css.shootingEvent}
        style={{
          borderLeftColor: "transparent",
          borderRightColor: color.hsl().string(),
          backgroundColor: "white",
          fontWeight: showDropzones ? 600 : 300
        }}
        key={shootingEvent.id}
        role="button"
        tabIndex="0"
        onClick={e => onClick(e, shootingEvent)}
        onContextMenu={e => onContextMenu(e, shootingEvent)}
      >
        <div className={css.scenesContainer}>
          <div className={css.firstSceneRow}>
            <Scene
              key={firstScene.sceneId}
              selected={selected}
              scene={firstScene}
              name={shootingEvent.name}
              onClick={e => onClick(e, shootingEvent)}
              onContextMenu={e => onContextMenu(e, shootingEvent)}
              onRemove={() => onRemoveScene(shootingEvent, firstScene)}
              style={{
                width: "80%"
              }}
            />
            <div className={css.gutterIconsContainer}>
              {split && (
                <div className={css.gutterIcon}>
                  <span>{shootingEvent.splitIndex}</span>
                </div>
              )}
            </div>
          </div>

          {showDropzones && (
            <div className={css.dropzones}>
              <Dropzone
                color={color.hsl().string()}
                shootingEvent={shootingEvent}
                sceneType={ShootingEventSceneTypes.PRIMARY}
              >
                linked
              </Dropzone>
              <Dropzone
                color={color.hsl().string()}
                shootingEvent={shootingEvent}
                sceneType={ShootingEventSceneTypes.SECONDARY}
              >
                parallel
              </Dropzone>
            </div>
          )}

          {!showDropzones &&
            !!scenes.length && (
              <div className={css.chipContainer}>
                {scenes.map(sc => (
                  <Scene
                    key={sc.sceneId}
                    chip
                    selected={selected}
                    scene={sc}
                    onClick={e => onClickScene(e, shootingEvent, sc)}
                    onContextMenu={e => onContextMenu(e, shootingEvent, sc)}
                    onRemove={() => onRemoveScene(shootingEvent, sc)}
                  />
                ))}
              </div>
            )}
        </div>
      </div>
    );
  }

  render() {
    return this.props.collapsed
      ? this.renderCollapsed()
      : this.renderExpanded();
  }
}

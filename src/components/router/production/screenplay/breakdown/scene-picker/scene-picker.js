// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { get } from "lodash";
import ShootingEventComponent from "./shooting-event";
// import CustomDragLayer from "./drag-layer";
import type {
  ShootingEvent,
  ShootingEventScene
} from "src/redux/modules/screenplay";
import { ShootingEventSplitTypes } from "src/redux/modules/screenplay";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import imgSearchIcon from "static/images/searchIcon.png";
import css from "./scene-picker.style.css";
import type { ReduxProps } from "./";
import ContextMenu from "src/components/shared/contextmenu";
import type { Item as ContextMenuItem } from "src/components/shared/contextmenu";

type Props = ReduxProps & {};

type State = {
  contextMenu: {
    open: boolean,
    item: ?ShootingEvent | ?ShootingEventScene,
    anchorEl: ?HTMLElement,
    menuItems: Array<ContextMenuItem>
  }
};

class ScenePicker extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      contextMenu: {
        open: false,
        item: null,
        anchorEl: null,
        menuItems: []
      }
    };
  }

  removeScene = (shootingEvent: ShootingEvent, scene: ShootingEventScene) => {
    if (!shootingEvent || !scene) {
      return;
    }

    const { productionId, id } = shootingEvent;
    const { sceneId } = scene;

    this.props.removeSceneFromShootingEvent(productionId, id, sceneId);
  };

  clickScene = (
    e: SyntheticMouseEvent<HTMLElement>,
    shootingEvent: ShootingEvent,
    scene: ShootingEventScene
  ) => {
    console.log("click scene %s from %s", scene.sceneId, shootingEvent.id);
  };

  clickShootingEvent = (
    e: SyntheticMouseEvent<HTMLElement>,
    shootingEvent: ShootingEvent
  ) => {
    if (get(this.props, "selectedShootingEvent.id") !== shootingEvent.id) {
      this.props.selectShootingEvent(shootingEvent);
    }
  };

  onContextMenu = (
    e: SyntheticMouseEvent<HTMLElement>,
    shootingEvent: ShootingEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    // e.persist();

    const target = ((e.target: any): HTMLElement);
    const { splitShootingEvent, deleteShootingEvent } = this.props;
    const { closeContextMenu } = this;

    this.setState(() => ({
      contextMenu: {
        open: true,
        item: shootingEvent,
        anchorEl: target,
        onClose: this.closeContextMenu,
        menuItems: [
          {
            key: "extend",
            caption: "Extend",
            onClick: () => {
              splitShootingEvent(
                shootingEvent.productionId,
                shootingEvent.id,
                ShootingEventSplitTypes.EXTEND
              );
              closeContextMenu();
            }
          },
          {
            key: "reshoot",
            caption: "Reshoot",
            onClick: () => {
              splitShootingEvent(
                shootingEvent.productionId,
                shootingEvent.id,
                ShootingEventSplitTypes.RESHOOT
              );
              closeContextMenu();
            }
          },
          {
            key: "delete",
            caption: "Delete",
            onClick: () => {
              deleteShootingEvent(shootingEvent.productionId, shootingEvent.id);
              closeContextMenu();
            }
          }
        ]
      }
    }));

    return false;
  };

  closeContextMenu = () => {
    this.setState(() => ({
      contextMenu: {
        open: false,
        item: null,
        anchorEl: null,
        menuItems: []
      }
    }));
  };

  render() {
    const {
      shootingEvents,
      filter,
      filterScenes,
      collapsed,
      selectedShootingEvent
    } = this.props;

    const { removeScene, clickScene, clickShootingEvent, onContextMenu } = this;

    const selectedShootingEventId = get(selectedShootingEvent, "id", "");

    return (
      <div className={css.scenePicker}>
        {!collapsed && (
          <div className={css.inputButtonContainer}>
            <div className={css.header}>
              <div className={css.inputContainer}>
                <img alt="" className={css.imgSearch} src={imgSearchIcon} />
                <input
                  type="text"
                  name="search"
                  placeholder={"Search Scenes"}
                  className={css.input}
                  value={filter}
                  onChange={e => filterScenes(e.target.value)}
                />
              </div>
              <IconMenu
                iconButtonElement={
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                }
                anchorOrigin={{ horizontal: "left", vertical: "top" }}
                targetOrigin={{ horizontal: "left", vertical: "top" }}
                className={css.headerIcon}
              >
                <MenuItem value={3} primaryText="Lock" />
              </IconMenu>
            </div>
          </div>
        )}
        <div className={css.buttonsContainer}>
          <div className={css.buttonsContainerShadow}>
            <div className={css.sceneList}>
              {shootingEvents.map((s, i) => (
                <ShootingEventComponent
                  key={s.id}
                  collapsed={collapsed}
                  onContextMenu={onContextMenu}
                  onClick={clickShootingEvent}
                  onClickScene={clickScene}
                  onRemoveScene={removeScene}
                  selected={s.id === selectedShootingEventId}
                  shootingEvent={s}
                />
              ))}
            </div>
          </div>
        </div>
        {/* <CustomDragLayer /> */}
        <ContextMenu {...this.state.contextMenu} />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(ScenePicker);

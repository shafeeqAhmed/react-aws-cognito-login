// @flow
/* eslint react/no-array-index-key: 0 */

import React, { PureComponent } from "react";
import css from "./scene-picker.style.css";
// eslint-disable-next-line import/no-extraneous-dependencies
import Menu from "@material-ui/core/Menu";
// eslint-disable-next-line import/no-extraneous-dependencies
import MenuItem from "@material-ui/core/MenuItem";
// import IconMenu from "material-ui/IconMenu";
// import MenuItem from "material-ui/MenuItem";
// import IconButton from "material-ui/IconButton";
// import imgSearchIcon from "static/images/searchIcon.png";
// import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import type { ScreenplayScene } from "src/redux/modules/screenplay";
import type { ReduxProps } from "./";

type Props = ReduxProps & {};

type State = {
  contextMenu: {
    anchorEl: ?HTMLElement,
    scene: ?ScreenplayScene,
    open: boolean
  }
};

export default class ScenePicker extends PureComponent<Props, State> {
  state = {
    contextMenu: { open: false, anchorEl: null, scene: null }
  };

  renderContextMenu() {
    const { contextMenu } = this.state;
    if (!contextMenu) return null;

    const { anchorEl, open, scene } = contextMenu;

    return (
      <Menu
        id={"scene-context-menu"}
        anchorEl={anchorEl}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        open={!!open}
        onClose={this.closeContextMenu}
      >
        {scene &&
          !scene.sceneLocked && (
            <MenuItem
              key={scene.sceneId}
              onClick={() => {
                this.props.lockScene(scene);
                this.closeContextMenu();
              }}
            >
              Lock
            </MenuItem>
          )}
        {scene &&
          !scene.sceneLocked && (
            <MenuItem
              key={scene.sceneId}
              onClick={() => {
                this.props.deleteScene(scene);
                this.closeContextMenu();
              }}
            >
              Delete
            </MenuItem>
          )}
        {scene &&
          scene.sceneLocked &&
          !scene.sceneOmitted && (
            <MenuItem
              key={scene.sceneId}
              onClick={() => {
                this.props.omitScene(scene);
                this.closeContextMenu();
              }}
            >
              Omit
            </MenuItem>
          )}
        {scene &&
          scene.sceneOmitted && (
            <MenuItem
              key={scene.sceneId}
              onClick={() => {
                this.props.restoreScene(scene);
                this.closeContextMenu();
              }}
            >
              Restore
            </MenuItem>
          )}
      </Menu>
    );
  }

  closeContextMenu = () => {
    this.setState({
      contextMenu: {
        ...this.state.contextMenu,
        open: false
      }
    });
  };

  showContextMenu = (
    e: SyntheticMouseEvent<HTMLElement>,
    scene: ScreenplayScene
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // if (!(e.target instanceof HTMLElement)) return false;

    this.setState({
      contextMenu: {
        open: true,
        anchorEl: e.currentTarget,
        scene
      }
    });

    return false;
  };

  render() {
    const {
      scenes,
      // sceneFilter,
      // filterScenes,
      // orderBySequence
      areScenesCollapsed,
      selectedSceneId
    } = this.props;

    const collapsedStyles = {
      width: areScenesCollapsed ? "0px" : undefined,
      borderRight: areScenesCollapsed ? "none" : undefined
    };

    if (areScenesCollapsed) {
      return null;
    }

    return (
      <div className={css.scenePicker} style={collapsedStyles}>
        {/* {!areScenesCollapsed && ( */}
        <div className={css.buttonsContainer}>
          <div className={css.buttonsContainerShadow}>
            <div className={css.sceneList}>
              {this.renderContextMenu()}
              {scenes.map((s, i) => (
                <div
                  className={css.scene}
                  style={{
                    borderLeftColor: "transparent",
                    borderRightColor: s.color
                  }}
                  key={s.sceneCode}
                  role="button"
                  tabIndex="0"
                  onClick={() => this.props.selectScene(s)}
                  onContextMenu={(e: SyntheticMouseEvent<HTMLElement>) =>
                    this.showContextMenu(e, s)
                  }
                >
                  <div className={css.container}>
                    <div className={css.sceneBandLeft} />
                    <div className={css.sceneCode}>{s.sceneCode}</div>
                    <div
                      className={
                        [s.sceneId, s.sceneCode].includes(selectedSceneId)
                          ? css.sceneTitleBold
                          : css.sceneTitle
                      }
                    >
                      {s.sceneTitle}
                    </div>
                    <div className={css.sceneBandRight} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* )} */}
      </div>
    );
  }
}

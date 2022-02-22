// @flow
import type { Node } from "react";
import type {
  ShootingEvent,
  ShootingEventSceneType
} from "src/redux/modules/screenplay";
import { pick } from "lodash";
import Component from "./dropzone";
import {
  DropTarget,
  DropTargetMonitor,
  DropTargetConnector,
  ConnectDropTarget
} from "react-dnd";

export type OwnProps = {
  +shootingEvent: ShootingEvent,
  +sceneType: ShootingEventSceneType,
  +color: string,
  +children?: Node
};

export type DropTargetProps = {
  +isOver: boolean,
  +canDrop: boolean,
  +connectDropTarget: ConnectDropTarget
};

export type Props = OwnProps & DropTargetProps;

// eslint-disable-next-line import/prefer-default-export
export const target = {
  canDrop(props: Props, monitor: DropTargetMonitor) {
    const scene = monitor.getItem();
    const ids = props.shootingEvent.scenes.map(sc => sc.sceneId);
    return !ids.includes(scene.sceneId);
  },

  drop(props: Props, monitor: DropTargetMonitor) {
    if (monitor.didDrop()) {
      return {};
    }

    const res = pick(props, "shootingEvent", "sceneType");
    console.log("drop", res);
    return res;
  }
};

export default DropTarget(
  "ShootingEventScene",
  target,
  (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    connectDropTarget: connect.dropTarget()
  })
)(Component);

// @flow
import type {
  ShootingEvent,
  ShootingEventScene
} from "src/redux/modules/screenplay";
import ShootingEventComponent from "./shooting-event";
import {
  DropTarget,
  DropTargetMonitor,
  DropTargetConnector,
  ConnectDropTarget
} from "react-dnd";

export type OwnProps = {
  +collapsed: boolean,
  +onClick: Function,
  +onContextMenu: Function,
  +onClickScene: Function,
  +onRemoveScene: Function,
  +selected: boolean,
  +shootingEvent: ShootingEvent
};

export type DropTargetProps = {
  +isOver: boolean,
  +canDrop: boolean,
  +connectDropTarget: ConnectDropTarget,
  +draggedScene: ?ShootingEventScene
};

export type Props = OwnProps & DropTargetProps;

// eslint-disable-next-line import/prefer-default-export
export const target = {
  canDrop(props: Props, monitor: DropTargetMonitor) {
    return false;
    // const scene = monitor.getItem();
    // const ids = props.shootingEvent.scenes.map(sc => sc.sceneId);
    // return !ids.includes(scene.sceneId);
  },

  drop(props: Props, monitor: DropTargetMonitor) {
    if (monitor.didDrop()) {
      return {};
    }

    return { shootingEvent: props.shootingEvent };
  }
};

export default DropTarget(
  "ShootingEventScene",
  target,
  (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    connectDropTarget: connect.dropTarget(),
    draggedScene: monitor.getItem()
  })
)(ShootingEventComponent);

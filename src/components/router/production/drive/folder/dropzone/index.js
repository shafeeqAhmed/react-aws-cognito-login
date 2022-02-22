// @flow
import { type Node } from "react";
import Component from "./dropzone";
import {
  DropTarget,
  DropTargetMonitor,
  DropTargetConnector,
  ConnectDropTarget
} from "react-dnd";

export type OwnProps = {
  +accepts: Array<String>,
  +children?: Node
};

export type DropTargetProps = {
  +connectDropTarget: ConnectDropTarget,
  +isOver: boolean,
  +canDrop: boolean,
  +onDrop: (
    props: OwnProps & DropTargetProps,
    monitor: DropTargetMonitor
  ) => void
};

export type Props = OwnProps & DropTargetProps;

// eslint-disable-next-line import/prefer-default-export
export const target = {
  drop(props: Props, monitor: DropTargetMonitor) {
    // if (!monitor.didDrop()) {
    //   return;
    // }

    if (props.onDrop) {
      props.onDrop(props, monitor);
    }
  }
};

export default DropTarget(
  (props: Props) => props.accepts,
  target,
  (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  })
)(Component);

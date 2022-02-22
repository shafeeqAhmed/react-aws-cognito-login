// @flow
import { connect as connectRedux } from "react-redux";
import { bindActionCreators } from "redux";
import Component from "./shot";
import { findDOMNode } from "react-dom";
import {
  DragSource,
  DropTarget,
  ConnectDropTarget,
  ConnectDragSource,
  DropTargetMonitor,
  DropTargetConnector,
  DragSourceConnector,
  DragSourceMonitor
} from "react-dnd";
import {
  type Shot,
  moveShot,
  changeShotSetup,
  toggleShotStatus
} from "src/redux/modules/shots";

type OwnProps = {
  id: string,
  index: number,
  item: Shot,
  faded: number
};

type CardSourceCollectedProps = {
  isDragging: boolean,
  connectDragSource: ConnectDragSource
};

type CardTargetCollectedProps = {
  connectDropTarget: ConnectDropTarget
};

type DispatchProps = {|
  +moveShot: typeof moveShot,
  +changeShotSetup: typeof changeShotSetup,
  +toggleShotStatus: typeof toggleShotStatus
|};

export type Props = OwnProps &
  CardSourceCollectedProps &
  CardTargetCollectedProps &
  DispatchProps;

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      moveShot,
      changeShotSetup,
      toggleShotStatus
    },
    dispatch
  );

const cardSource = {
  beginDrag(props: Props) {
    return {
      id: props.item.id,
      index: props.index,
      setupId: props.item.setupId
    };
  },
  endDrag(props: Props, monitor: any) {
    if (monitor.getDropResult()) {
      const setupId = monitor.getDropResult().setupId;
      props.changeShotSetup(props.item.id, setupId);
    }
  }
};

const cardTarget = {
  hover(props: Props, monitor: DropTargetMonitor, component: ?Component) {
    if (!component) {
      return null;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return null;
    }

    // Determine rectangle on screen
    // eslint-disable-next-line react/no-find-dom-node
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return null;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return null;
    }

    // Time to actually perform the action
    props.moveShot(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    // eslint-disable-next-line no-param-reassign
    monitor.getItem().index = hoverIndex;
    return null;
  }
};

const withDragSource = component =>
  DropTarget(
    "item",
    cardTarget,
    (connect: DropTargetConnector, monitor: any) => ({
      connectDropTarget: connect.dropTarget()
    })
  )(
    DragSource(
      "item",
      cardSource,
      (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
      })
    )(component)
  );

const withRedux = component =>
  connectRedux(null, mapDispatchToProps)(component);

export default withRedux(withDragSource(Component));

// @flow
import type { Node } from "react";
import { connect } from "react-redux";
import type { ShootingEventScene } from "src/redux/modules/screenplay";
import {
  ShootingEventSceneTypes,
  addSceneToShootingEvent
} from "src/redux/modules/screenplay";
import {
  DragSource,
  ConnectDragSource,
  ConnectDragPreview,
  DragSourceMonitor,
  DragSourceConnector
} from "react-dnd";
import SceneComponent from "./scene";

type StateProps = {};

type DispatchProps = {
  +addSceneToShootingEvent?: Function
  // +removeSceneFromShootingEvent: Function
};

type OwnProps = {
  +chip?: boolean,
  +selected: boolean,
  +scene: ShootingEventScene,
  +name?: string,
  +onClick: Function,
  +onContextMenu: Function,
  +onRemove: Function,
  +style?: Object
};

type DragSourceProps = {
  +connectDragSource?: ConnectDragSource,
  +connectDragPreview?: ConnectDragPreview,
  +isDragging: boolean
};

export type Props = OwnProps & DragSourceProps & StateProps & DispatchProps;

function mapStateToProps(
  state: RootReducerState,
  ownProps: OwnProps
): StateProps {
  return {
    ...ownProps
  };
}

const mapDispatchToProps: DispatchProps = {
  addSceneToShootingEvent
};

const source = {
  canDrag(props: Props) {
    return true;
  },

  isDragging(props: Props, monitor: DragSourceMonitor) {
    return monitor.getItem().sceneId === props.scene.sceneId;
  },

  beginDrag(props: Props) {
    return props.scene;
  },

  endDrag(props: Props, monitor: DragSourceMonitor, component: Node) {
    if (!monitor.didDrop()) {
      return;
    }

    const scene = monitor.getItem();
    const { shootingEvent, sceneType } = monitor.getDropResult();

    if (!shootingEvent || !props.addSceneToShootingEvent) return;

    props.addSceneToShootingEvent(
      shootingEvent.productionId,
      shootingEvent.id,
      scene.sceneId,
      sceneType || scene.sceneType || ShootingEventSceneTypes.PRIMARY
    );
  }
};

const withDragSource = component =>
  DragSource(
    "ShootingEventScene",
    source,
    (connector: DragSourceConnector, monitor: DragSourceMonitor) => ({
      connectDragSource: connector.dragSource(),
      connectDragPreview: connector.dragPreview(),
      isDragging: monitor.isDragging()
    })
  )(component);

const withRedux = component =>
  connect(mapStateToProps, mapDispatchToProps)(component);

export default withRedux(withDragSource(SceneComponent));

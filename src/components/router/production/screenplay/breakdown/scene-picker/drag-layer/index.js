// @flow
/* eslint-disable react/no-unused-prop-types */
import React, { PureComponent } from "react";
import { DragLayer } from "react-dnd";
import SceneComponent from "../scene/scene";
import type { ShootingEventScene } from "src/redux/modules/screenplay";

type XYCoord = {
  x: number,
  y: number
};

type DragLayerProps = {
  item: ?ShootingEventScene,
  initialOffset: ?XYCoord,
  currentOffset: ?XYCoord,
  isDragging: boolean
};

type OwnProps = {};

export type Props = DragLayerProps & OwnProps;

const layerStyles = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%"
};

function getItemStyles(props: DragLayerProps) {
  const { initialOffset, currentOffset } = props;

  if (!initialOffset || !currentOffset) {
    return { display: "none" };
  }

  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform
  };
}

class SceneDragLayer extends PureComponent<Props> {
  render() {
    const { isDragging, item } = this.props;
    if (!isDragging || !item) return null;

    return (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          <SceneComponent
            chip
            selected
            scene={item}
            name={item.sceneCode}
            onClick={() => {}}
            onContextMenu={() => {}}
            onRemove={() => {}}
            isDragging={isDragging}
            style={{
              border: "none"
            }}
          />
        </div>
      </div>
    );
  }
}

export default DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: "ShootingEventScene",
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging()
}))(SceneDragLayer);

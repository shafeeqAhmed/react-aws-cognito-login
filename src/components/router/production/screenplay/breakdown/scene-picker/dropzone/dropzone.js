// @flow
import React, { PureComponent } from "react";
import Color from "color";
import css from "./dropzone.style.css";
import type { Props } from "./";

export default class DropzoneComponent extends PureComponent<Props> {
  render() {
    const { color, connectDropTarget, isOver, children } = this.props;

    const c = Color(color);

    return connectDropTarget(
      <div
        className={css.dropzone}
        style={{
          background: "white",
          color: isOver ? "black" : c.darken(0.5).string(),
          border: `1px dashed ${c.darken(isOver ? 1 : 0.5).string()}`
        }}
      >
        {children}
      </div>
    );
  }
}

// c.lighten(0.5).string(),

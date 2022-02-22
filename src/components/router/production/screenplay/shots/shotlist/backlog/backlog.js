// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from "react";
import Shot from "../shot";
import css from "./backlog.style.css";
import type { ReduxProps } from "./";
import type { Shot as ShotType } from "src/redux/modules/shots";

type Props = ReduxProps & {
  +moveShot: Function,
  +changeShotSetup: Function,
  +shots: Array<ShotType>
};

class Backlog extends Component<Props> {
  render() {
    const { connectDropTarget, shots, moveShot, changeShotSetup } = this.props;

    return connectDropTarget(
      <div className={css.container}>
        {shots.map((shot, index) => (
          <Shot
            key={shot.id}
            index={shot.index}
            item={shot}
            moveShot={moveShot}
            changeShotSetup={changeShotSetup}
            faded={shot.tempSetupId === ""}
          />
        ))}
      </div>
    );
  }
}

export default Backlog;

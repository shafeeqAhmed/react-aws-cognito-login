// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from "react";
import Backlog from "./backlog";
import Setup from "./setup";
import HTML5Backend from "react-dnd-html5-backend";
import css from "./shotlist.style.css";
import { DragDropContext } from "react-dnd";
import type { ReduxProps } from "./";

type Props = ReduxProps & {};

class Shotlist extends Component<Props> {
  getSetupShots = (setupId: string) => {
    const { shots } = this.props;

    // TODO: replace with a selector
    return setupId
      ? shots.reduce((filteredShots, shot, index) => {
          if (shot.setupId === setupId || shot.tempSetupId === setupId) {
            filteredShots.push({ ...shot, index });
          }
          return filteredShots;
        }, [])
      : shots.reduce((filteredShots, shot, index) => {
          if (shot.backlog || shot.tempSetupId === "backlog") {
            filteredShots.push({ ...shot, index });
          }
          return filteredShots;
        }, []);
  };

  render() {
    const { setups } = this.props;
    return (
      <div className={css.shotlist}>
        <div className={css.content}>
          <div className={css.section}>
            <div className={css.title}>Current Setups</div>
            {setups.map(s => (
              <Setup key={s.id} setup={s} shots={this.getSetupShots(s.id)} />
            ))}
            <div className={css.newSetupContainer}>
              <button className={css.newSetupButton}>New Setup</button>
            </div>
          </div>
          <div className={css.section}>
            <div className={css.title}>Backlog</div>
            <Backlog shots={this.getSetupShots("")} />
          </div>
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Shotlist);

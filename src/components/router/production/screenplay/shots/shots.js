// @flow
import React, { PureComponent } from "react";
import Toolbar from "./toolbar";
import Stripbar from "./stripbar";
import Shotlist from "./shotlist";

import RightSidebar from "./right-sidebar";
import css from "./shots.style.css";

type Props = {};
export default class Shots extends PureComponent<Props> {
  render() {
    return (
      <div className={css.shots}>
        <Toolbar />
        <div className={css.container}>
          <div className={css.content}>
            <Stripbar />
            <Shotlist />
          </div>
          <div className={css.rightSidebar}>
            <RightSidebar />
          </div>
        </div>
      </div>
    );
  }
}

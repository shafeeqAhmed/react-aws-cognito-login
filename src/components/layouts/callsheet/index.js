// @flow
import React, { type Node, PureComponent } from "react";
import css from "./callsheet.style.css";
import LeftSidebar from "./left-sidebar";
import Toolbar from "./toolbar";

type Props = {
  children: Node
};

export default class CallSheet extends PureComponent<Props> {
  publishChanges = async () => {
    // not implemented yet
  };

  render() {
    const { children } = this.props;

    return (
      <div className={css.callSheet}>
        <Toolbar publishChanges={this.publishChanges} />
        <div className={css.wrapper}>
          <div className={css.leftSidebar}>
            <LeftSidebar />
          </div>
          {children}
        </div>
      </div>
    );
  }
}

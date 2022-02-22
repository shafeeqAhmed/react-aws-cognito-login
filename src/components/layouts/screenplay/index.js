// @flow
import React, { PureComponent, type Node } from "react";
import Header from "./header";
import SideBar from "./sidebar";
import css from "./index.style.css";

type Props = {
  children?: Node
};

export default class Layout extends PureComponent<Props> {
  render() {
    return (
      <div className={css.main}>
        <Header />
        <div className={css.body}>
          <SideBar />
          <div className={css.content}>{this.props.children}</div>
        </div>
      </div>
    );
  }
}

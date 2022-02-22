// @flow
import React, { PureComponent, type Node } from "react";
import Header from "src/components/shared/Header";
import Navigator from "./navigator";
import Details from "./details";
import css from "./index.style.css";

type Props = {
  children?: Node
};

export default class Layout extends PureComponent<Props> {
  render() {
    return (
      <div className={css.main}>
        <Header title="Files" />
        <div className={css.body}>
          <Navigator />
          <div className={css.content}>{this.props.children}</div>
          <Details />
        </div>
      </div>
    );
  }
}

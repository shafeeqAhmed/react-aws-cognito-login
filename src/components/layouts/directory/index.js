// @flow
import React, { PureComponent } from "react";
import Header from "src/components/shared/Header";
import Navigator from "./navigator";
import css from "./index.style.css";
import type { Node } from "react";

type Props = {
  children?: Node
};

export default class Layout extends PureComponent<Props> {
  render() {
    return (
      <div className={css.main}>
        <Header title="Directory" />
        <div className={css.body}>
          <Navigator />
          <div className={css.content}>{this.props.children}</div>
        </div>
      </div>
    );
  }
}

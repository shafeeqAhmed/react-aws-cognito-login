// @flow
import React, { PureComponent } from "react";
import procliqLogo from "static/images/procliqLogo.svg";
import css from "./index.style.css";
import type { Node } from "react";

type Props = {
  children?: Node,
  background: string,
  title: string
};

export default class Layout extends PureComponent<Props> {
  render() {
    const { background, title } = this.props;

    return (
      <div className={css.main}>
        <div
          className={css.rightBackground}
          style={{ backgroundImage: `url(${background})` }}
        />
        <div className={css.logoWrapper}>
          <img src={procliqLogo} alt="ProCliq" className={css.logo} />
        </div>
        <div className={css.content}>
          <h1>{title}</h1>
          {this.props.children}
        </div>
      </div>
    );
  }
}

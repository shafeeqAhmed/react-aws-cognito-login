// @flow
import React, { PureComponent } from "react";
import css from "./header.style.css";
import type { Props } from "./";

export default class Header extends PureComponent<Props> {
  render() {
    const { production, category } = this.props;

    return (
      <div className={css.header}>
        <div className={css.title}>
          {production ? `${production.name}: ` : null}
          {category ? category.name : null}
        </div>
      </div>
    );
  }
}

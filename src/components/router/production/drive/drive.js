// @flow
import React, { PureComponent } from "react";
import renderRoutes from "src/helpers/router/renderRoutes";
import css from "./drive.style.css";
import type { Props } from "./";

export default class Drive extends PureComponent<Props> {
  render() {
    const { route } = this.props;

    return <div className={css.drive}>{renderRoutes(route.routes)}</div>;
  }
}

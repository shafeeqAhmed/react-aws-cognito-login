// @flow
import React, { PureComponent } from "react";
import renderRoutes from "src/helpers/router/renderRoutes";
import Layout from "src/components/layouts/callsheet";
import type { Props } from "./";

export default class Callsheet extends PureComponent<Props> {
  componentWillMount = () => {
    const {
      location: { pathname }
    } = this.props;
    const path = pathname.split("/");

    if (path[path.length - 1] === "callsheet")
      this.props.history.push(`callsheet/schedule`);
  };

  render() {
    const { route } = this.props;

    return <Layout>{renderRoutes(route.routes)}</Layout>;
  }
}

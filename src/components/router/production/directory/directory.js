// @flow
import React, { PureComponent } from "react";
import renderRoutes from "src/helpers/router/renderRoutes";
import css from "./directory.style.css";
import type { Props } from "./";

export default class Directory extends PureComponent<Props> {
  componentDidMount = () => {
    const {
      fetchCategories,
      match: {
        params: { productionId }
      }
    } = this.props;

    fetchCategories({ productionId });
  };

  componentWillMount = () => {
    const {
      location: { pathname },
      match: {
        params: { productionId }
      }
    } = this.props;

    const path = pathname.split("/");

    if (path[path.length - 1] === "directory")
      this.props.history.push(`/${productionId}/directory/crew`);
  };

  render() {
    const { route } = this.props;

    return <div className={css.directory}>{renderRoutes(route.routes)}</div>;
  }
}

// @flow
import React, { PureComponent } from "react";
import { get } from "lodash";
import Layout from "src/components/layouts/screenplay";
import css from "./screenplay.style.css";
import renderRoutes from "src/helpers/router/renderRoutes";
import type { ReduxProps } from "./";

type Props = ReduxProps & {};

export default class Screenplay extends PureComponent<Props> {
  componentDidMount() {
    const { fetchUnits, match } = this.props;

    this.getMetadata();
    const productionId = get(match, "params.productionId");
    const screenplayId = get(this.props, "match.params.screenplayId");

    fetchUnits({ productionId, screenplay_id: screenplayId });
  }

  getMetadata() {
    const screenplayId = get(this.props, "match.params.screenplayId");
    const productionId = get(this.props, "match.params.productionId");

    if (productionId) {
      this.props.getMetadata(productionId, screenplayId);
    }
  }

  render() {
    const { route } = this.props;

    return (
      <div className={css.screenplay}>
        <Layout>{renderRoutes(route.routes)}</Layout>
      </div>
    );
  }
}

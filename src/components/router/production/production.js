// @flow
import React, { PureComponent } from "react";
import { get } from "lodash";
import css from "./production.style.css";
import { type Props } from "./";
import renderRoutes from "src/helpers/router/renderRoutes";

export default class Production extends PureComponent<Props> {
  componentDidMount() {
    const { fetchProductions, fetchTeams } = this.props;

    fetchProductions();
    fetchTeams();

    this.selectProduction(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.match.params !== nextProps.match.params) {
      const prevProductionId = get(this.props.match, "params.productionId");
      const nextProductionId = get(nextProps.match, "params.productionId");

      if (prevProductionId !== nextProductionId)
        this.selectProduction(nextProps);
    }
  }

  selectProduction = (props: Props) => {
    const { fetchCategories, selectProduction, match } = props;

    const productionId = parseInt(get(match, "params.productionId"), 10);
    selectProduction(productionId);
    fetchCategories({ productionId: String(productionId) });
  };

  render() {
    const { route } = this.props;
    return <div className={css.production}>{renderRoutes(route.routes)}</div>;
  }
}

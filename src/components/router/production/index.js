// @flow
import { connect } from "react-redux";
import { type RootReducerState } from "src/redux/modules";
import type { Match, Route } from "src/helpers/router/route";
import {
  fetchProductions,
  selectProduction,
  type Production as ProductionType
} from "src/redux/modules/productions";
import { fetchTeams } from "src/redux/modules/teams";
import getProductionById from "src/redux/selectors/getProductionById";
import { fetchCategories } from "src/redux/modules/categories";
import Production from "./production";

type OwnProps = {|
  route: Route,
  match: Match<{ productionId: string }>
|};

type StateProps = {|
  +production: ?ProductionType
|};

const mapStateToProps = (
  state: RootReducerState,
  ownProps: OwnProps
): StateProps => ({
  production: getProductionById(
    state,
    parseInt(ownProps.match.params.productionId, 10)
  )
});

type DispatchProps = {|
  +selectProduction: typeof selectProduction,
  +fetchCategories: typeof fetchCategories,
  +fetchProductions: Function,
  +fetchTeams: Function
|};

const mapDispatchToProps: DispatchProps = {
  selectProduction,
  fetchCategories,
  fetchProductions,
  fetchTeams
};

export default connect(mapStateToProps, mapDispatchToProps)(Production);
export type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|};

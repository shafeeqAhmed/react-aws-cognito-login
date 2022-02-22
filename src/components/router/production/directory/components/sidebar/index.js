// @flow
import { connect } from "react-redux";
import { type RootReducerState } from "src/redux/modules";
import { withRouter, ContextRouter } from "react-router";
import { type Category, selectCategories } from "src/redux/modules/categories";
import {
  type Production,
  getCurrentProduction as selectActiveProduction,
  selectProductions
} from "src/redux/modules/productions";
import Component from "./sidebar";

type OwnProps = {|
  +active: string
|};

type StateProps = {|
  +production: ?Production,
  +productions: Array<Production>,
  +categories: Array<Category>
|};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  production: selectActiveProduction(state),
  productions: selectProductions(state),
  categories: selectCategories(state)
});

type DispatchProps = {|
  // nothing
|};

const mapDispatchToProps: DispatchProps = (({
  // nothing
}: any): DispatchProps);

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Component)
);

export type Props = {|
  ...ContextRouter,
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|};

// @flow
import { connect } from "react-redux";
import { type RootReducerState } from "src/redux/modules";
import { withRouter, ContextRouter } from "react-router";
import { searchElements, type Search } from "src/redux/modules/elements";
import type { Category } from "src/redux/modules/categories";
import {
  type Production,
  getCurrentProduction as selectActiveProduction
} from "src/redux/modules/productions";
import Component from "./toolbar";

type OwnProps = {|
  +category: Category,
  +onClickNew?: Function
|};

type StateProps = {|
  +production: ?Production,
  +search: Search
|};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  production: selectActiveProduction(state),
  search: state.elements.search
});

type DispatchProps = {|
  +searchElements: Function
|};

const mapDispatchToProps: DispatchProps = (({
  searchElements
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

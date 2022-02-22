// @flow
import { connect } from "react-redux";
import { type RootReducerState } from "src/redux/modules";
import { withRouter, ContextRouter } from "react-router";
import { type Category } from "src/redux/modules/categories";
import {
  type Production,
  getCurrentProduction as selectActiveProduction
} from "src/redux/modules/productions";
import Component from "./header";

type OwnProps = {|
  +category: Category
|};

type StateProps = {|
  +production: ?Production
|};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  production: selectActiveProduction(state)
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

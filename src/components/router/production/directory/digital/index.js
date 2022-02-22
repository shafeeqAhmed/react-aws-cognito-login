// @flow
import { connect } from "react-redux";
import { withRouter, ContextRouter } from "react-router";
import {
  type Category,
  selectCategoryById
} from "src/redux/modules/categories";
import {
  type Production,
  selectActiveProduction
} from "src/redux/modules/productions";
import { setActiveTeam } from "src/redux/modules/teams";
import Component from "./digital";
import type { RootReducerState } from "src/redux/modules";

type StateProps = {|
  +category: ?Category,
  +production: ?Production
|};

type OwnProps = {|
  // nothing
|};

type DispatchProps = {|
  +setActiveTeam: Function
|};

const mapStateToProps = (
  state: RootReducerState,
  ownProps: ContextRouter
): StateProps => {
  const {
    match: {
      params: { categoryId }
    }
  } = ownProps;

  return {
    category: selectCategoryById(state, categoryId),
    production: selectActiveProduction(state)
  };
};

const mapDispatchToProps: DispatchProps = {
  setActiveTeam
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(Component)
);

export type Props = {|
  ...ContextRouter,
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|};

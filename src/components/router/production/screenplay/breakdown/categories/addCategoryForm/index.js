// @flow
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { get } from "lodash";
import Component from "./addCategoryForm";
import {
  createCategory,
  fetchCategories,
  type Category
} from "src/redux/modules/categories";
import {
  getSelectedShootingEvent,
  type ShootingEvent
} from "src/redux/modules/screenplay";
import type { Match } from "src/helpers/router/route";

type OwnProps = {|
  +match: Match<{ productionId: string, screenplayId: string }>
|};

type StateProps = {|
  +shootingEvent: ?ShootingEvent,
  +categories: Array<Category>
|};

const mapStateToProps = (state: RootReducerState): StateProps => {
  const shootingEvent = getSelectedShootingEvent(state);
  const categories = get(state, "categories.list", []);

  return {
    shootingEvent,
    categories
  };
};

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  +createCategory: Function,
  +fetchCategories: Function
};

const mapDispatchToProps: DispatchProps = {
  createCategory,
  fetchCategories
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Component)
);

export type Props = OwnProps & StateProps & DispatchProps;

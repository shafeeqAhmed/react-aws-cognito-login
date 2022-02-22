// @flow
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Component from "./categories";
import {
  getCategoriesWithElementsForShootingEvent,
  createCategory,
  type CategoryWithElements
} from "src/redux/modules/categories";
import {
  fetchElements,
  createElement,
  searchElements,
  linkToShootingEvent,
  unlinkFromShootingEvent,
  type Search
} from "src/redux/modules/elements";
import {
  getSelectedShootingEvent,
  type ShootingEvent
} from "src/redux/modules/screenplay";
import type { Match } from "src/helpers/router/route";

/**
 * StateProps provide a read-only view of the state.
 */

type StateProps = {|
  +categories: Array<CategoryWithElements>,
  +search: Search,
  +shootingEvent: ?ShootingEvent
|};

type OwnProps = {
  toggleElementAnchor: (elementId: string, categoryColor: string) => Promise<*>,
  removeElementAnchors: (elementId: string) => Promise<*>,
  match: Match<{ productionId: string, screenplayId: string }>
};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  categories: getCategoriesWithElementsForShootingEvent(state),
  search: state.elements.search,
  shootingEvent: getSelectedShootingEvent(state)
});

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  +fetchElements: typeof fetchElements,
  +createCategory: typeof createCategory,
  +createElement: Function,
  +searchElements: typeof searchElements,
  +linkToShootingEvent: typeof linkToShootingEvent,
  +unlinkFromShootingEvent: typeof unlinkFromShootingEvent
};

const mapDispatchToProps: DispatchProps = {
  fetchElements,
  createCategory,
  createElement,
  searchElements,
  linkToShootingEvent,
  unlinkFromShootingEvent
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Component)
);
export type Props = OwnProps & StateProps & DispatchProps;

// @flow
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { get } from "lodash";
import Component from "./addElementForm";
import { type CategoryWithElements } from "src/redux/modules/categories";
import {
  createElement,
  searchElements,
  linkToShootingEvent,
  type Search
} from "src/redux/modules/elements";
import {
  getSelectedShootingEvent,
  type ShootingEvent,
  type Cursor
} from "src/redux/modules/screenplay";
import type { Match } from "src/helpers/router/route";

type OwnProps = {|
  +category: CategoryWithElements,
  +toggleAnchor: (elementId: string, color: string) => Promise<*>,
  +match: Match<{ productionId: string, screenplayId: string }>
|};

type StateProps = {|
  +shootingEvent: ?ShootingEvent,
  +cursor: ?Cursor,
  +search: ?Search
|};

const mapStateToProps = (
  state: RootReducerState,
  props: OwnProps
): StateProps => {
  const shootingEvent = getSelectedShootingEvent(state);
  const cursor = get(state, "screenplay.screenplay.cursor", {});
  const search = get(state, "elements.search", {});

  return {
    shootingEvent,
    cursor,
    search
  };
};

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  +createElement: Function,
  +searchElements: Function,
  +linkToShootingEvent: Function
};

const mapDispatchToProps: DispatchProps = {
  createElement,
  searchElements,
  linkToShootingEvent
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Component)
);

export type Props = OwnProps & StateProps & DispatchProps;

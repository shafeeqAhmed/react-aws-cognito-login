// @flow
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { get } from "lodash";
import Component from "./element";
import { type CategoryWithElements } from "src/redux/modules/categories";
import {
  unlinkFromShootingEvent,
  linkToShootingEvent
} from "src/redux/modules/elements";
import {
  getSelectedShootingEvent,
  type ShootingEvent
} from "src/redux/modules/screenplay";
import type { Match } from "src/helpers/router/route";

type OwnProps = {|
  +element: Element,
  +category: CategoryWithElements,
  +toggleAnchor: (elementId: string, categoryColor: string) => Promise<*>,
  +removeAnchors: (elementId: string) => Promise<*>,
  +match: Match<{ productionId: string, screenplayId: string }>
|};

type StateProps = {|
  +shootingEvent: ?ShootingEvent,
  +quantity: number,
  +selectedAnchor: ?string,
  +isTextSelected: boolean
|};

const mapStateToProps = (
  state: RootReducerState,
  props: OwnProps
): StateProps => {
  const shootingEvent = getSelectedShootingEvent(state);
  const se =
    shootingEvent &&
    props.element.shootingevents.find(
      sevt => sevt.shootingevent_id === shootingEvent.id
    );

  const quantity = (se && se.quantity) || 0;
  const cursor = get(state, "screenplay.screenplay.cursor", {});
  const selectedAnchor = cursor.elementId;
  const isTextSelected = !!(cursor.selections && cursor.selections[0]);

  return {
    shootingEvent,
    quantity,
    selectedAnchor,
    isTextSelected
  };
};

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  +linkToShootingEvent: Function,
  +unlinkFromShootingEvent: Function
};

const mapDispatchToProps: DispatchProps = {
  linkToShootingEvent,
  unlinkFromShootingEvent
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Component)
);

export type Props = OwnProps & StateProps & DispatchProps;

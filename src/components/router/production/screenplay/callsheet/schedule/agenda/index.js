// @flow
import { connect } from "react-redux";
import { selectDayEvent } from "src/redux/modules/schedule/days";
import Component from "./agenda";

/**
 * RouterProps are injected by react router.
 */
type OwnProps = {
  // route: Route,
  // match: Match<{ productionId: string, screenplayId: string }>
  scheduleDayEvents: ?Array<Object>,
  scheduleDay: ?Object,
  colors: Array<Object>
};

/**
 * StateProps provide a read-only view of the state.
 */
type StateProps = {};

const mapStateToProps = (
  state: RootReducerState,
  props: OwnProps
): StateProps => ({
  ...props
});

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  +selectDayEvent: typeof selectDayEvent
};

const mapDispatchToProps: DispatchProps = {
  selectDayEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
export type ReduxProps = OwnProps & StateProps & DispatchProps;

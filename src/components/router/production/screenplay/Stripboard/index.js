// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { type ContextRouter } from "react-router";
import { type RootReducerState } from "src/redux/modules";
import {
  fetchScheduleDays,
  selectDayEvent,
  type State as ScheduleDaysState
} from "src/redux/modules/schedule/days";
import { type ScheduleDayEvent } from "src/redux/modules/schedule/events";
import {
  type State as ShootingEventsState,
  fetchNotScheduledEvents
} from "src/redux/modules/shooting/events";
import {
  setStripboardSidebarMode,
  type State as UIState
} from "src/redux/modules/ui";
import {
  type State as ColorsState,
  fetchColors
} from "src/redux/modules/colors";
import { type State as UnitState } from "src/redux/modules/units";
import getCurrentScheduleDayEvent from "src/redux/modules/schedule/days/selectors/getCurrentScheduleDayEvent";
import getCurrentCategoriesWithElements from "src/redux/modules/categories/selectors/getCurrentCategoriesWithElements";
import { type CategoryWithElements } from "src/redux/modules/categories/selectors/getCategoriesWithElements";
import getScheduleDaysByUnit from "src/redux/modules/schedule/days/selectors/getScheduleDaysByUnit";
import { fetchElements } from "src/redux/modules/elements";
import Component from "./Stripboard";

/**
 * OwnProps are injected by react router or other providers.
 */
type OwnProps = {|
  ...ContextRouter
|};

/**
 * StateProps provide a read-only view of the redux state.
 */
type StateProps = {|
  days: $PropertyType<ScheduleDaysState, "list">,
  currentDayEvent: ?ScheduleDayEvent,
  currentCategories: Array<CategoryWithElements>,
  productionId: string,
  screenplayId: string,
  stripboardSidebarMode: $PropertyType<UIState, "stripboardSidebarMode">,
  stripboardSearchResults: $PropertyType<
    ShootingEventsState,
    "stripboardSearchResults"
  >,
  unitId: $PropertyType<UnitState, "currentUnitId">,
  shootingEvents: $PropertyType<ShootingEventsState, "list">,
  colors: $PropertyType<ColorsState, "list">
|};

const mapStateToProps = (
  state: RootReducerState,
  ownProps: OwnProps
): StateProps => ({
  // Seems more convenient and a better component API to declare route params
  // explicitly here
  productionId: ownProps.match.params.productionId,
  screenplayId: ownProps.match.params.screenplayId,
  days: getScheduleDaysByUnit(state),
  currentDayEvent: getCurrentScheduleDayEvent(state),
  currentCategories: getCurrentCategoriesWithElements(state),
  stripboardSearchResults: state.shooting.events.stripboardSearchResults,
  stripboardSidebarMode: state.ui.stripboardSidebarMode,
  unitId: state.units.currentUnitId,
  shootingEvents: state.shooting.events.list,
  colors: state.colors.list
});

/**
 * DispatchProps inject actions to mutate the redux state.
 */
type DispatchProps = {|
  fetchElements: typeof fetchElements,
  fetchScheduleDays: typeof fetchScheduleDays,
  selectDayEvent: typeof selectDayEvent,
  setStripboardSidebarMode: typeof setStripboardSidebarMode,
  fetchNotScheduledEvents: typeof fetchNotScheduledEvents,
  fetchColors: typeof fetchColors
|};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      fetchElements,
      fetchScheduleDays,
      selectDayEvent,
      setStripboardSidebarMode,
      fetchNotScheduledEvents,
      fetchColors
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Component);

export type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|};

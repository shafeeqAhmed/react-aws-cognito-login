// @flow
import { connect } from "react-redux";
import { type ContextRouter } from "react-router";
import { bindActionCreators } from "redux";
import {
  type Day,
  fetchScheduleDays,
  selectScheduleDay,
  selectDayEvent
} from "src/redux/modules/schedule/days";
import { fetchColors, type Color } from "src/redux/modules/colors";
import { fetchForecast } from "src/redux/modules/weather";
import getCurrentScheduleDay from "src/redux/modules/schedule/days/selectors/getCurrentScheduleDay";
import getCurrentScheduleDayEvent from "src/redux/modules/schedule/days/selectors/getCurrentScheduleDayEvent";
import Component from "./schedule";

import { maxShootingDay } from "./mock";

type OwnProps = {|
  ...ContextRouter
|};

type StateProps = {|
  scheduleDayEvents: ?Array<Object>,
  selectedDay: ?Day,
  selectedScheduleDayEvent: ?Object,
  maxShootingDay: number,
  categories: Array<Object>,
  colors: Array<Color>,
  productionId: string,
  screenplayId: string
|};

const mapStateToProps = (
  state: RootReducerState,
  ownProps: OwnProps
): StateProps => {
  const selectedDay = getCurrentScheduleDay(state);
  const selectedScheduleDayEvent = getCurrentScheduleDayEvent(state);

  return {
    productionId: ownProps.match.params.productionId,
    screenplayId: ownProps.match.params.screenplayId,
    scheduleDayEvents: selectedDay && selectedDay.schedule_day_events,
    selectedDay,
    selectedScheduleDayEvent,
    maxShootingDay,
    categories: state.categories.list,
    colors: state.colors.list
  };
};

type DispatchProps = {|
  fetchScheduleDays: typeof fetchScheduleDays,
  selectScheduleDay: typeof selectScheduleDay,
  selectDayEvent: typeof selectDayEvent,
  fetchColors: typeof fetchColors,
  fetchForecast: typeof fetchForecast
|};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      fetchScheduleDays,
      selectScheduleDay,
      selectDayEvent,
      fetchColors,
      fetchForecast
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Component);
export type ReduxProps = StateProps & DispatchProps;

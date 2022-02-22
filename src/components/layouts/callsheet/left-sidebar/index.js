// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import Component from "./left-sidebar";
import { selectScheduleDay } from "src/redux/modules/schedule/days";
import getCurrentScheduleDay from "src/redux/modules/schedule/days/selectors/getCurrentScheduleDay";
import type { Forecast } from "src/redux/modules/weather";

type StateProps = {
  +scheduleDays: Array<Object>,
  +forecast: Array<Forecast>
};

type RouterProps = {
  +location: Location
};

const mapStateToProps = (state: RootReducerState): StateProps => ({
  scheduleDays: state.schedule.days.list,
  selectedDay: getCurrentScheduleDay(state),
  forecast: state.weather.forecast
});

type DispatchProps = {|
  selectScheduleDay: typeof selectScheduleDay
|};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      selectScheduleDay
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Component)
);
export type ReduxProps = StateProps & RouterProps & DispatchProps;

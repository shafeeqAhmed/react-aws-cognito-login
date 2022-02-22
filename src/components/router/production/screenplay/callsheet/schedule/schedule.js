// @flow
import React, { PureComponent } from "react";
import get from "lodash/get";
import moment from "moment";
import Agenda from "./agenda";
import RightSidebar from "./right-sidebar";
import Header from "./header";
import css from "./schedule.style.css";
import type { ReduxProps } from "./";

export default class Schedule extends PureComponent<ReduxProps> {
  componentDidMount = () => {
    const {
      fetchScheduleDays,
      selectScheduleDay,
      productionId,
      screenplayId,
      selectDayEvent,
      fetchColors,
      selectedDay
    } = this.props;

    // $FlowFixMe fetchScheduleDays is a promise
    fetchScheduleDays({
      productionId,
      screenplayId,
      from:
        selectedDay &&
        moment(selectedDay.calendar_date)
          .startOf("month")
          .format("YYYY-MM-DDTHH:mm:ssZ"),
      to:
        selectedDay &&
        moment(selectedDay.calendar_date)
          .endOf("month")
          .format("YYYY-MM-DDTHH:mm:ssZ")
    }).then(({ action }) => {
      const scheduleDay = get(action, "payload.data.schedule_days[0]", null);
      if (scheduleDay) {
        selectScheduleDay(scheduleDay.id);

        if (scheduleDay.schedule_day_events.length > 0) {
          selectDayEvent(scheduleDay.schedule_day_events[0].id);
        }
      }
    });
    fetchColors({ productionId });
  };

  componentWillReceiveProps = (nextProps: ReduxProps) => {
    const { fetchForecast, productionId } = this.props;

    if (!this.props.selectedDay && nextProps.selectedDay) {
      const { selectedDay } = nextProps;
      if (navigator.geolocation && selectedDay) {
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude, longitude } }) => {
            fetchForecast({
              productionId,
              latitude: latitude.toString(),
              longitude: longitude.toString(),
              time: moment(selectedDay.calendar_date).format(
                "YYYY-MM-DDTHH:mm:ssZ"
              ),
              include_following_days: true
            });
          }
        );
      }
    }

    if (
      this.props.selectedDay &&
      nextProps.selectedDay &&
      this.props.selectedDay.id !== nextProps.selectedDay.id
    ) {
      if (
        !moment(this.props.selectedDay.calendar_date).isSame(
          // $FlowFixMe in this line selected day is not undefined
          moment(nextProps.selectedDay.calendar_date),
          "month"
        )
      ) {
        const { fetchScheduleDays, screenplayId, selectedDay } = nextProps;

        fetchScheduleDays({
          productionId,
          screenplayId,
          from:
            // $FlowFixMe in this line selected day is not undefined
            selectedDay &&
            moment(selectedDay.calendar_date)
              .startOf("month")
              .format("YYYY-MM-DDTHH:mm:ssZ"),
          to:
            // $FlowFixMe in this line selected day is not undefined
            selectedDay &&
            moment(selectedDay.calendar_date)
              .endOf("month")
              .format("YYYY-MM-DDTHH:mm:ssZ")
          // $FlowFixMe fetchScheduleDays is a promise
        }).then(({ action }) => {
          console.log(action);
          // const scheduleDay = get(action, "payload.data.schedule_days[0]", null);
          // if (scheduleDay) {
          //   selectScheduleDay(scheduleDay.id);

          //   if (scheduleDay.schedule_day_events.length > 0) {
          //     selectDayEvent(scheduleDay.schedule_day_events[0].id);
          //   }
          // }
        });
      }
    }
  };

  render() {
    const {
      scheduleDayEvents,
      selectedDay,
      selectedScheduleDayEvent,
      categories,
      colors
    } = this.props;

    return (
      <div className={css.container}>
        <div className={css.content}>
          <Header scheduleDay={selectedDay} />
          <Agenda
            scheduleDayEvents={scheduleDayEvents}
            scheduleDay={selectedDay}
            colors={colors}
          />
        </div>
        <div className={css.rightSidebar}>
          <RightSidebar
            scheduleDayEvent={selectedScheduleDayEvent}
            categories={categories}
          />
        </div>
      </div>
    );
  }
}

// @flow
import React, { PureComponent } from "react";
import css from "./left-sidebar.style.css";
import { Link } from "react-router-dom";
import imgTimeActiveIcon from "static/images/timeActiveIcon.svg";
import imgTimeIcon from "static/images/timeIcon.svg";
import imgCrewIcon from "static/images/crewIcon.svg";
import imgCrewBlueIcon from "static/images/crewBlueIcon.svg";
import imgRequirementsIcon from "static/images/requirementsIcon.svg";
import imgRequirementsBlueIcon from "static/images/requirementsBlueIcon.svg";
import thunderStormActive from "static/images/thunderStormActive.svg";
import rainIcon from "static/images/rainIcon.svg";
import rainIconActive from "static/images/rainIconActive.svg";
import sunnyIcon from "static/images/sunny.svg";
import sunnyIconActive from "static/images/sunnyActive.svg";
import snowIcon from "static/images/snow.svg";
import snowIconActive from "static/images/snowActive.svg";
import sleetIcon from "static/images/sleetIcon.svg";
import sleetIconActive from "static/images/sleetIconActive.svg";
import windyIcon from "static/images/windy.svg";
import windyIconActive from "static/images/windyActive.svg";
import cloudyIcon from "static/images/cloudy.svg";
import cloudyIconActive from "static/images/cloudyActive.svg";
import partlyCloudyIcon from "static/images/partly-cloudy.svg";
import partlyCloudyIconActive from "static/images/partly-cloudyActive.svg";
import thunderstormIcon from "static/images/thunderstorm.svg";
import dropIcon from "static/images/dropIcon.svg";
import Calendar from "rc-calendar";
import classNames from "classnames";
import moment from "moment";

import type { ReduxProps } from "./";

type Props = ReduxProps & {};

export default class LeftSidebar extends PureComponent<Props> {
  weatherIcons = {
    "clear-day": {
      default: sunnyIcon,
      active: sunnyIconActive
    },
    // TODO: replace with the corresponding icon
    "clear-night": {
      default: sunnyIcon,
      active: sunnyIconActive
    },
    rain: {
      default: rainIcon,
      active: rainIconActive
    },
    snow: {
      default: snowIcon,
      active: snowIconActive
    },
    sleet: {
      default: sleetIcon,
      active: sleetIconActive
    },
    wind: {
      default: windyIcon,
      active: windyIconActive
    },
    // TODO: replace with the corresponding icon
    fog: {
      default: windyIcon,
      active: windyIconActive
    },
    cloudy: {
      default: cloudyIcon,
      active: cloudyIconActive
    },
    "partly-cloudy-day": {
      default: partlyCloudyIcon,
      active: partlyCloudyIconActive
    },
    // TODO: replace with the corresponding icon
    "partly-cloudy-night": {
      default: partlyCloudyIcon,
      active: partlyCloudyIconActive
    },
    // TODO: replace with the corresponding icon
    hail: {
      default: partlyCloudyIcon,
      active: partlyCloudyIconActive
    },
    thunderstorm: {
      default: thunderstormIcon,
      active: thunderStormActive
    },
    // TODO: replace with the corresponding icon
    tornado: {
      default: thunderstormIcon,
      active: thunderStormActive
    }
  };

  selectDay = (day: moment) => {
    const { scheduleDays, selectScheduleDay } = this.props;
    const scheduleDay = scheduleDays.find(d =>
      day.isSame(d.calendar_date, "day")
    );

    if (scheduleDay) {
      selectScheduleDay(scheduleDay.id);
    }
  };

  render() {
    const {
      location: { pathname },
      scheduleDays,
      forecast
    } = this.props;
    const path = pathname.split("/");
    const section = path[path.length - 1];

    const scheduleIcon =
      section === "schedule" ? imgTimeActiveIcon : imgTimeIcon;

    const peopleIcon = section === "people" ? imgCrewBlueIcon : imgCrewIcon;

    const requirementsIcon =
      section === "requirements"
        ? imgRequirementsBlueIcon
        : imgRequirementsIcon;

    let temperature = "";
    let temperatureLow = "";
    let temperatureHigh = "";
    let precipProbability = "";
    let summary = "";
    let icon = "clear-day";

    if (forecast[0]) {
      temperature = Math.round(forecast[0].temperature_low);
      temperatureLow = Math.round(forecast[0].temperature_low);
      temperatureHigh = Math.round(forecast[0].temperature_high);
      precipProbability = Math.round(forecast[0].precip_probability * 100);
      summary = forecast[0].summary;
      icon = forecast[0].icon;
    }

    return (
      <div className={css.leftSidebar}>
        <div className={css.firstDiv}>
          <div className={css.calendar}>
            <Calendar
              className={css.calendar}
              showDateInput={false}
              onChange={this.selectDay}
              defaultValue={moment()}
              style={{ borderBottom: "none" }}
              dateRender={(current, value) => {
                const scheduleDay = scheduleDays.find(d =>
                  current.isSame(d.calendar_date, "day")
                );
                return (
                  <div
                    className={classNames({
                      [css.calendarDay]: true,
                      [css.offDay]:
                        current.isBefore(moment(), "day") ||
                        current.weekday() === 0 ||
                        current.weekday() === 6,
                      [css.selected]: current.isSame(value, "day"),
                      [css.today]: current.isSame(moment(), "day")
                    })}
                  >
                    {current.date()}
                    <span
                      className={classNames({
                        [css.locked]: scheduleDay && scheduleDay.locked,
                        [css.tentative]:
                          scheduleDay && scheduleDay.status === "preliminary"
                      })}
                    />
                  </div>
                );
              }}
            />
          </div>
          <div className={css.menu}>
            <Link
              to={"schedule"}
              className={classNames({
                [css.menuItem]: true,
                [css.active]: section === "schedule"
              })}
            >
              <img className={css.menuImg} src={scheduleIcon} alt="schedule" />
              <p>Schedule</p>
            </Link>
            <Link
              to={"people"}
              className={classNames({
                [css.menuItem]: true,
                [css.active]: section === "people"
              })}
            >
              <img className={css.menuImg} src={peopleIcon} alt="people" />
              <p>People</p>
            </Link>
            <Link
              to={"requirements"}
              className={classNames({
                [css.menuItem]: true,
                [css.active]: section === "requirements"
              })}
            >
              <img
                className={css.menuImg}
                src={requirementsIcon}
                alt="requirements"
              />
              <p>Requirements</p>
            </Link>
          </div>
        </div>
        <div>
          <div className={css.weather}>
            <div className={css.subWeather}>
              <img
                className={css.wCloud}
                src={this.weatherIcons[icon].active}
                alt={icon}
              />
              <p>{temperature}º</p>
            </div>
            <div className={css.weatherInfo}>
              <div className={css.weatherNumbers}>
                <span>{temperatureLow}º</span>
                <span>{temperatureHigh}º</span>
                <span>
                  <img src={dropIcon} alt="drop" />
                  <p>{precipProbability}%</p>
                </span>
              </div>
              <p className={css.weatherDescription}>{summary}</p>
            </div>
          </div>
          <div className={css.weeklyWheather}>
            {forecast.slice(1).map(d => (
              <span key={d.time} className={css.dayContainer}>
                <p className={css.day}>{moment(d.time).format("ddd")}</p>
                <img
                  src={
                    this.weatherIcons[d.icon] &&
                    this.weatherIcons[d.icon].default
                  }
                  alt={d.icon}
                />
                <p className={css.date}>{moment(d.time).format("DD/MM")}</p>
              </span>
            ))}

            {/* <span className={css.dayContainer}>
              <p className={css.day}>Tue</p>
              <img src={thunderStormIcon} alt="thunder" />
              <p className={css.date}>20/13</p>
            </span>
            <span className={css.dayContainer}>
              <p className={css.day}>Wed</p>
              <img src={sleetIcon} alt="sleet" />
              <p className={css.date}>18/11</p>
            </span>
            <span className={css.dayContainer}>
              <p className={css.day}>Thu</p>
              <img src={severeStormIcon} alt="severe thunder" />
              <p className={css.date}>22/16</p>
            </span>
            <span className={css.dayContainer}>
              <p className={css.day}>Fri</p>
              <img src={blizzardIcon} alt="blizzard" />
              <p className={css.date}>25/14</p>
            </span> */}
          </div>
        </div>
      </div>
    );
  }
}

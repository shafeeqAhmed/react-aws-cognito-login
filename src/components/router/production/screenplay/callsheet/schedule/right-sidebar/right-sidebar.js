// @flow
/* eslint-disable import/no-extraneous-dependencies, camelcase */
import React, { PureComponent } from "react";
import css from "./right-sidebar.style.css";
import timeIcon from "static/images/timeIcon.svg";
import sheetIcon from "static/images/sheetIcon.svg";
import moment from "moment";
// import pauseIcon from "static/images/pauseIcon.svg";
import mapPinIcon from "static/images/mapPinIcon.svg";
import carIcon from "static/images/carIcon.svg";
import hospitalIcon from "static/images/hospitalIcon.svg";
import IconButton from "@material-ui/core/IconButton";
import MoreIcon from "@material-ui/icons/MoreVert";
import type { ScheduleDayEvent } from "src/redux/modules/schedule/events";
import type { Category } from "src/redux/modules/categories";

type Props = {
  scheduleDayEvent: ?ScheduleDayEvent,
  categories: Array<Category>
};

export default class RightSidebar extends PureComponent<Props> {
  getLocationIcon = (locationType: string) => {
    switch (locationType) {
      case "main":
        return mapPinIcon;

      case "parking":
        return carIcon;

      case "hospital":
        return hospitalIcon;

      default:
        return mapPinIcon;
    }
  };

  render() {
    const { scheduleDayEvent, categories } = this.props;

    if (!scheduleDayEvent) return null;

    const { shooting_event, locations } = scheduleDayEvent;

    let title = scheduleDayEvent.title;
    let subtitle = "";
    let description = scheduleDayEvent.title;

    let elements = [];

    if (shooting_event) {
      const { code, set, name, summary } = shooting_event;

      title = `${code} ${set ? set.type : ""} ${set ? set.time_of_day : ""}`;
      subtitle = name;
      description = summary;

      elements = shooting_event.elements;
    }

    const time = moment(
      moment(scheduleDayEvent.calendar_end).diff(
        moment(scheduleDayEvent.calendar_start)
      )
    ).format("h:mm");

    return (
      <div className={css.rightSidebar}>
        {shooting_event && (
          <div className={css.header}>
            <div className={css.headerLeft}>
              <div className={css.headerTitle}>{title}</div>
              <div className={css.headerContent}>
                <div>{subtitle}</div>
                {description}
              </div>
            </div>
            <div className={css.headerRightBar}>
              <IconButton className={css.moreButton} aria-label="Delete">
                <MoreIcon />
              </IconButton>
            </div>
          </div>
        )}
        <div className={css.content}>
          <div className={css.topInfoContainer}>
            <div className={css.topItem}>
              <div className={css.iconContainer}>
                <img className={css.topItemImg} src={timeIcon} alt="" />
              </div>
              <div className={css.topItemContent}>
                <p className={css.topItemTitle}>Time</p>
                <div className={css.topItemInfo}>
                  {moment(scheduleDayEvent.calendar_start).format("h:mma")}
                </div>
              </div>
            </div>
            <div className={css.topItem}>
              <div className={`${css.iconContainer} ${css.nonIcon}`} />
              <div className={css.topItemContent}>
                <p className={css.topItemTitle}>Scheduled</p>
                <div className={css.topItemInfo}>{time}h</div>
              </div>
            </div>
            {/* <div className={css.topItem}>
              <div className={`${css.iconContainer} ${css.nonIcon}`} />
              <div className={css.topItemContent}>
                <p className={css.topItemTitle}>Estimate</p>
                <div className={css.topItemInfo}>{shooting_event && shooting_event.shot_goal}</div>
              </div>
            </div> */}
            <div className={css.topItem}>
              <div className={css.iconContainer}>
                <img
                  className={`${css.topItemImg} ${css.sheetIcon}`}
                  src={sheetIcon}
                  alt=""
                />
              </div>
              <div className={css.topItemContent}>
                <p className={css.topItemTitle}>Pages</p>
                <div className={css.topItemInfo}>
                  {shooting_event && shooting_event.pages}
                </div>
              </div>
            </div>
          </div>
          {/* <div className={css.timeTracking}>
            <div className={css.trHeader}>
              <p>TIME TRACKING</p>
              <img alt="" src={pauseIcon} />
            </div>
            <div className={css.trBottom}>
              <div className={css.trBottomText}>
                <p className={css.logged}>
                  <span>1h 23m</span> logged
                </p>
                <p className={css.remaining}>
                  remaining <span>17h 34m</span>
                </p>
              </div>
              <div className={css.barOut}>
                <div className={css.barIn} />
              </div>
            </div>
          </div> */}
          {/* <div className={css.shots}>
            <div className={css.shotsHeader}>
              <p className={css.shotsTitle}>PLANNED SHOTS</p>
              <p className={css.viewAll}>View All</p>
            </div>
            <div className={css.shotsContainer}>
              <div className={`${css.shot} ${css.active}`}>
                <p>A13</p>
              </div>
              <div className={`${css.shot} ${css.active}`}>
                <p>A13</p>
              </div>
              <div className={css.shot}>
                <p>A13</p>
              </div>
              <div className={css.shot}>
                <p>A13</p>
              </div>
              <div className={css.shot}>
                <p>A13</p>
              </div>
              <div className={css.shot}>
                <p>A13</p>
              </div>
              <div className={css.shot}>
                <p>A13</p>
              </div>
            </div>
          </div> */}
          <div className={css.locations}>
            <p className={css.lTitle}>LOCATIONS</p>
            <div className={css.locationInfo}>
              {locations.map(l => (
                <div className={css.location} key={l.location_id}>
                  <img src={this.getLocationIcon(l.location_type)} alt="" />
                  <div className={css.locationContent}>
                    <p className={css.locationTitle}>{l.location_name}</p>
                    <p className={css.locationDescription}>
                      {l.location_address}
                      <br />
                      {l.location_notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={css.requirement}>
            <div className={css.rHeader}>
              <p className={css.rTitle}>REQUIREMENTS</p>
              <p className={css.viewAll}>View All</p>
            </div>
            <div className={css.requirements}>
              {categories.map(c => {
                const categoryElements =
                  elements && elements.filter(e => e.category_id === c.id);

                return categoryElements && categoryElements.length ? (
                  <div className={css.category} key={c.id}>
                    <p className={css.reqTitle}>
                      {c.name} [{categoryElements.length}]
                    </p>
                    <ul className={css.reqContent}>
                      {categoryElements.map(e => (
                        <li className={css.reqItem} key={e.id}>
                          {e.related_id && (
                            <span
                              className={css.reqItemNumber}
                              style={{
                                backgroundColor: c.color // TO-DO: make a function to get the color
                              }}
                            >
                              {e.related_id}
                            </span>
                          )}
                          <span className={css.reqItemName}>{e.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

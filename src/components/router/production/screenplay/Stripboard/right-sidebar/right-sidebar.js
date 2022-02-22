// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from "react";
import cn from "classnames";
import get from "lodash/get";
import vars from "config/variables";
import imgDrag from "static/images/drag-black.svg";
import { type ScheduleDayEvent } from "src/redux/modules/schedule/events";
import { type CategoryWithElements } from "src/redux/modules/categories/selectors/getCategoriesWithElements";
import { type State as UIState } from "src/redux/modules/ui";
import { type State as ShootingEventsState } from "src/redux/modules/shooting/events";
import css from "./right-sidebar.style.css";

type Props = {
  currentDayEvent: ?ScheduleDayEvent,
  currentCategories: Array<CategoryWithElements>,
  stripboardSidebarMode: $PropertyType<UIState, "stripboardSidebarMode">,
  stripboardSearchResults: $PropertyType<
    ShootingEventsState,
    "stripboardSearchResults"
  >
};

export default class RightSidebar extends Component<Props> {
  static getAlternateElementId = (name: string): string =>
    name
      .split(" ")
      .map(word => word[0].toUpperCase())
      .join("");

  render() {
    const {
      stripboardSidebarMode,
      currentDayEvent,
      currentCategories,
      stripboardSearchResults
    } = this.props;

    if (stripboardSidebarMode === "none") return null;

    // SIDEBAR - SHOOTING EVENT DETAILS
    if (stripboardSidebarMode === "details" && currentDayEvent)
      return (
        <div className={css.sidebar}>
          <div
            className={css.sidebarTop}
            style={{ backgroundColor: vars.colorBeige }}
          >
            <div className={css.sidebarTopHeadline}>
              {get(currentDayEvent, "shooting_event.code", null)}
              &nbsp;
              {get(currentDayEvent, "shooting_event.set.type", null)}
              &nbsp;
              {get(currentDayEvent, "shooting_event.set.time_of_day", null)}
            </div>
            <div className={css.sidebarTopTitle}>
              {get(currentDayEvent, "shooting_event.name", null)}
            </div>
            <div className={css.sidebarTopSummary}>
              {get(currentDayEvent, "shooting_event.summary", null)}
            </div>
          </div>
          <div className={css.sidebarDetails}>
            <div className={css.sidebarSeparator} />

            <div className={css.sidebarGlance}>
              {get(currentDayEvent, "shooting_event.pages", null) ? (
                <div className={css.sidebarGlanceBlock}>
                  <div className={css.sidebarGlanceTitle}>Pages</div>
                  <div className={css.sidebarGlanceValue}>
                    {get(currentDayEvent, "shooting_event.pages", null)}
                  </div>
                </div>
              ) : null}

              {get(currentDayEvent, "shooting_event.duration_time", null) ? (
                <div className={css.sidebarGlanceBlock}>
                  <div className={css.sidebarGlanceTitle}>Est. Time</div>
                  <div className={css.sidebarGlanceValue}>
                    {get(currentDayEvent, "shooting_event.duration_time", null)}
                  </div>
                </div>
              ) : null}

              <div className={css.sidebarGlanceBlock}>
                <div className={css.sidebarGlanceTitle}>Story Day</div>
                <div className={css.sidebarGlanceValue}>D44</div>
              </div>
            </div>

            {currentCategories
              .filter(c => c.elements.length > 0)
              .map(category => (
                <React.Fragment key={category.id}>
                  <div className={css.sidebarSeparator} />

                  <div className={css.sidebarSection}>
                    <div className={css.sidebarSectionTitle}>
                      {`${category.name} (${category.elements.length})`}
                    </div>

                    {category.elements.map(element => (
                      <div key={element.id} className={css.sidebarSectionValue}>
                        <span
                          className={css.number}
                          style={{ backgroundColor: category.color }}
                        >
                          {element.related_id ||
                            RightSidebar.getAlternateElementId(element.name)}
                        </span>

                        {element.name}
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              ))}

            <div className={css.sidebarSeparator} />
          </div>
        </div>
      );
    if (stripboardSidebarMode === "search")
      return (
        <div className={css.sidebar}>
          <div className={css.search}>
            {stripboardSearchResults.length > 0 ? (
              stripboardSearchResults.map(result => (
                <div
                  key={result.id}
                  className={css.result}
                  style={{ borderColor: vars.colorLightBeige }}
                >
                  <div className={css.resultTop}>
                    <div
                      className={css.resultHandle}
                      style={{ backgroundColor: vars.colorLightBeige }}
                    >
                      <img alt="drag handle" src={imgDrag} />
                      {`${result.code} ${get(result, "set.type", "")} ${get(
                        result,
                        "set.time_of_day",
                        ""
                      )}`}
                    </div>

                    <div className={css.resultTime}>Mon 2/23</div>
                  </div>

                  <div className={css.resultTitle}>{result.name}</div>

                  <div className={css.resultSummary}>{result.summary}</div>

                  <div className={css.resultBottom}>
                    <div className={cn([css.resultBottomLeft, css.numbers])}>
                      <span className={css.number}>1</span>
                      <span className={css.number}>10</span>
                    </div>

                    <div className={css.resultBottomRight}>
                      <div className={css.resultPages}>{result.pages}</div>
                      <div className={css.resultDuration}>
                        {result.duration_time}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={css.noResults}>No search results</div>
            )}
          </div>
        </div>
      );

    return null;
  }
}

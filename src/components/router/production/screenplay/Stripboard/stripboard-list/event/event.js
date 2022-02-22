// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from "react";
import get from "lodash/get";
import cn from "classnames";
import Tooltip from "@material-ui/core/Tooltip";
import imgPin from "static/images/pin.svg";
import type { EventLocation } from "src/redux/modules/schedule/events";
import Color from "color";
import vars from "config/variables";
import css from "./event.style.css";
import type { Props } from "./";

class Event extends Component<Props> {
  static getLocationText = (l: EventLocation): string =>
    [l.location_name, l.location_address].filter(x => x).join(", ");

  getBackgroundColor = () => {
    const { colors, item } = this.props;
    if (!item) return "#6a6868";
    if (!item.set) return "#6a6868";

    const color = colors.find(
      c =>
        // $FlowFixMe
        c.set_type === item.set.type && c.set_timeofday === item.set.time_of_day
    );

    return color ? color.value : "#6a6868";
  };

  render() {
    const {
      item,
      connectDragSource,
      connectDropTarget,
      currentDayEvent,
      selectDayEvent,
      locations,
      id
    } = this.props;

    const color = this.getBackgroundColor();

    const extrasCount =
      item.elements &&
      item.elements.reduce((total, e) => {
        if (e.category_type === "extras") {
          return total + 1;
        }
        return total;
      }, 0);

    return connectDragSource(
      connectDropTarget(
        <div
          className={cn({
            [css.event]: true,
            [css.selected]:
              currentDayEvent && currentDayEvent.id === (id || item.id)
          })}
          role="button"
          tabIndex={-1}
          onClick={
            // TODO: performance fix! Create StripboardEvent sub
            // component that can handle and return the ID
            () => selectDayEvent(id || item.id, id || item.id)
          }
        >
          <div className={cn([css.ten, css.scene])}>
            <div
              className={css.sceneNum}
              style={{
                backgroundColor: color,
                color: Color(color).isLight()
                  ? vars.colorBlack
                  : vars.colorWhite
              }}
            >
              {item.code}
            </div>

            <div className={css.sceneType}>{get(item, "set.type", null)}</div>
          </div>

          <div className={css.thirty}>
            <div className={css.sceneTitle}>{item.name}</div>
            <div className={css.sceneDesc}>{item.summary}</div>
          </div>

          <div className={cn([css.five, css.dayType])}>
            {get(item, "set.time_of_day", null) ? (
              <Tooltip title={get(item, "set.time_of_day", null)}>
                <span>{get(item, "set.time_of_day", null)}</span>
              </Tooltip>
            ) : null}
          </div>
          <div className={cn([css.twenty, css.numbers])}>
            {item.elements &&
              item.elements.map(
                e =>
                  e.category_type === "cast" && (
                    <span className={css.number}>{e.display_id}</span>
                  )
              )}
          </div>
          <div className={css.five}>
            <span className={css.bg}>{extrasCount}</span>
          </div>

          <div className={cn([css.ten, css.locations])}>
            {locations && locations.length > 0 ? (
              <React.Fragment>
                <img alt="" src={imgPin} />
                <div className={css.location}>
                  {locations
                    // Looks like L1, L2, L3, etc.
                    .map((l, i) => (
                      <React.Fragment key={l.location_id}>
                        <Tooltip
                          key={l.location_id}
                          title={Event.getLocationText(l)}
                        >
                          <a
                            href={`https://maps.google.com/?q=${
                              l.location_address
                            }`}
                            target="_blank"
                            rel="noreferrer noopener"
                          >{`L${i + 1}`}</a>
                        </Tooltip>
                        {/* Add trailing comma if element is not the last */}
                        {locations.length !== i + 1 ? ", " : ""}
                      </React.Fragment>
                    ))}
                </div>
              </React.Fragment>
            ) : null}
          </div>
          <div className={cn([css.ten, css.numbers])}>
            {item.elements &&
              item.elements.map(
                e =>
                  e.category_type === "vehicles" && (
                    <span className={css.number}>{e.display_id}</span>
                  )
              )}
          </div>
          <div className={css.five}>
            <span className={css.pages}>{item.pages}</span>
          </div>

          <div className={css.five}>
            <span className={css.time}>{item.duration_time}</span>
          </div>
        </div>
      )
    );
  }
}

export default Event;

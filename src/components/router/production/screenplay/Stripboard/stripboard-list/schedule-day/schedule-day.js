// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from "react";
import cn from "classnames";
import moment from "moment";
import Event from "../event";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import imgLocked from "static/images/locked.svg";
import imgUnlocked from "static/images/unlocked.svg";
import imgCallSheet from "static/images/callSheet.svg";
import css from "./schedule-day.style.css";
import type { Props } from "./";

type State = {
  expanded: boolean
};
class Setup extends Component<Props, State> {
  state = {
    expanded: false
  };

  handleExpand = () => {
    this.setState(state => ({
      expanded: !state.expanded
    }));
  };

  render() {
    const {
      connectDropTarget,
      currentDayEvent,
      /* hovered, */
      day,
      selectDayEvent,
      colors
    } = this.props;
    // const { expanded } = this.state;

    return connectDropTarget(
      <div>
        <ExpansionPanel
          defaultExpanded={
            day.schedule_day_events && day.schedule_day_events.length > 0
          }
          // expanded={expanded || hovered}
          key={day.id}
          classes={{
            root: css.expansionRoot
          }}
        >
          <ExpansionPanelSummary
            className={css.summary}
            classes={{
              content: css.summaryContent,
              expanded: css.summaryExpanded
            }}
            expandIcon={<ExpandMoreIcon />}
          >
            <div className={css.forty}>
              <span className={css.date}>
                {moment(day.calendar_date).format("dddd M/D/YY")}
              </span>
              <span className={css.dayOf}>Day {day.shooting_day}</span>
            </div>

            <div className={css.five}>
              {day.locked ? (
                <img alt="locked" src={imgLocked} />
              ) : (
                <img alt="unlocked" src={imgUnlocked} />
              )}
              <img alt="callsheet" src={imgCallSheet} />
            </div>

            {/* CAST */}
            {/* TODO: Get after backend refactor around ELEMENTS */}
            <div className={cn([css.twenty, css.numbers])}>
              {/*
                <span className={css.number}>1</span>
                <span className={css.number}>10</span>
                <span className={css.number}>32</span>
                <span className={css.number}>62</span>
                <span className={css.number}>82</span>
              */}
            </div>

            {/* TODO: Get after backend refactor around ELEMENTS */}
            <div className={css.five}>
              {/*
                <span className={css.bg}>24</span>
              */}
            </div>

            <div className={css.ten}>
              {/*
                <img alt="" src={imgPin} />
                <span className={css.location}>A1, A2</span>
              */}
            </div>

            {/* TODO: Get after backend refactor around ELEMENTS */}
            <div className={cn([css.ten, css.numbers])}>
              {/*
                <span className={css.number}>62</span>
                <span className={css.number}>82</span>
              */}
            </div>

            <div className={css.five}>
              {/*
                <span className={css.pages}>5 4/8</span>
              */}
            </div>

            <div className={css.five}>
              <span className={css.time}>
                {moment(day.call_time).format("hh:mm")}
              </span>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails
            classes={{
              root: css.detailsRoot
            }}
          >
            {day.schedule_day_events &&
              day.schedule_day_events.map(
                ({ id, locations, shooting_event: sEvent }) =>
                  sEvent && (
                    <Event
                      key={id}
                      item={sEvent}
                      id={id}
                      currentDayEvent={currentDayEvent}
                      selectDayEvent={selectDayEvent}
                      locations={locations}
                      colors={colors}
                    />
                  )
              )}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default Setup;

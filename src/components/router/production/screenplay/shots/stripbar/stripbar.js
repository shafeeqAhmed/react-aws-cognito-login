// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { type Node, Component } from "react";
import { get } from "lodash";
import ContentEditable from "react-contenteditable";
// import LocationIcon from "@material-ui/icons/LocationOn";
import ContextMenu from "./contextmenu";
import classNames from "classnames";
import css from "./stripbar.style.css";
import { CategoryTypes } from "src/redux/modules/screenplay";
import type { Props } from "./";

type State = {
  descriptionFocused: boolean,
  anchorEl: ?Node
};

export default class StripBar extends Component<Props, State> {
  state = {
    descriptionFocused: false,
    anchorEl: null
  };

  handleDescriptionFocus = () => {
    this.setState({
      descriptionFocused: true
    });
  };

  handleDescriptionBlur = () => {
    this.setState({
      descriptionFocused: false
    });
  };

  handleKeyDown = (e: SyntheticKeyboardEvent<*>) => {
    if (e.keyCode === 13) e.preventDefault();
  };

  handleChange = (e: SyntheticInputEvent<>, field: string) => {
    console.log("change", field, get(e, "target.value", ""));
  };

  render() {
    const { shootingEvent } = this.props;
    const castIds = get(shootingEvent, "elements", [])
      .filter(e => e.type === CategoryTypes.CAST)
      .map(e => e.relatedId);

    const { descriptionFocused } = this.state;

    return (
      <div className={css.container}>
        <span className={css.sceneCode}>
          {get(shootingEvent, "code", "A13")}
        </span>
        <ContentEditable
          html={get(shootingEvent, "set.type", "EXT")}
          onChange={e => this.handleChange(e, "site")}
          tagName="span"
          className={classNames(css.editable, css.site)}
        />
        <span
          className={classNames({
            [css.descriptionContainer]: true,
            [css.descriptionFocused]: descriptionFocused
          })}
        >
          <ContentEditable
            html={get(
              shootingEvent,
              "set.name",
              get(shootingEvent, "name", "Mr Roger’s Neighborhood")
            )}
            onChange={e => this.handleChange(e, "name")}
            onFocus={this.handleDescriptionFocus}
            onBlur={this.handleDescriptionBlur}
            onKeyDown={this.handleKeyDown}
            tagName="span"
            className={classNames(css.editable, css.sceneName)}
          />
          <ContentEditable
            html={get(
              shootingEvent,
              "summary",
              "Stuart performs on a humble, spotlit…"
            )}
            onChange={e => this.handleChange(e, "summary")}
            onFocus={this.handleDescriptionFocus}
            onBlur={this.handleDescriptionBlur}
            onKeyDown={this.handleKeyDown}
            tagName="span"
            className={classNames(css.editable, css.sceneDescription)}
          />
        </span>
        <ContentEditable
          html={get(shootingEvent, "set.timeOfDay", "NIGHT")}
          onChange={e => this.handleChange(e, "timeOfDay")}
          tagName="span"
          className={classNames(css.editable, css.timeOfDay)}
        />
        <span className={css.castContainer}>
          {castIds.map(id => (
            <div className={css.cast} key={id}>
              <span>{id}</span>
            </div>
          ))}
          {castIds.length === 0 && [
            <div className={css.cast} key={1}>
              <span>{1}</span>
            </div>,
            <div className={css.cast} key={12}>
              <span>{12}</span>
            </div>
          ]}
        </span>
        <ContentEditable
          html={get(shootingEvent, "pages", "2/8")}
          onChange={e => this.handleChange(e, "pages")}
          tagName="span"
          className={classNames(css.editable, css.pages)}
        />
        <ContentEditable
          html={
            get(shootingEvent, "durationTimeOverride", "5:00")
              ? get(shootingEvent, "durationTimeOverride", "5:00")
              : get(shootingEvent, "durationTime", "5:00")
          }
          onChange={e => this.handleChange(e, "time")}
          tagName="span"
          className={classNames(css.editable, css.time)}
        />
        <span className={css.menuIconContainer}>
          <ContextMenu />
        </span>
      </div>
    );
  }
}

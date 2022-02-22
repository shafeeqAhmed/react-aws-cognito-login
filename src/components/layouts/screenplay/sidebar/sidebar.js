// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import Button from "@material-ui/core/Button";
import imgPenIconOff from "static/images/penOff.svg";
import imgPenIconOn from "static/images/penOn.svg";
import imgBreakdownOff from "static/images/breakdownOff.svg";
import imgBreakdownOn from "static/images/breakdownOn.svg";
import imgCallsheetOff from "static/images/callsheetOff.svg";
import imgCallsheetOn from "static/images/callsheetOn.svg";
import imgShotsOff from "static/images/shotsOff.svg";
import imgShotsOn from "static/images/shotsOn.svg";
import imgStripboardOff from "static/images/stripboardOff.svg";
import imgStripboardOn from "static/images/stripboardOn.svg";
import UserAvatar from "src/components/shared/UserAvatar";
import img from "src/styles/images.css";
import css from "./sidebar.style.css";
import { type Props } from "./";

type State = {||};

export default class SideBar extends PureComponent<Props, State> {
  goToEditor = () => this.props.history.push(`${this.props.match.url}/edit`);
  goToBreakdown = () =>
    this.props.history.push(`${this.props.match.url}/breakdown`);
  goToStripboard = () =>
    this.props.history.push(`${this.props.match.url}/stripboard`);
  goToSchedule = () =>
    this.props.history.push(`${this.props.match.url}/callsheet`);
  goToShots = () => this.props.history.push(`${this.props.match.url}/shots`);

  render() {
    const { currentUser } = this.props;

    // TODO: probably a better way to switch between icons?
    const editorIcon = this.props.location.pathname.endsWith("/edit")
      ? imgPenIconOn
      : imgPenIconOff;
    const breakdownIcon = this.props.location.pathname.endsWith("/breakdown")
      ? imgBreakdownOn
      : imgBreakdownOff;
    const shotsIcon = this.props.location.pathname.endsWith("/shots")
      ? imgShotsOn
      : imgShotsOff;
    const stripboardIcon = this.props.location.pathname.endsWith("/stripboard")
      ? imgStripboardOn
      : imgStripboardOff;
    const callsheetIcon =
      this.props.location.pathname.indexOf("/callsheet/") !== -1
        ? imgCallsheetOn
        : imgCallsheetOff;

    return (
      <div className={css.sideBar}>
        <div className={css.tools}>
          <div className={css.sideBarTools}>
            <Button
              title="Script Editor"
              className={css.button}
              onClick={this.goToEditor}
            >
              <img alt="" className={css.img} src={editorIcon} />
            </Button>

            <Button className={css.button} onClick={this.goToBreakdown}>
              <img alt="" className={css.img} src={breakdownIcon} />
            </Button>
            <Button className={css.button} onClick={this.goToShots}>
              <img alt="" className={css.img} src={shotsIcon} />
            </Button>
            <Button
              title="Call Sheet"
              className={css.button}
              onClick={this.goToStripboard}
            >
              <img alt="" className={css.img} src={stripboardIcon} />
            </Button>
            <Button
              title="Shooting Schedule"
              className={css.button}
              onClick={this.goToSchedule}
            >
              <img alt="" className={css.img} src={callsheetIcon} />
            </Button>
          </div>
        </div>
        <div className={css.bottomTools}>
          <button className={css.buttonMarginDown} onClick={this.props.logout}>
            <UserAvatar user={currentUser} style={{ color: "#ffffff" }} />
          </button>
        </div>
      </div>
    );
  }
}

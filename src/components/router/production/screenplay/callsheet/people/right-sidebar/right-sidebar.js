// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import css from "./right-sidebar.style.css";
import DonutChart from "react-svg-donut-chart";
import {
  colorPeacockBlue,
  colorSquash,
  colorEmerald,
  colorLightBlueCerulean
} from "config/variables";
import addBlueIcon from "static/images/plus-button-blue.svg";
import imgCallsheetOff from "static/images/callsheetOff.svg";
import type { ReduxProps } from "./";

type Props = ReduxProps & {};

export default class RightSidebar extends PureComponent<Props> {
  chartColors = {
    blue: colorPeacockBlue,
    green: colorEmerald,
    yellow: colorSquash,
    lightBlue: colorLightBlueCerulean
  };

  getChartData = () => {
    const { people } = this.props;
    return people.map(p => ({
      value: p.value,
      stroke: this.chartColors[p.color],
      strokeWidth: 4
    }));
  };
  render() {
    const { people, contacts } = this.props;

    return (
      <div className={css.rightSidebar}>
        <div className={css.header}>
          <div className={css.sectionTitle}>Today’s Check-Ins</div>
          <div className={css.chart}>
            <DonutChart data={this.getChartData()} />
            <div className={css.chartText}>
              <div className={css.chartNumber}>101</div>
              <div className={css.chartSubtitle}>Check-Ins</div>
            </div>
          </div>
          <ul className={css.headerList}>
            {people.map(p => (
              <li key={p.title} className={css.headerItem}>
                <span
                  className={css.dot}
                  style={{
                    backgroundColor: this.chartColors[p.color]
                  }}
                />
                <span className={css.itemTitle}>{p.title}</span>
                <span className={css.itemValues}>
                  {p.value}/{p.total}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className={css.contacts}>
          <div className={css.sectionTitle}>PRODUCTION CONTACTS</div>
          <ul className={css.contactsList}>
            {contacts.map(c => (
              <li className={css.contact}>
                <div className={css.contactRole}>{c.role}</div>
                <div className={css.contactInfo}>
                  <span className={css.contactName}>{c.name}</span>
                  <span className={css.contactNumber}>{c.number}</span>
                </div>
              </li>
            ))}
          </ul>
          <button className={css.addContactButton}>
            <img src={addBlueIcon} alt="+" className={css.addContactIcon} />
            <span className={css.addContactText}>Add Contact</span>
          </button>
        </div>
        <div className={css.confirmations}>
          <div className={css.confirmationsTitle}>
            <img
              src={imgCallsheetOff}
              alt="callsheet"
              className={css.addContactIcon}
            />
            <span>Confirmations</span>
          </div>
          <div className={css.barOut}>
            <div className={css.barIn} />
          </div>
          <div className={css.confirmationsFooter}>
            12 of 34 team members pending
          </div>
        </div>
      </div>
    );
  }
}

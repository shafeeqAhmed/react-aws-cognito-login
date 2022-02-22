// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { type Node, PureComponent } from "react";
import css from "./people.style.css";
import RightSidebar from "./right-sidebar";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import {
  colorGreenApple,
  colorOrangeRoughy,
  colorGreyBoulder
} from "config/variables";
import classNames from "classnames";
import type { Props } from "./";

type Status = {
  departmentEl: Node,
  statusEl: Node
};

export default class People extends PureComponent<Props, Status> {
  statusStyles = {
    bounced: {
      title: "Bounced!",
      color: colorOrangeRoughy,
      normalWeight: false
    },
    checkedIn: {
      title: "Checked-In",
      color: colorGreenApple,
      normalWeight: true
    },
    unviewed: {
      title: "Unviewed",
      color: colorGreyBoulder,
      normalWeight: false
    },
    confirmed: {
      title: "Confirmed",
      color: colorGreyBoulder,
      normalWeight: true
    },
    viewed: {
      title: "Viewed",
      color: colorGreyBoulder,
      normalWeight: false
    },
    late: {
      title: "Late",
      color: colorGreenApple,
      normalWeight: true
    }
  };

  state = {
    departmentEl: null,
    statusEl: null
  };

  handleClick = (event: SyntheticEvent<HTMLButtonElement>, element: string) => {
    this.setState({
      [element]: event.currentTarget
    });
  };

  handleClose = (element: string) => {
    this.setState({
      [element]: null
    });
  };

  render() {
    const { statusEl, departmentEl } = this.state;
    const { primaryTalent } = this.props;

    return (
      <div className={css.container}>
        <div className={css.content}>
          <div className={css.header}>
            <h2>Primary Talent</h2>
            <div className={css.filters}>
              <div className={css.filterContainer}>
                <div className={css.filterName}>Department</div>
                <Button
                  aria-owns={departmentEl ? "department-filter" : null}
                  aria-haspopup="true"
                  onClick={e => this.handleClick(e, "departmentEl")}
                  classes={{
                    root: css.filterButton,
                    label: css.filterButtonLabel
                  }}
                >
                  All
                  <ArrowDownIcon classes={{ root: css.arrowIcon }} />
                </Button>
                <Menu
                  id="department-filter"
                  anchorEl={departmentEl}
                  open={Boolean(departmentEl)}
                  onClose={() => this.handleClose("departmentEl")}
                >
                  <MenuItem onClick={() => this.handleClose("departmentEl")}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => this.handleClose("departmentEl")}>
                    My account
                  </MenuItem>
                  <MenuItem onClick={() => this.handleClose("departmentEl")}>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
              <div className={css.filterContainer}>
                <div className={css.filterName}>Status</div>
                <Button
                  aria-owns={statusEl ? "status-filter" : null}
                  aria-haspopup="true"
                  onClick={e => this.handleClick(e, "statusEl")}
                  classes={{
                    root: css.filterButton,
                    label: css.filterButtonLabel
                  }}
                >
                  All
                  <ArrowDownIcon classes={{ root: css.arrowIcon }} />
                </Button>
                <Menu
                  id="department-filter"
                  anchorEl={statusEl}
                  open={Boolean(statusEl)}
                  onClose={() => this.handleClose("statusEl")}
                >
                  <MenuItem onClick={() => this.handleClose("statusEl")}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => this.handleClose("statusEl")}>
                    My account
                  </MenuItem>
                  <MenuItem onClick={() => this.handleClose("statusEl")}>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </div>
          <table className={css.table}>
            <thead>
              <tr>
                <th className={css.related} />
                <th className={css.actor}>Actor</th>
                <th className={css.role}>Role</th>
                <th className={css.pickup}>Pickup</th>
                <th className={css.makeup}>Makeup</th>
                <th className={css.callTime}>Call Time</th>
                <th className={css.notes}>Notes</th>
                <th className={css.status}>Status</th>
              </tr>
            </thead>
            <tbody>
              {primaryTalent.map(p => {
                const statusStyle = this.statusStyles[p.status];

                return (
                  <tr
                    className={classNames({
                      [css.late]: p.status === "late"
                    })}
                  >
                    <td className={css.related}>
                      <span>{p.relatedId}</span>
                    </td>
                    <td className={css.actor}>{p.actor}</td>
                    <td className={css.role}>{p.role}</td>
                    <td className={css.pickup}>{p.pickup}</td>
                    <td className={css.makeup}>{p.makeup}</td>
                    <td className={css.callTime}>{p.callTime}</td>
                    <td className={css.notes}>{p.notes}</td>
                    <td
                      className={css.status}
                      style={{
                        color: statusStyle.color,
                        fontWeight: statusStyle.normalWeight
                          ? "normal"
                          : undefined
                      }}
                    >
                      {statusStyle.title}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className={css.header}>
            <h2>Wardrobe</h2>
          </div>

          <table className={css.table}>
            <thead>
              <tr>
                <th className={css.related} />
                <th className={css.actor}>Actor</th>
                <th className={css.role}>Role</th>
                <th className={css.callTime}>Call Time</th>
                <th className={css.notes}>Notes</th>
                <th className={css.status}>Status</th>
              </tr>
            </thead>
            <tbody>
              {primaryTalent.map(p => {
                const statusStyle = this.statusStyles[p.status];

                return (
                  <tr
                    className={classNames({
                      late: p.status === "late"
                    })}
                  >
                    <td className={css.related}>
                      <span>{p.relatedId}</span>
                    </td>
                    <td className={css.actor}>{p.actor}</td>
                    <td className={css.role}>{p.role}</td>
                    <td className={css.callTime}>{p.callTime}</td>
                    <td className={css.notes}>{p.notes}</td>
                    <td
                      className={css.status}
                      style={{
                        color: statusStyle.color,
                        fontWeight: statusStyle.normalWeight
                          ? "normal"
                          : undefined
                      }}
                    >
                      {statusStyle.title}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={css.rightSidebar}>
          <RightSidebar />
        </div>
      </div>
    );
  }
}

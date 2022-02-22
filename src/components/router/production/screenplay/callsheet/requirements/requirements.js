// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { type Node, PureComponent } from "react";
import css from "./requirements.style.css";
import RightSidebar from "./right-sidebar";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import type { Props } from "./";

type Status = {
  categoryEl: Node,
  statusEl: Node
};

export default class Requirements extends PureComponent<Props, Status> {
  state = {
    categoryEl: null,
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
    const { statusEl, categoryEl } = this.state;
    const { requirements, bulletins } = this.props;

    return (
      <div className={css.container}>
        <div className={css.content}>
          <div className={css.header}>
            <h2>Vehicles</h2>
            <div className={css.filters}>
              <div className={css.filterContainer}>
                <div className={css.filterName}>Category</div>
                <Button
                  aria-owns={categoryEl ? "category-filter" : null}
                  aria-haspopup="true"
                  onClick={e => this.handleClick(e, "categoryEl")}
                  classes={{
                    root: css.filterButton,
                    label: css.filterButtonLabel
                  }}
                >
                  All
                  <ArrowDownIcon classes={{ root: css.arrowIcon }} />
                </Button>
                <Menu
                  id="category-filter"
                  anchorEl={categoryEl}
                  open={Boolean(categoryEl)}
                  onClose={() => this.handleClose("categoryEl")}
                >
                  <MenuItem onClick={() => this.handleClose("categoryEl")}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => this.handleClose("categoryEl")}>
                    My account
                  </MenuItem>
                  <MenuItem onClick={() => this.handleClose("categoryEl")}>
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
                <th className={css.item}>Item</th>
                <th className={css.supplier}>Supplier</th>
                <th className={css.callTime}>Call Time</th>
                <th className={css.notes}>Notes</th>
                <th className={css.status}>Status</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map(r => (
                <tr>
                  <td className={css.related}>
                    <span>{r.relatedId}</span>
                  </td>
                  <td className={css.item}>{r.item}</td>
                  <td className={css.supplier}>{r.supplier}</td>
                  <td className={css.callTime}>{r.callTime}</td>
                  <td className={css.notes}>{r.notes}</td>
                  <td className={css.status}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={css.header}>
            <h2>Props</h2>
          </div>

          <table className={css.table}>
            <thead>
              <tr>
                <th className={css.related} />
                <th className={css.item}>Item</th>
                <th className={css.supplier}>Supplier</th>
                <th className={css.callTime}>Call Time</th>
                <th className={css.notes}>Notes</th>
                <th className={css.status}>Status</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map(p => (
                <tr>
                  <td className={css.related}>
                    <span>{p.relatedId}</span>
                  </td>
                  <td className={css.item}>{p.item}</td>
                  <td className={css.supplier}>{p.supplier}</td>
                  <td className={css.callTime}>{p.callTime}</td>
                  <td className={css.notes}>{p.notes}</td>
                  <td className={css.status}>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={css.rightSidebar}>
          <RightSidebar bulletins={bulletins} />
        </div>
      </div>
    );
  }
}

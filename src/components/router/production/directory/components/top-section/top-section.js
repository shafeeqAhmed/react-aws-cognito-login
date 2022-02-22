// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { type Node, PureComponent } from "react";
import css from "./top-section.style.css";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import FilterIcon from "static/images/filterIcon.svg";
import ArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ClearIcon from "static/images/close-sm.svg";
import Input from "@material-ui/core/Input";

import type { Props } from "./";

type State = {
  filterAnchorEl: Node,
  departmentAnchorEl: Node,
  statusAnchorEl: Node,
  productionTag1AnchorEl: Node,
  productionTag2AnchorEl: Node
};

export default class TopSection extends PureComponent<Props, State> {
  state = {
    filterAnchorEl: null,
    departmentAnchorEl: null,
    statusAnchorEl: null,
    productionTag1AnchorEl: null,
    productionTag2AnchorEl: null
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
    const { sectionName } = this.props;
    const {
      filterAnchorEl,
      departmentAnchorEl,
      statusAnchorEl,
      productionTag1AnchorEl,
      productionTag2AnchorEl
    } = this.state;

    return (
      <div className={css.topSection}>
        <div className={css.title}>
          Dogs of War: {sectionName}
          <span className={css.showingText}>
            Showing <span className={css.showingNumber}>20</span> out of 141
            roles
          </span>
        </div>
        <div className={css.filters}>
          <Button
            aria-owns={filterAnchorEl ? "filter" : null}
            aria-haspopup="true"
            onClick={e => this.handleClick(e, "filterAnchorEl")}
            classes={{
              root: css.filterButton
            }}
          >
            <img src={FilterIcon} className={css.filterIcon} alt={"Filter"} />
            <ArrowDownIcon classes={{ root: css.arrowIcon }} />
          </Button>
          <Menu
            id="filter"
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={() => this.handleClose("filterAnchorEl")}
          >
            <MenuItem onClick={() => this.handleClose("filterAnchorEl")}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => this.handleClose("filterAnchorEl")}>
              My account
            </MenuItem>
            <MenuItem onClick={() => this.handleClose("filterAnchorEl")}>
              Logout
            </MenuItem>
          </Menu>
          <Input
            value={"STRING"}
            classes={{
              input: css.input
            }}
            placeholder="Search Script"
            disableUnderline
          />
          <div className={css.filterContainer}>
            <div className={css.filterName}>Department</div>
            <Button
              aria-owns={departmentAnchorEl ? "department-filter" : null}
              aria-haspopup="true"
              onClick={e => this.handleClick(e, "departmentAnchorEl")}
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
              anchorEl={departmentAnchorEl}
              open={Boolean(departmentAnchorEl)}
              onClose={() => this.handleClose("departmentAnchorEl")}
            >
              <MenuItem onClick={() => this.handleClose("departmentAnchorEl")}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => this.handleClose("departmentAnchorEl")}>
                My account
              </MenuItem>
              <MenuItem onClick={() => this.handleClose("departmentAnchorEl")}>
                Logout
              </MenuItem>
            </Menu>
          </div>
          <div className={css.filterContainer}>
            <div className={css.filterName}>Status</div>
            <Button
              aria-owns={statusAnchorEl ? "status-filter" : null}
              aria-haspopup="true"
              onClick={e => this.handleClick(e, "statusAnchorEl")}
              classes={{
                root: css.filterButton,
                label: css.filterButtonLabel
              }}
            >
              All
              <ArrowDownIcon classes={{ root: css.arrowIcon }} />
            </Button>
            <Menu
              id="status-filter"
              anchorEl={statusAnchorEl}
              open={Boolean(statusAnchorEl)}
              onClose={() => this.handleClose("statusAnchorEl")}
            >
              <MenuItem onClick={() => this.handleClose("statusAnchorEl")}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => this.handleClose("statusAnchorEl")}>
                My account
              </MenuItem>
              <MenuItem onClick={() => this.handleClose("statusAnchorEl")}>
                Logout
              </MenuItem>
            </Menu>
          </div>
          <div className={css.filterContainer}>
            <div className={css.filterName}>Production Tag</div>
            <Button
              aria-owns={
                productionTag1AnchorEl ? "production-tag1-filter" : null
              }
              aria-haspopup="true"
              onClick={e => this.handleClick(e, "productionTag1AnchorEl")}
              classes={{
                root: css.filterButton,
                label: css.filterButtonLabel
              }}
            >
              All
              <ArrowDownIcon classes={{ root: css.arrowIcon }} />
            </Button>
            <Menu
              id="production-tag1-filter"
              anchorEl={productionTag1AnchorEl}
              open={Boolean(productionTag1AnchorEl)}
              onClose={() => this.handleClose("productionTag1AnchorEl")}
            >
              <MenuItem
                onClick={() => this.handleClose("productionTag1AnchorEl")}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => this.handleClose("productionTag1AnchorEl")}
              >
                My account
              </MenuItem>
              <MenuItem
                onClick={() => this.handleClose("productionTag1AnchorEl")}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
          <div className={css.filterContainer}>
            <div className={css.filterName}>Production Tag</div>
            <Button
              aria-owns={
                productionTag2AnchorEl ? "production-tag2-filter" : null
              }
              aria-haspopup="true"
              onClick={e => this.handleClick(e, "productionTag2AnchorEl")}
              classes={{
                root: css.filterButton,
                label: css.filterButtonLabel
              }}
            >
              All
              <ArrowDownIcon classes={{ root: css.arrowIcon }} />
            </Button>
            <Menu
              id="production-tag2-filter"
              anchorEl={productionTag2AnchorEl}
              open={Boolean(productionTag2AnchorEl)}
              onClose={() => this.handleClose("productionTag2AnchorEl")}
            >
              <MenuItem
                onClick={() => this.handleClose("productionTag2AnchorEl")}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => this.handleClose("productionTag2AnchorEl")}
              >
                My account
              </MenuItem>
              <MenuItem
                onClick={() => this.handleClose("productionTag2AnchorEl")}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
          <button className={css.clearButtonContainer}>
            <img src={ClearIcon} alt="Clear" />
          </button>
          <div className={css.newRoleButtonContainer}>
            <Button
              classes={{
                root: css.newRoleButton,
                label: css.newRoleLabel
              }}
            >
              New Role
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

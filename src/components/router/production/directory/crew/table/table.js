// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import SortableList from "./sortable-list";
import SortIcon from "static/images/sort.svg";
import css from "./table.style.css";

import type { Props } from "./";

type State = {};

export default class Table extends PureComponent<Props, State> {
  render() {
    const { list, columns, collections } = this.props;

    return (
      <div className={css.tableContainer}>
        <div className={css.tableHead}>
          <span style={{ width: "6%" }} />
          <span style={{ width: "5.5%" }}>
            <img src={SortIcon} alt="sort" />No.
          </span>
          <span style={{ width: "17%" }}>
            <img src={SortIcon} alt="sort" />Role
          </span>
          <span style={{ width: "26.5%" }}>
            <img src={SortIcon} alt="sort" />Name
          </span>
          <span style={{ width: "9%" }}>
            <img src={SortIcon} alt="sort" />Status
          </span>
          <span style={{ width: "7%" }}>
            <img src={SortIcon} alt="sort" />Days
          </span>
          <span style={{ width: "29%" }}>
            <img src={SortIcon} alt="sort" />Production Tags
          </span>
        </div>
        <SortableList
          items={list}
          columns={columns}
          collections={collections}
          itemHeight={50}
          helperClass={"style.stylizedHelper"}
          useDragHandle
          lockAxis="y"
        />
      </div>
    );
  }
}

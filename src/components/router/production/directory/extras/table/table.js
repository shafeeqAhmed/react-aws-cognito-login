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
          <span style={{ width: "4.5%" }} />
          <span style={{ width: "3.5%" }}>
            <img src={SortIcon} alt="sort" />No.
          </span>
          <span style={{ width: "16%" }}>
            <img src={SortIcon} alt="sort" />Role
          </span>
          <span style={{ width: "17%" }}>
            <img src={SortIcon} alt="sort" />People
          </span>
          <span style={{ width: "5.5%" }}>
            <img src={SortIcon} alt="sort" />Ages
          </span>
          <span style={{ width: "5%" }}>
            <img src={SortIcon} alt="sort" />Race
          </span>
          <span style={{ width: "6.5%" }}>
            <img src={SortIcon} alt="sort" />Gender
          </span>
          <span style={{ width: "17%" }}>
            <img src={SortIcon} alt="sort" />Other Scenes
          </span>
          <span style={{ width: "25%" }}>
            <img src={SortIcon} alt="sort" />Character & Tags
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

// @flow
/* eslint-disable react/no-multi-comp */
import React, { Component, Fragment } from "react";
import { SortableContainer } from "react-sortable-hoc";
import SortableItem from "../sortable-item";
import TableDivider from "../../../components/table-divider";
import AddNewIcon from "static/images/add-green-white.svg";
import css from "./sortable-list.style.css";

type Props = {
  +items: Array<Object>,
  +collections: Array<Object>
};

class SortableList extends Component<Props> {
  renderDivider = (collection: number) => {
    const { collections } = this.props;
    return (
      // $FlowFixMe
      <TableDivider collectionName={collections[collection]} counter={5} />
    );
  };

  renderNewDepartment = () => (
    <div className={css.newDepartment}>
      <button className={css.newDepartmentButton}>
        <span className={css.newDepartmentText}>NEW DEPARTMENT</span>
        <img src={AddNewIcon} alt="+" />
      </button>
    </div>
  );

  renderItems = () => {
    const { items } = this.props;

    let lastCollection = null;

    return items.map((item, index) => {
      if (lastCollection !== item.collection) {
        lastCollection = item.collection;

        return (
          <Fragment key={item.id}>
            {this.renderDivider(item.collection)}
            <SortableItem
              key={item.id}
              index={index}
              user={item}
              collection={item.collection}
            />
          </Fragment>
        );
      }

      return (
        <SortableItem
          key={item.id}
          index={index}
          user={item}
          collection={item.collection}
        />
      );
    });
  };
  render() {
    return (
      <div>
        {this.renderItems()}
        {this.renderNewDepartment()}
      </div>
    );
  }
}

export default SortableContainer(SortableList);

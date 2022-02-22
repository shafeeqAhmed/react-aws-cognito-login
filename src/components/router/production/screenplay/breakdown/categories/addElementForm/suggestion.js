// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import { get } from "lodash";
import MenuItem from "@material-ui/core/MenuItem";
import { type Element, type RelatedObject } from "src/redux/modules/elements";
import css from "./addElementForm.style.css";

export default class Suggestion extends PureComponent<{
  item: $Shape<{ ...Element }> | RelatedObject,
  index: number,
  itemProps: Object,
  highlightedIndex: number,
  selectedItem: ?$Shape<{ ...Element }>
}> {
  render() {
    const {
      item,
      index,
      itemProps,
      highlightedIndex,
      selectedItem
    } = this.props;
    const isHighlighted = highlightedIndex === index;
    const isSelected = get(selectedItem, "id", "") === item.id;
    const isNew = !item.id;

    return (
      <MenuItem
        {...itemProps}
        key={item.id}
        selected={isHighlighted}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400
        }}
      >
        <span className={css.elementName}>
          {isNew && `Add "`}
          {item.name}
          {isNew && `"`}
        </span>
      </MenuItem>
    );
  }
}

// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import { get } from "lodash";
import Suggestion from "./suggestion";
import {
  type Element,
  type RelatedObject,
  type Search
} from "src/redux/modules/elements";
import css from "./addElementForm.style.css";

type OwnProps = {|
  +getItemProps: Function,
  +selectedItem: Element,
  +highlightedIndex: number,
  +inputValue: string
|};

type StateProps = {|
  +search: Search
|};

type Props = OwnProps & StateProps;

class Suggestions extends PureComponent<Props> {
  render() {
    const {
      search,
      getItemProps,
      selectedItem,
      highlightedIndex,
      inputValue
    } = this.props;

    const list = [
      ...get(search, "list", []).map(i => ({ ...i, __typename: "element" })),
      ...get(search, "related", []).map(i => ({ ...i, __typename: "related" }))
    ];

    const suggestions = list.map(
      (item: Element | RelatedObject, index: number) => (
        <Suggestion
          key={item.id}
          item={item}
          index={index}
          itemProps={getItemProps({ item, key: item.id })}
          highlightedIndex={highlightedIndex}
          selectedItem={selectedItem}
        />
      )
    );

    const exactMatch = search.list.find(
      e => e.name.toLowerCase() === inputValue.toLowerCase()
    );

    if (inputValue && !exactMatch) {
      suggestions.push(
        <Suggestion
          key="add_new"
          item={{ id: "", name: inputValue, __typename: "element" }}
          index={get(search, "list", []).length}
          itemProps={getItemProps({
            item: { id: "", name: inputValue, __typename: "element" },
            key: "new_element"
          })}
          highlightedIndex={highlightedIndex}
          selectedItem={selectedItem}
        />
      );
    }

    return (
      <Paper className={css.paper} square>
        {suggestions}
      </Paper>
    );
  }
}

const mapStateToProps = (state: RootReducerState): StateProps => {
  const search = get(state, "elements.search", {});

  return {
    search
  };
};

export default connect(mapStateToProps, {})(Suggestions);

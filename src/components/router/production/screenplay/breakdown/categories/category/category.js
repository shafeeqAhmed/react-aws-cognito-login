/* eslint-disable import/no-extraneous-dependencies */
// @flow
import React, { PureComponent } from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ElementComponent from "../element";
import AddElementForm from "../addElementForm";
import css from "./category.style.css";
import { type Props } from "./";

type State = {|
  expanded: boolean
|};

export default class Category extends PureComponent<Props, State> {
  state: State = {
    expanded: false
  };

  onChangeExpand = () => {
    this.setState((state: State) => ({
      expanded: !state.expanded
    }));
  };

  render() {
    const { category, removeElementAnchors, toggleElementAnchor } = this.props;
    const { expanded } = this.state;

    return (
      <ExpansionPanel
        expanded={expanded}
        onChange={this.onChangeExpand}
        classes={{
          root: css.categoryContainer,
          expanded: css.panelExpanded
        }}
        key={category.id}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          classes={{
            expanded: css.expanded,
            content: css.titleContainer,
            root: css.titleRoot,
            expandIcon: css.titleIcon
          }}
        >
          <span
            className={css.categoryDot}
            style={{ backgroundColor: category.color }}
          />
          <span className={css.categoryTitle}>
            {category.name}{" "}
            {category.elements ? `(${category.elements.length})` : ""}
          </span>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails
          classes={{
            root: css.elementsContainer
          }}
        >
          <div className={css.elementsContainer}>
            {category.elements.map(element => (
              <ElementComponent
                key={element.id}
                element={element}
                category={category}
                toggleAnchor={toggleElementAnchor}
                removeAnchors={removeElementAnchors}
              />
            ))}
            <AddElementForm
              category={category}
              toggleAnchor={toggleElementAnchor}
            />
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

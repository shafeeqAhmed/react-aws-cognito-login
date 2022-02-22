/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent, createRef } from "react";
import { get } from "lodash";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import TextField from "@material-ui/core/TextField";
import Downshift from "downshift";
import classNames from "classnames";
import addItemLightIcon from "static/images/new-scene-light.svg";
import addItemBlueIcon from "static/images/anchor-add.svg";
import { type Props } from "./";
import { type Element, type RelatedObject } from "src/redux/modules/elements";
import Suggestions from "./suggestions";
import css from "./addElementForm.style.css";

type State = {|
  inputValue: string,
  isFocused: boolean
|};

export default class AddElementForm extends PureComponent<Props, State> {
  state: State = {
    inputValue: "",
    isFocused: false
  };

  inputRef: any = createRef();

  onClickIcon = () => {
    const el = get(this.inputRef, "current");

    if (el) {
      el.focus();
    }
  };

  closeSuggestions = () => {
    this.setState({ inputValue: "" });
  };

  // called when the query value changes
  onStateChange = (change: { type: string, inputValue?: string }) => {
    const { inputValue = "", type } = change;
    const { category, match, searchElements } = this.props;
    const { productionId } = match.params;

    if (type !== Downshift.stateChangeTypes.changeInput) return;

    this.setState({ inputValue });

    searchElements({
      productionId,
      categoryId: category.id,
      name: inputValue
    });
  };

  // called when user selects a suggestion.
  onChange = async (selectedItem: Element | RelatedObject | null) => {
    const {
      category,
      createElement,
      linkToShootingEvent,
      match,
      shootingEvent,
      toggleAnchor
    } = this.props;
    const { productionId } = match.params;

    if (!shootingEvent || !selectedItem) {
      // TODO: show error message?
      return;
    }

    let elementId: ?string;

    // create and link a new element
    if (!selectedItem.id) {
      const res = await createElement({
        productionId,
        name: selectedItem.name,
        categoryId: category.id,
        shootingEventId: shootingEvent.id,
        quantity: 1
      });

      elementId = get(res, "action.payload.data.id", "");
    } else {
      switch (selectedItem.__typename) {
        // link an existing element
        case "element":
          linkToShootingEvent({
            productionId,
            elementId: selectedItem.id,
            shootingEventId: shootingEvent.id,
            quantity: 1
          });

          elementId = selectedItem.id;
          break;

        // create and link a new element for an existing related object
        case "related": {
          const res = await createElement({
            productionId,
            relatedId: selectedItem.id,
            name: selectedItem.name,
            categoryId: category.id,
            shootingEventId: shootingEvent.id,
            quantity: 1
          });

          elementId = get(res, "action.payload.data.id", "");
          break;
        }

        default:
          break;
      }
    }

    if (elementId) {
      toggleAnchor(elementId, category.color);
    }

    this.closeSuggestions();
  };

  onFocus = (e: SyntheticEvent<HTMLInputElement>) => {
    this.setState({
      isFocused: true
    });
  };

  onBlur = (e: SyntheticEvent<HTMLInputElement>) => {
    this.setState({
      isFocused: false
    });
  };

  isOpen = () => {
    const selection = get(this.props, "cursor.selections[0]", "");
    const { inputValue, isFocused } = this.state;

    if (!isFocused) return false;
    return !!(selection || inputValue);
  };

  inputValue = () => {
    const selection = get(this.props, "cursor.selections[0]", "");
    const { inputValue: stateValue, isFocused } = this.state;

    if (!isFocused) return "";
    return stateValue || selection || "";
  };

  selection = () => get(this.props, "cursor.selections[0]", "");

  icon = () => {
    if (this.selection() || this.inputValue() || this.state.isFocused) {
      return addItemBlueIcon;
    }

    return addItemLightIcon;
  };

  placeholder = () =>
    this.selection() ? `Add "${this.selection()}"` : "Add item...";

  render() {
    const { isFocused } = this.state;

    return (
      <ClickAwayListener onClickAway={this.closeSuggestions}>
        <Downshift
          id="search-downshift"
          itemToString={() => this.state.inputValue}
          onStateChange={this.onStateChange} // value changed
          onChange={this.onChange} // item selected
          selectedItem={null}
          inputValue={this.inputValue()}
          isOpen={this.isOpen()}
        >
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            isOpen,
            inputValue,
            selectedItem,
            highlightedIndex
          }) => (
            <div className={css.downshift}>
              <div
                className={classNames({
                  [css.inputContainer]: true,
                  [css.focused]: isFocused
                })}
              >
                <div className={css.iconContainer}>
                  <img
                    src={this.icon()}
                    alt="new element"
                    className={this.selection() ? css.blueIcon : css.icon}
                    onClick={this.onClickIcon}
                  />
                </div>

                <TextField
                  InputProps={getInputProps({
                    disableUnderline: true,
                    classes: {
                      root: css.inputRoot,
                      input: css.input
                    },
                    onBlur: this.onBlur,
                    onFocus: this.onFocus
                  })}
                  autoFocus
                  fullWidth={false}
                  placeholder={this.placeholder()}
                  value={inputValue}
                  style={{ width: "73%" }}
                  inputRef={this.inputRef}
                />
              </div>

              <div {...getMenuProps()} className={css.menu}>
                {isOpen ? (
                  <Suggestions
                    getItemProps={getItemProps}
                    selectedItem={selectedItem}
                    highlightedIndex={highlightedIndex}
                    inputValue={inputValue}
                  />
                ) : null}
              </div>
            </div>
          )}
        </Downshift>
      </ClickAwayListener>
    );
  }
}

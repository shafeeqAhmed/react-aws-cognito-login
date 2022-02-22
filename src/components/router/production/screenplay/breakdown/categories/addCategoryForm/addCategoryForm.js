/* eslint-disable import/no-extraneous-dependencies */
// @flow
import React, { createRef, PureComponent } from "react";
import { get } from "lodash";
import randomColor from "randomcolor";
import classNames from "classnames";
import Input from "@material-ui/core/Input";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { type Props } from "./";
import css from "./addCategoryForm.style.css";
import plusGreyIcon from "static/images/new-scene-light.svg";
import plusBlueIcon from "static/images/anchor-add.svg";

type State = {|
  addingCategory: boolean,
  newCategoryName: string
|};

export default class AddCategoryForm extends PureComponent<Props, State> {
  state: State = {
    addingCategory: false,
    newCategoryName: ""
  };

  inputRef: any = createRef();

  onClickIcon = () => {
    const el = get(this.inputRef, "current");

    if (el) {
      el.focus();
    }
  };

  onFocusInput = () => {
    this.setState({
      addingCategory: true
    });
  };

  onBlurInput = () => {
    this.setState({
      addingCategory: false
    });
  };

  onChangeInput = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const newCategoryName = get(e, "target.value", "");
    this.setState({ newCategoryName });
  };

  onKeyPressInput = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    const newCategoryName = get(e, "target.value");
    const { match, createCategory } = this.props;
    const { productionId } = match.params;

    if (e.key === "Enter") {
      createCategory({
        productionId,
        name: newCategoryName,
        color: randomColor()
      });

      this.setState({ newCategoryName: "", addingCategory: false });
    }
  };

  render() {
    const { addingCategory, newCategoryName } = this.state;

    return (
      <div
        className={classNames({
          [css.container]: true,
          [css.focused]: addingCategory
        })}
      >
        <span className={css.icon}>
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <img
            src={addingCategory ? plusBlueIcon : plusGreyIcon}
            alt="+"
            onClick={this.onClickIcon}
          />
        </span>
        <span className={css.title}>
          <Input
            fullWidth
            disableUnderline
            placeholder="ADD CATEGORY"
            classes={{
              root: css.inputRoot,
              input: css.input
            }}
            className={css.input}
            value={newCategoryName}
            onFocus={this.onFocusInput}
            onBlur={this.onBlurInput}
            onChange={this.onChangeInput}
            onKeyPress={this.onKeyPressInput}
            inputRef={this.inputRef}
          />
        </span>
        {!addingCategory && <ExpandMoreIcon className={css.chevronIcon} />}
      </div>
    );
  }
}

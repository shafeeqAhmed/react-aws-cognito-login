/* eslint-disable import/no-extraneous-dependencies */
// @flow
import React, { PureComponent } from "react";
import { debounce, get } from "lodash";
import classNames from "classnames";
import Input from "@material-ui/core/Input";
// import ContentEditable from "react-contenteditable";
import Button from "@material-ui/core/Button";
import anchorIcon from "static/images/anchor.svg";
import anchorAddIcon from "static/images/anchor-add.svg";
import anchorRemoveIcon from "static/images/anchor-remove.svg";
import css from "./element.style.css";
import { type Props } from "./";

type State = {|
  +isHovered: boolean,
  +isQuantityEditable: boolean,
  +quantityPlaceholder: string
|};

export default class Element extends PureComponent<Props, State> {
  isQuantityFocused: boolean = false;

  state: State = {
    isHovered: false,
    isQuantityEditable: false,
    quantityPlaceholder: "#"
  };

  constructor(props: Props) {
    super(props);

    this.doChangeQuantity = debounce(this.doChangeQuantity, 250);
  }

  onChangeQuantity = (e: SyntheticEvent<HTMLInputElement>) => {
    const val = get(e, "target.value", "0");
    if (isNaN(val)) return;

    const qty = parseInt(val, 10);
    if (!qty) return;

    this.doChangeQuantity(qty);
  };

  doChangeQuantity = (qty: number) => {
    const { element, linkToShootingEvent, match, shootingEvent } = this.props;
    const { productionId } = match.params;

    if (!shootingEvent || !productionId) return;

    linkToShootingEvent({
      productionId,
      elementId: element.id,
      shootingEventId: shootingEvent.id,
      quantity: qty
    });
  };

  // onKeyPressQuantity = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") this.onChangeQuantity(e);
  // };

  onFocusQuantity = (e: SyntheticEvent<HTMLInputElement>) => {
    this.isQuantityFocused = true;
    this.setState({ quantityPlaceholder: "" });
  };

  onBlurQuantity = (e: SyntheticEvent<HTMLInputElement>) => {
    this.isQuantityFocused = false;
    this.setState({ isQuantityEditable: false, quantityPlaceholder: "#" });
  };

  onMouseEnter = (e: SyntheticMouseEvent<HTMLElement>) => {
    this.setState({ isHovered: true, isQuantityEditable: true });
  };

  onMouseLeave = (e: SyntheticMouseEvent<HTMLElement>) => {
    this.setState({
      isHovered: false,
      isQuantityEditable: !!this.isQuantityFocused
    });
  };

  onClickAddAnchor = (e: SyntheticEvent<HTMLElement>) => {
    const { category, element, toggleAnchor } = this.props;
    toggleAnchor(element.id, category.color);
  };

  onClickRemoveAnchor = (e: SyntheticEvent<HTMLElement>) => {
    if (this.isAnchored()) {
      const {
        category,
        element,
        isTextSelected,
        selectedAnchor,
        toggleAnchor,
        removeAnchors
      } = this.props;

      if (isTextSelected && selectedAnchor === element.id) {
        toggleAnchor(element.id, category.color);
      } else {
        removeAnchors(element.id);
      }
    }
  };

  onClickRemove = (e: SyntheticEvent<HTMLElement>) => {
    const {
      element,
      match,
      shootingEvent,
      unlinkFromShootingEvent
    } = this.props;

    const { productionId } = match.params;

    this.onClickRemoveAnchor(e);

    unlinkFromShootingEvent({
      productionId,
      elementId: element.id,
      shootingEventId: shootingEvent.id
    });
  };

  isAnchored = () =>
    !!this.props.element.shootingevents_scenes.some(
      ses => ses.shootingevent_id === this.props.shootingEvent.id
    );

  canAddAnchor = () => this.props.isTextSelected && !this.props.selectedAnchor;

  canRemoveAnchor = () =>
    this.isAnchored() &&
    (this.state.isHovered ||
      (this.props.isTextSelected &&
        this.props.selectedAnchor === this.props.element.id));

  renderIcon = () => {
    if (this.canAddAnchor()) {
      return (
        // TODO(@olivoil): respect jsx-ally rule
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <img
          src={anchorAddIcon}
          alt="add anchor"
          className={css.anchorAddIcon}
          onClick={this.onClickAddAnchor}
        />
      );
    } else if (this.canRemoveAnchor()) {
      return (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <img
          src={anchorRemoveIcon}
          alt="remove anchor"
          className={css.anchorRemoveIcon}
          onClick={this.onClickRemoveAnchor}
        />
      );
    }

    return this.isAnchored() ? (
      <img src={anchorIcon} alt="anchor" className={css.anchorIcon} />
    ) : null;
  };

  render() {
    const { element, quantity } = this.props;
    const { isHovered, isQuantityEditable, quantityPlaceholder } = this.state;

    const canRemove =
      !this.canAddAnchor() &&
      (this.canRemoveAnchor() || isHovered || isQuantityEditable);

    return (
      <div
        className={css.element}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <div
          className={classNames(
            css.anchorContainer,
            canRemove ? css.anchorContainerHovered : ""
          )}
        >
          {this.renderIcon()}
        </div>

        <span
          className={classNames(css.title, canRemove ? css.titleHovered : "")}
        >
          {element.name}
        </span>

        <Button
          classes={{
            root: classNames(
              css.removeButtonRoot,
              canRemove ? css.removeButtonRootHovered : ""
            )
          }}
          variant="text"
          onClick={this.onClickRemove}
        >
          remove
        </Button>

        <Input
          type="number"
          classes={{
            root: classNames(
              css.quantityInputRoot,
              isQuantityEditable ? "" : css.quantityDisabled,
              quantity <= 1 && !isQuantityEditable ? css.quantityHidden : ""
            ),
            input: classNames(
              css.quantityInput,
              isQuantityEditable ? "" : css.quantityDisabled
            )
          }}
          defaultValue={quantity > 1 ? quantity : ""}
          disabled={!isQuantityEditable}
          placeholder={quantityPlaceholder}
          margin="none"
          disableUnderline
          onChange={this.onChangeQuantity}
          onFocus={this.onFocusQuantity}
          onBlur={this.onBlurQuantity}
        />
      </div>
    );
  }
}

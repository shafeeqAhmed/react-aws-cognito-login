// @flow
/* eslint import/no-extraneous-dependencies: 0 */
/* eslint-disable import/no-unresolved */

import React, { PureComponent, type Node, type ElementRef } from "react";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
// $FlowFixMe
import ClearIcon from "@material-ui/icons/Clear";
// $FlowFixMe
import SearchIcon from "@material-ui/icons/Search";
// $FlowFixMe
import NextIcon from "@material-ui/icons/NavigateNext";
// $FlowFixMe
import PrevIcon from "@material-ui/icons/NavigateBefore";
// $FlowFixMe
import MoreIcon from "@material-ui/icons/MoreHoriz";
// $FlowFixMe
import ReplaceIcon from "@material-ui/icons/Done";
// $FlowFixMe
import ReplaceAllIcon from "@material-ui/icons/DoneAll";
import { grey } from "@material-ui/core/colors";
import classNames from "classnames";
import { isBrowser } from "config/env";
import css from "./searchbar.style.css";

type Props = {
  closeIcon: Node,
  searchIcon: Node,
  prevIcon: Node,
  nextIcon: Node,
  moreIcon: Node,
  replaceIcon: Node,
  replaceAllIcon: Node,
  disabled: boolean,
  placeholder: string,
  onRequestSearch: Function,
  value: string,
  onRequestReplacement?: Function,
  onClear?: Function,
  onFocus?: Function,
  onBlur?: Function,
  onChange?: Function,
  onKeyUp?: Function,
  onMount?: Function,
  inputProps?: Object,
  searchPosition?: ?[number, number]
};

type State = {
  focus: boolean,
  value: string,
  replacement: string,
  active: boolean,
  expanded: boolean
};

export default class SearchBar extends PureComponent<Props, State> {
  input: ?HTMLInputElement;

  static defaultProps = {
    style: {},
    closeIcon: <ClearIcon style={{ color: grey[500] }} />,
    searchIcon: <SearchIcon style={{ color: grey[500] }} />,
    prevIcon: <PrevIcon style={{ color: grey[500] }} />,
    nextIcon: <NextIcon style={{ color: grey[500] }} />,
    moreIcon: <MoreIcon style={{ color: grey[500] }} />,
    replaceIcon: <ReplaceIcon style={{ color: grey[500] }} />,
    replaceAllIcon: <ReplaceAllIcon style={{ color: grey[500] }} />,
    disabled: false,
    placeholder: "Search",
    value: ""
  };

  state = {
    focus: false,
    value: this.props.value || "",
    replacement: "",
    active: false,
    expanded: false
  };

  componentDidMount = () => {
    if (isBrowser()) {
      // eslint-disable-next-line global-require
      const CM = require("codemirror");
      window.CM = CM;
    }
    if (window.CM) {
      window.CM.commands.find = cm => {
        this.select().focus();
      };
    }
  };

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.value !== nextProps.value) {
      this.setState({ ...this.state, value: nextProps.value });
    }
  }

  select() {
    this.input && this.input.current.select();
    return this;
  }

  focus() {
    this.input && this.input.current.focus();
    return this;
  }

  expand() {
    this.setState({
      expanded: true
    });
    return this;
  }

  collapse() {
    this.setState({
      expanded: false
    });
    return this;
  }

  handleFocus = (e: SyntheticEvent<>) => {
    this.setState({ focus: true });
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  };

  handleBlur = (e: SyntheticEvent<>) => {
    this.setState({ focus: false });
    if (this.state.value.trim().length === 0) {
      this.setState({ value: "" });
      if (this.props.onClear) {
        this.props.onClear();
      }
    }
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  };

  handleInput = (e: SyntheticEvent<HTMLInputElement>) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;

    const value = target.value;
    if (value.trim().length === 0) {
      this.setState({ active: false, value: "" });
      if (this.props.onClear) {
        this.props.onClear();
      }
    } else {
      this.setState({ value });
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  };

  handleReplaceInput = (e: SyntheticEvent<HTMLInputElement>) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;

    const replacement = target.value;
    this.setState({ replacement });
  };

  handleReplace = (e: SyntheticEvent<>) => {
    const { value, replacement } = this.state;
    if (this.props.onRequestReplacement) {
      this.props.onRequestReplacement(value, replacement, false);
    }
  };

  handleReplaceAll = (e: SyntheticEvent<>) => {
    const { value, replacement } = this.state;
    if (this.props.onRequestReplacement) {
      this.props.onRequestReplacement(value, replacement, true);
    }
  };

  handleCancel = () => {
    this.setState({ active: false, value: "", expanded: false });
    if (this.props.onClear) {
      this.props.onClear();
    }
  };

  handleKeyUp = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.charCode === 13) {
      this.setState({ active: true });
      this.props.onRequestSearch(this.state.value, e);
    }
    if (this.props.onKeyUp) {
      this.props.onKeyUp(e);
    }
  };

  handleSearchNext = (e: SyntheticMouseEvent<>) => {
    this.setState({ active: true });
    this.props.onRequestSearch(this.state.value, { shiftKey: false });
  };

  handleSearchPrev = (e: SyntheticMouseEvent<>) => {
    this.setState({ active: true });
    this.props.onRequestSearch(this.state.value, { shiftKey: true });
  };

  handleMore = (e: SyntheticMouseEvent<>) => {
    this.state.expanded ? this.collapse() : this.expand();
  };

  input = React.createRef();
  input: ElementRef<"input">;

  render() {
    const { active, value, replacement, expanded } = this.state;
    const {
      disabled,
      closeIcon,
      nextIcon,
      prevIcon,
      moreIcon,
      searchIcon,
      replaceIcon,
      replaceAllIcon,
      inputProps,
      searchPosition,
      placeholder
    } = this.props;

    let elevation = 0;
    if (this.state.expanded) {
      elevation = 4;
    } else if (this.state.focus) elevation = 2;

    const inputStyle = {
      fontSize: "0.875rem"
    };

    return (
      <Paper
        classes={{
          root: classNames(css.root, {
            [css.rootExpanded]: !!expanded
          })
        }}
        style={{
          display: "flex",
          maxWidth: "350px",
          margin: "0 auto",
          marginLeft: "10px",
          marginRight: "20px",
          border: "1px solid rgba(0, 0, 0, 0.25)"
        }}
        elevation={elevation}
      >
        <div className={css.searchContainer}>
          <Input
            {...inputProps}
            onBlur={this.handleBlur}
            value={value}
            onChange={this.handleInput}
            onKeyUp={this.handleKeyUp}
            onFocus={this.handleFocus}
            fullWidth
            placeholder={placeholder}
            disableUnderline
            disabled={disabled}
            inputRef={this.input}
            style={inputStyle}
          />
          {active && (
            <span className={css.searchPosition}>
              {searchPosition
                ? `${searchPosition[0]} / ${searchPosition[1]}`
                : `no result`}
            </span>
          )}
          <IconButton
            classes={{
              root: classNames(css.iconButton, css.searchIconButton, {
                [css.iconButtonHidden]: value !== "" || expanded
              }),
              disabled: css.iconButtonDisabled
            }}
            disabled={disabled}
          >
            {React.cloneElement(searchIcon, {
              classes: { root: css.icon }
            })}
          </IconButton>
          <IconButton
            onClick={this.handleSearchPrev}
            classes={{
              root: classNames(css.iconButton, {
                [css.iconButtonHidden]: value === ""
              }),
              disabled: css.iconButtonDisabled
            }}
            disabled={disabled}
          >
            {React.cloneElement(prevIcon, {
              classes: { root: css.icon }
            })}
          </IconButton>
          <IconButton
            onClick={this.handleSearchNext}
            classes={{
              root: classNames(css.iconButton, {
                [css.iconButtonHidden]: value === ""
              }),
              disabled: css.iconButtonDisabled
            }}
            disabled={disabled}
          >
            {React.cloneElement(nextIcon, {
              classes: { root: css.icon }
            })}
          </IconButton>
          <IconButton
            onClick={this.handleMore}
            classes={{
              root: classNames(css.iconButton, {
                [css.iconButtonHidden]: value === ""
              }),
              disabled: css.iconButtonDisabled
            }}
            disabled={disabled}
          >
            {React.cloneElement(moreIcon, {
              classes: { root: css.icon }
            })}
          </IconButton>
          <IconButton
            onClick={this.handleCancel}
            classes={{
              root: classNames(css.iconButton, {
                [css.iconButtonHidden]: value === "" && !expanded
              }),
              disabled: css.iconButtonDisabled
            }}
            disabled={disabled}
          >
            {React.cloneElement(closeIcon, {
              classes: { root: css.icon }
            })}
          </IconButton>
        </div>
        <div
          className={classNames(
            css.replaceContainer,
            expanded ? "" : css.replaceContainerHidden
          )}
        >
          <Input
            {...inputProps}
            value={replacement}
            onChange={this.handleReplaceInput}
            fullWidth
            disableUnderline
            placeholder="replace with..."
            disabled={disabled}
            style={inputStyle}
          />
          <IconButton
            onClick={this.handleReplace}
            classes={{
              root: classNames(css.iconButton, {
                [css.iconButtonHidden]: !expanded
              }),
              disabled: css.iconButtonDisabled
            }}
            disabled={disabled}
          >
            {React.cloneElement(replaceIcon, {
              classes: { root: css.icon }
            })}
          </IconButton>
          <IconButton
            onClick={this.handleReplaceAll}
            classes={{
              root: classNames(css.iconButton, {
                [css.iconButtonHidden]: !expanded
              }),
              disabled: css.iconButtonDisabled
            }}
            disabled={disabled}
          >
            {React.cloneElement(replaceAllIcon, {
              classes: { root: css.icon }
            })}
          </IconButton>
        </div>
      </Paper>
    );
  }
}

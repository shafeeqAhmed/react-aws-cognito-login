/* eslint-disable import/no-extraneous-dependencies */
// @flow
import React, { PureComponent } from "react";
// import { get } from 'lodash';
import Toolbar from "@material-ui/core/Toolbar";
import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";
import cx from "classnames";
import css from "./toolbar.style.css";
import type { Props } from "./";

type State = {|
  searchFocused: boolean
|};

export default class DirectoryToolbar extends PureComponent<Props, State> {
  state: State = {
    searchFocused: false
  };

  onFocusSearch = (e: Event) => {
    this.setState({
      searchFocused: true
    });
  };

  onBlurSearch = (e: Event) => {
    this.setState({
      searchFocused: false
    });
  };

  onClickNew = (e: Event) => {
    if (this.props.onClickNew) {
      this.props.onClickNew();
    }
  };

  render() {
    // const name = get(this.props, 'search.request.name', '');
    const {
      search: {
        request: { name = "" }
      }
      // searchElements,
    } = this.props;
    const { searchFocused } = this.state;

    return (
      <Toolbar classes={{ root: css.toolbar }}>
        <div
          className={cx({
            [css.search]: true,
            [css.searchFocus]: !!searchFocused || !!name
          })}
        >
          <InputBase
            placeholder="Search…"
            classes={{
              root: css.searchInputRoot,
              input: css.searchInputInput
            }}
            onFocus={this.onFocusSearch}
            onBlur={this.onBlurSearch}
          />
        </div>

        <div className={css.grow} />

        <Button
          variant="contained"
          color="primary"
          onClick={this.onClickNew}
          classes={{
            root: css.newButton,
            label: css.newButtonLabel
          }}
        >
          New
        </Button>
      </Toolbar>
    );
  }
}

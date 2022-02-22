// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { Field } from "redux-form";
import { type Props } from "./";
import css from "./StripboardSearchBar.style.css";

type State = {};

// For performance optimization, PureComponent is better than stateless
export default class StripboardSearchBar extends React.PureComponent<
  Props,
  State
> {
  onSubmit = (e: Event) => {
    const { handleSubmit } = this.props;
    this.input.current && this.input.current.getRenderedComponent().select();
    return handleSubmit(e);
  };

  input = React.createRef();

  render() {
    return (
      <form className={css.form} onSubmit={this.onSubmit}>
        <Field
          withRef
          ref={this.input}
          name="query"
          component="input"
          placeholder="Search Scenes"
          type="text"
          maxLength="128"
          className={css.input}
        />
      </form>
    );
  }
}

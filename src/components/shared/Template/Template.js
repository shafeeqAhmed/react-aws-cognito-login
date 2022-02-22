// @flow
import React from "react";
import { type Props } from "./";
import css from "./Template.style.css";

type State = {};

// For performance optimization, PureComponent is better than stateless
export default class Template extends React.PureComponent<Props, State> {
  render() {
    return (
      <div className={css.template}>
        This is the url: <br />
        Test
      </div>
    );
  }
}

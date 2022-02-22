// @flow
import React, { PureComponent } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import LinearProgress from "@material-ui/core/LinearProgress";
import css from "./LoadingIndicator.style.css";
import { type Props } from "./";

class LoadingIndicator extends PureComponent<Props> {
  render() {
    const { weAreLoading } = this.props;

    if (!weAreLoading) return null;

    return (
      <LinearProgress
        classes={{
          colorPrimary: css.colorPrimary,
          barColorPrimary: css.barColorPrimary
        }}
        className={css.loading}
      />
    );
  }
}

export default LoadingIndicator;

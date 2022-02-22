// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

type Props = {
  id: string,
  meta: {
    touched: boolean,
    error: boolean
  },
  label: ?string,
  fullWidth: ?boolean,
  input: Object,
  startAdornment: Object,
  style: Object,
  errorClassName: string,
  classes: Object
};

class TextField extends PureComponent<Props> {
  props: Props;
  input: HTMLElement;

  render() {
    /* eslint-disable no-unused-vars */
    const {
      id,
      meta: { touched, error },
      label,
      fullWidth,
      input,
      startAdornment,
      style,
      errorClassName,
      classes,
      ...props
    } = this.props;
    /* eslint-enable */

    return (
      <FormControl
        error={touched && !!error}
        fullWidth={fullWidth || undefined}
        aria-describedby={`${id}-error-text`}
      >
        {label && <InputLabel htmlFor={`${id}`}>{label}</InputLabel>}
        <Input
          id={`${id}`}
          startAdornment={startAdornment}
          style={style}
          classes={classes}
          {...input}
        />
        <FormHelperText
          id={`${id}-error-text`}
          classes={{
            root: errorClassName
          }}
        >
          {touched && error}
        </FormHelperText>
      </FormControl>
    );
  }
}

export default TextField;

// @flow
import React, { PureComponent } from "react";
import MuiTextField from "material-ui/TextField";
import $ from "config/variables";

type Props = {
  input: Object,
  style: Object,
  label: string,
  labelColor: string,
  textTransform: string,
  meta: Object,
  color: string,
  customStyles: Object,
  dispatch: Function,
  underlineStyle: ?string,
  underlineFocusStyle: ?string,
  hintStyle: ?Object,
  hintText: ?string,
  fullWidth: ?boolean,
  type: string,
  placeholder: string,
  labelStyle: Object,
  errorStyle: Object
};

// http://redux-form.com/6.4.3/examples/material-ui/
class TextField extends PureComponent<Props> {
  getInputNode = () => this.input;

  // TODO: watch for resolution of
  // https://github.com/yannickcr/eslint-plugin-react/issues/1376
  props: Props;
  input: HTMLElement;

  render() {
    /* eslint-disable no-unused-vars */
    const {
      input,
      label,
      labelColor,
      customStyles,
      style,
      color,
      textTransform,
      meta: { touched, error },
      dispatch,
      underlineStyle,
      underlineFocusStyle,
      hintStyle,
      hintText,
      fullWidth,
      type,
      placeholder,
      labelStyle,
      errorStyle,
      ...props
    } = this.props;
    /* eslint-enable */

    const customStyle = {
      width: "100%",
      textTransform: textTransform || "none",
      color,
      ...style
    };

    // http://www.material-ui.com/#/components/text-field
    return (
      <MuiTextField
        ref={ref => {
          this.input = ref;
        }}
        errorText={touched && error}
        floatingLabelText={label}
        floatingLabelStyle={{
          color: labelColor,
          fontWeight: 300,
          fontSize: "14px",
          ...labelStyle
        }}
        floatingLabelShrinkStyle={{
          color: labelColor || $.colorGray
        }}
        floatingLabelFocusStyle={{
          color: labelColor || $.colorGray
        }}
        underlineStyle={{
          borderColor: underlineStyle || $.colorGray
        }}
        underlineFocusStyle={{
          borderColor: underlineFocusStyle || $.colorGray
        }}
        inputStyle={customStyle}
        errorStyle={{
          position: "absolute",
          bottom: "-.7em",
          ...errorStyle
        }}
        fullWidth={fullWidth}
        hintText={hintText || ""}
        hintStyle={hintStyle || {}}
        type={type || "text"}
        placeholder={placeholder || ""}
        {...customStyles}
        {...input}
      />
    );
  }
}

export default TextField;

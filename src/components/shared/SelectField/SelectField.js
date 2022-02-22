// @flow
import React from "react";
import SelectFieldComponent from "material-ui/SelectField";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
// import css from './SelectField.style.css'
import $ from "config/variables";

type Props = {
  input: Object,
  color: string,
  label: string,
  labelColor: string,
  meta: Object,
  children: any,
  hintStyle: Object,
  underlineStyle: ?string,
  underlineFocusStyle: ?string,
  placeholder: string,
  fullWidth: ?boolean,
  labelStyle: Object,
  style: Object
};

export default function SelectField(props: Props) {
  const {
    input,
    color,
    label,
    labelColor,
    hintStyle,
    placeholder,
    underlineStyle,
    underlineFocusStyle,
    meta: { touched, error },
    children,
    labelStyle,
    style,
    fullWidth
  } = props;

  const muiTheme = getMuiTheme(
    {},
    {
      palette: {
        textColor: color || $.colorDark
      }
    }
  );

  return (
    <MuiThemeProvider muiTheme={muiTheme}>
      <SelectFieldComponent
        hintText={placeholder}
        hintStyle={hintStyle}
        errorStyle={{
          position: "absolute",
          bottom: "-.7em"
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
          color: labelColor,
          ...labelStyle
        }}
        floatingLabelFocusStyle={{
          color: $.colorGray,
          ...labelStyle
        }}
        underlineStyle={{
          borderColor: underlineStyle || $.colorGray
        }}
        underlineFocusStyle={{
          borderColor: underlineFocusStyle || $.colorGray
        }}
        onChange={(event, index, value) => {
          input.onChange(value);
        }}
        iconStyle={{ color: color || $.colorDark }}
        labelselectedstyle={color}
        selectedMenuItemStyle={{
          color: $.colorGray
        }}
        fullWidth={fullWidth}
        value={input.value}
        menuItemStyle={{
          color: $.colorDark
        }}
        style={style}
      >
        {children}
      </SelectFieldComponent>
    </MuiThemeProvider>
  );
}

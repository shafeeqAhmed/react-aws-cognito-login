// @flow
import React, { PureComponent } from "react";
import moment from "moment";
import DatePicker from "material-ui/DatePicker";
import css from "./DatePicker.style.css";
import $ from "config/variables";

type Props = {
  input: Object,
  color: string,
  label: string,
  autoOk: boolean,
  labelColor: string,
  fullWidth: boolean,
  underlineStyle: ?Object,
  underlineFocusStyle: ?Object,
  /* eslint-disable-next-line */
  shouldDisableDate?: Function
};

class CustomDatePicker extends PureComponent<Props> {
  disableNextDates = () => (date: any) => Date.parse(date) > moment().toDate();

  props: Props;

  render(): ?React$Element<any> {
    const {
      input,
      color,
      label,
      labelColor,
      underlineStyle,
      fullWidth,
      autoOk = true,
      underlineFocusStyle,
      shouldDisableDate
    } = this.props;

    return (
      <DatePicker
        id={input.name}
        floatingLabelText={label}
        floatingLabelStyle={{
          color: labelColor,
          fontWeight: 300,
          fontSize: "14px"
        }}
        floatingLabelShrinkStyle={{
          color: $.colorGray
        }}
        floatingLabelFocusStyle={{
          color: $.colorGray
        }}
        autoOk={autoOk}
        shouldDisableDate={shouldDisableDate || this.disableNextDates()}
        value={input.value ? moment(input.value).toDate() : {}}
        formatDate={date => moment(date).format("YYYY-MM-DD")}
        inputStyle={{
          color: color || $.colorDark,
          width: "100%"
        }}
        className={css.datePicker}
        underlineShow
        underlineStyle={
          underlineStyle || {
            borderColor: $.colorGray
          }
        }
        underlineFocusStyle={
          underlineFocusStyle || {
            borderColor: $.colorGray
          }
        }
        errorStyle={{
          position: "absolute",
          bottom: "-.7em"
        }}
        fullWidth={fullWidth}
        onChange={(e, val) => input.onChange(val)}
      />
    );
  }
}

export default CustomDatePicker;

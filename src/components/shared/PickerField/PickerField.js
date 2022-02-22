// @flow
import React from "react";
import css from "./PickerField.style.css";

type Props = {
  input: Object,
  label: string,
  children: any,
  meta: Object
};

export default function PickerField(props: Props) {
  const {
    input,
    label,
    meta: { touched, error, warning }
  } = props;

  return (
    <div className={css.pickerField}>
      <label htmlFor={input.name} className={css.title}>
        {label}
      </label>
      <select
        className={css.value}
        onFocus={input.onFocus}
        value={input.value}
        {...input}
      >
        {props.children}
      </select>
      {touched &&
        ((error && <span className={css.error}>{error}</span>) ||
          (warning && <span className={css.warning}>{warning}</span>))}
    </div>
  );
}

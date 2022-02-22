// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import { Field } from "redux-form";
import TextField from "src/components/shared/TextField";
import Button from "@material-ui/core/Button";
import css from "./name.style.css";
import type { ReduxProps } from "./";

type Props = ReduxProps & {};

export default class NewTeamName extends PureComponent<Props> {
  render() {
    const {
      messageError,
      valid,
      pristine,
      handleSubmit,
      submitting,
      asyncValidating
    } = this.props;

    const labelStyle = {
      fontSize: 20,
      color: "#848484",
      top: 28
    };

    const inputStyle = {
      fontWeight: 500,
      height: 80,
      paddingBottom: 30,
      fontSize: 20
    };

    const errorStyle = {
      right: 0,
      bottom: 27,
      fontSize: 16
    };

    return (
      <form
        onSubmit={handleSubmit}
        id="newTeamNameForm"
        className={css.content}
      >
        <div className={css.fieldContainer}>
          <Field
            id="teamName"
            name="teamName"
            label="Company or team name"
            component={TextField}
            type="text"
            fullWidth
            style={inputStyle}
            labelStyle={labelStyle}
            errorStyle={errorStyle}
          />
        </div>
        <div className={css.helpText}>
          <span>Work at a large company?</span> You might want ot name your team
          after your division, or working group.
        </div>
        <div className={css.messageError}>{messageError || null}</div>
        <Button
          type="submit"
          disableRipple
          disabled={!valid || pristine || submitting || asyncValidating}
          classes={{
            root: css.nextButton,
            disabled: css.nextButtonDisabled
          }}
        >
          {submitting || asyncValidating ? "Submitting..." : "Next"}
        </Button>
      </form>
    );
  }
}

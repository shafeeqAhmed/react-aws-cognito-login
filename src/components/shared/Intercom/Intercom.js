// @flow
import React, { PureComponent } from "react";
import { get } from "lodash";
import Intercom, { IntercomAPI } from "react-intercom";
import env from "config/env";
import { displayName } from "src/redux/modules/users";
import { type Props } from "./";

const { INTERCOM_APP_ID } = env;

export default class IntercomComponent extends PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    const locationChanged = this.props.location !== prevProps.location;

    if (locationChanged) {
      IntercomAPI("update");
    }
  }

  render() {
    const { user } = this.props;

    return (
      <Intercom
        appID={INTERCOM_APP_ID}
        user_id={get(user, "id", "")}
        email={get(user, "email", "")}
        name={displayName(user)}
      />
    );
  }
}

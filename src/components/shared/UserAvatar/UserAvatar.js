// @flow
import React, { PureComponent } from "react";
import UserAvatar from "react-user-avatar";
import { get } from "lodash";
import { displayName } from "src/redux/modules/users";
import type { Props } from "./";

export default class Avatar extends PureComponent<Props> {
  render() {
    const { user, ...avatarProps } = this.props;
    if (!user) return null;

    return (
      <UserAvatar
        size="32"
        name={displayName(user)}
        source={get(user, "avatar.urls[0]", "")}
        color={get(user, "color")}
        {...avatarProps}
      />
    );
  }
}

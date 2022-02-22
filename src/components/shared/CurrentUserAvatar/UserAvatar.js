// @flow
import React, { PureComponent } from "react";
import UserAvatar from "src/components/shared/UserAvatar";
import type { Props } from "./";

export default class Avatar extends PureComponent<Props> {
  render() {
    const { user, ...avatarProps } = this.props;
    if (!user) return null;

    return <UserAvatar user={this.props.user} {...avatarProps} />;
  }
}

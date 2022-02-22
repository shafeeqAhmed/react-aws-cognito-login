// @flow
import type { UserProfile } from "src/redux/modules/users";
import Component from "./UserAvatar";

type OwnProps = {
  user: ?UserProfile
};

export default Component;
export type Props = OwnProps;

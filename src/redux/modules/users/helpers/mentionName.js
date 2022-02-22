// @flow
import { type UserProfile } from "src/redux/modules/users";

/**
 * Get the display name of a user.
 * @param u profile of the user
 * @returns string name to display
 */
export default function mentionName(u: ?UserProfile): string {
  if (!u) return "";

  if (u.firstName) {
    return u.firstName;
  } else if (u.lastName) {
    return u.lastName;
  } else if (u.email) {
    return u.email;
  }

  return u.id;
}

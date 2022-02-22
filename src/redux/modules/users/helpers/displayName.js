// @flow
import { type UserProfile } from "src/redux/modules/users";

/**
 * Get the display name of a user.
 * @param u profile of the user
 * @returns string name to display
 */
export default function displayName(u: ?UserProfile): string {
  if (!u) return "";

  if (u.firstName && u.lastName) {
    return `${u.firstName} ${u.lastName}`;
  } else if (u.email) {
    return u.email;
  }

  return u.id;
}

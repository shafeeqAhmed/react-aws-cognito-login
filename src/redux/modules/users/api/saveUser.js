// @flow
import { put } from "src/helpers/api";
import env from "config/env";

const { WALKIE_API_URL } = env;

export default (async function saveUserInfo(
  userId: string,
  { name, creditName, mention, email }: Object
): Promise<any> {
  return put(`${WALKIE_API_URL}/directory/users/${userId}`, {
    name,
    creditName,
    mention,
    email
  });
});

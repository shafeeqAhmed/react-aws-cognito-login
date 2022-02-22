// @flow
import { post } from "src/helpers/api";
import env from "config/env";

const { WALKIE_API_URL } = env;

export default (async function saveUserDetails(
  userId: string,
  details: Array<Object>
): Promise<any> {
  return post(`${WALKIE_API_URL}/directory/users/${userId}/details`, details);
});

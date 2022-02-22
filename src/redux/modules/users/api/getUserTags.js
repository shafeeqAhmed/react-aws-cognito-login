// @flow
import { get } from "src/helpers/api";
import env from "config/env";

const { WALKIE_API_URL } = env;

export default (async function getUserTags(productionId: number): Promise<any> {
  return get(`${WALKIE_API_URL}/directory/productions/${productionId}/tags`);
});
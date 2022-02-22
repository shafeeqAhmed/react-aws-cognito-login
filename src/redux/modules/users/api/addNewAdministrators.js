// @flow
import { put } from "src/helpers/api";
import env from "config/env";

const { WALKIE_API_URL } = env;

export default (async function addNewAdministrators(
  productionId: number,
  userId: string,
  permission: string
): Promise<any> {
  return put(
    `${WALKIE_API_URL}/directory/productions/${productionId}/users/${userId}/stats/permission`,
    {
      permission
    }
  );
});

// @flow
import { post } from "src/helpers/api";
import env from "config/env";

const { WALKIE_API_URL } = env;

export default (productionId: number, userId: string) =>
  post(`${WALKIE_API_URL}/directory/productions/${productionId}/leave`, {
    id: userId
  });

// @flow
import { del } from "src/helpers/api";
import env from "config/env";

const { WALKIE_API_URL } = env;

export default (productionId: number) =>
  del(`${WALKIE_API_URL}/directory/productions/${productionId}`);

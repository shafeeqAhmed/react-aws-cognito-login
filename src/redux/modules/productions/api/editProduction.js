// @flow
import { put } from "src/helpers/api";
// import { pick } from "lodash";
import env from "config/env";

const { WALKIE_API_URL } = env;

export default (productionId: number, production: Object) =>
  put(`${WALKIE_API_URL}/directory/productions/${productionId}`, production);

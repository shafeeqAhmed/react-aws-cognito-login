// @flow
import { postImageFile } from "src/helpers/api";
import env from "config/env";

const { WALKIE_API_URL } = env;

const setProductionPoster = (productionId: number, file: Object) => {
  const url = `${WALKIE_API_URL}/directory/productions/${productionId}/poster`;

  return postImageFile(url, file);
};

export default setProductionPoster;

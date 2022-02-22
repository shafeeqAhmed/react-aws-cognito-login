// @flow
import { postImageFile } from "src/helpers/api";
import env from "config/env";

const { WALKIE_API_URL } = env;

const saveUserAvatar = (file: Object) => {
  const url = `${WALKIE_API_URL}/directory/users/me/avatar`;

  return postImageFile(url, file);
};

export default saveUserAvatar;

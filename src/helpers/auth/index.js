// @flow
import { Auth } from "aws-amplify";
import { setItem } from "src/helpers/storage";
import vars from "config/variables";

const { appAuthCookieKey, appAuthExpirySeconds } = vars;

// eslint-disable-next-line import/prefer-default-export
export { default as getAuthToken } from "./getAuthToken";

export const setAuthToken = async () =>
  Auth.currentSession().then(({ accessToken }) =>
    setItem(appAuthCookieKey, accessToken.jwtToken, appAuthExpirySeconds)
  );

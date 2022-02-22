// @flow
import { Auth } from "aws-amplify";

export default async function getAuthToken(): Promise<string> {
  return Auth.currentSession().then(({ accessToken }) => accessToken.jwtToken);
}

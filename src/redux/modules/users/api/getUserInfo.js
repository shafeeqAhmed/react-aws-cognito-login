// @flow
import { get, mock, camelize } from "src/helpers/api";
import { get as getProp } from "lodash";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";
import type { UserProfile } from "../";

const { MOCK_WALKIE_API, WALKIE_API_URL } = env;

type GetUserInfoResponse = {
  +id: string,
  +avatar: ?{
    +baseUrl: string,
    +name: string,
    +sizes: Array<string>
  },
  +details: ?Array<{
    +id: number,
    +type: string,
    +value: string
  }>,
  +creditName: ?string,
  +email: ?string,
  +mention: string,
  +name: string,
  +role: "PLACEHOLDER" | "NOT_VERIFIED" | "USER" | "APP_ADMIN",
  +tags: ?Array<{ +id: number, +name: string }>,
  +tosAccepted: boolean,
  +vlUserId: ?string
};

const GetUserInfoResponseMock: GetUserInfoResponse = {
  id: "fb8c2f6d-bd29-4024-b55f-c2b4745df5cf",
  name: "Sasha Heineken",
  creditName: null,
  mention: "user6",
  email: "procliq6@mailinator.com",
  avatar: null,
  details: [],
  tags: null,
  role: "USER",
  tosAccepted: false,
  vlUserId: null
};

export type GetUserInfoInput = {
  id?: string
};

export type GetUserInfoOutput = {
  user: UserProfile
};

/**
 * Decode API Response into application domain model.
 */
async function decoder(res: GetUserInfoResponse): Promise<GetUserInfoOutput> {
  return { user: camelize(res) };
}

/**
 * getUserInfo returns a user profile
 * @params userId ID of the user, defaults to `me for the current user
 * @params id of the screenplay
 */
export default (async function getUserInfo(
  input?: GetUserInfoInput
): Promise<APIResponseType<GetUserInfoOutput>> {
  const userId: string = getProp(input, "id", "me");

  const response = await (MOCK_WALKIE_API
    ? mock(GetUserInfoResponseMock)
    : get(`${WALKIE_API_URL}/directory/users/${userId}`));

  const output: APIResponseType<GetUserInfoOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
});

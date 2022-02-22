// @flow
import { mock, post } from "src/helpers/api";
import { get } from "lodash";
import axios from "axios";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";
import { type UserProfile } from "src/redux/modules/users";

const { MOCK_WALKIE_API, WALKIE_API_URL } = env;

type RegisterUserRequest = {
  email: string,
  firstName: string,
  lastName: string,
  prefineryInvitation?: {
    code: string,
    email?: ?string
  },
  procliqInvitationCode?: ?string,
  tosAccepted: boolean,
  file?: ?ArrayBuffer // include file to send a request with a user avatar picture
};

type RegisterUserResponse = {
  jwt: string,
  role: "SYSTEM" | "PLACEHOLDER" | "NOT_VERIFIED" | "USER" | "APP_ADMIN",
  userId: string
};

const RegisterUserResponseMock: RegisterUserResponse = {
  userId: "8141b964-80dc-4993-a9cc-c79c145aefd7",
  role: "USER",
  jwt:
    "eyJraWQiOiJKcUNLQjhqZFNMNXlUWDRLajhDVVhtUk9WVzRaalM3UDltQm1IemRPK2dVPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4MTQxYjk2NC04MGRjLTQ5OTMtYTljYy1jNzljMTQ1YWVmZDciLCJldmVudF9pZCI6ImI0YTk0YjRjLWI3NmEtMTFlOC05MTM2LTVkNzEyMTU0ZWFiOSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE1MzY4NTI5NTYsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xXzlKSXU2ZGpRZiIsImV4cCI6MTUzNjg1NjU1NiwiaWF0IjoxNTM2ODUyOTU2LCJqdGkiOiI5MTRiZGJlYi04OWM1LTRlZWYtYTMyOS1mMTA5ZTNmZTUwMzEiLCJjbGllbnRfaWQiOiJnM21mbDNlOGZzdGJpbmV2azBrMW00cmJwIiwidXNlcm5hbWUiOiI4MTQxYjk2NC04MGRjLTQ5OTMtYTljYy1jNzljMTQ1YWVmZDcifQ.PRtpbzxSffUAF_wRmk0WtD7SxF3Nff7G6oew0lGSsiePDBvf6bG-c57bswcDavC3nUFOfUsCHT2oD7ktM74RJ6oJLpeA-krHiImXDlkMDaCf_FUEdYM3XH5gO2mpV335po7h9xC6_TZBtZBj5a8CarG-X1mq95KILBHpOxnNm4kIfFhkKTy1bXa9KDSU31h3oKMjgw59TSgeLtoIv-ACsW4-p3xlmokm3smHAtPZp8SWYy9VfRb0CkYacoZeVJzxCdzw_KpQIyTKl-aKwkAeKq0T7KgDT90Lxv5hXrGEvF9RYv4GZPslB6rzc21CmJgdKMolMRfcHrWTp9ROgsBX1g"
};

export type RegisterUserInput = {
  email: string,
  firstName: string,
  lastName: string,
  prefineryInvitation?: {
    code: string,
    email?: ?string
  },
  procliqInvitationCode?: ?string,
  tosAccepted: boolean,
  file?: ?ArrayBuffer
};

export type RegisterUserOutput = {
  user: $Shape<{ ...UserProfile }>
};

/**
 * encodes a `RegisterUsert` object to an api request.
 */
async function encoder(input: RegisterUserInput): Promise<RegisterUserRequest> {
  return input;
}

/**
 * decodes the api response to `RegisterUserOutput`.
 */
async function decoder(
  res: RegisterUserResponse,
  input: RegisterUserInput
): Promise<RegisterUserOutput> {
  return {
    user: {
      id: res.userId,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      tosAccepted: input.tosAccepted,
      role: res.role
    }
  };
}

/**
 * RegisterUser signs up a new user.
 */
export default async function registerUser(
  input: RegisterUserInput
): Promise<APIResponseType<RegisterUserOutput>> {
  if (input.file) {
    return registerUserWithAvatar(input);
  }

  // eslint-disable-next-line camelcase
  const req = await encoder(input);

  const response = await (MOCK_WALKIE_API
    ? mock(RegisterUserResponseMock)
    : post(
        // eslint-disable-next-line camelcase
        `${WALKIE_API_URL}/directory/users/register`,
        req
      ));

  const output: APIResponseType<RegisterUserOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}

async function registerUserWithAvatar(
  input: RegisterUserInput
): Promise<APIResponseType<RegisterUserOutput>> {
  // eslint-disable-next-line camelcase
  const req = await encoder(input);

  let response = {};

  if (MOCK_WALKIE_API) {
    response = await mock(RegisterUserResponseMock);
  } else {
    // eslint-disable-next-line no-undef
    const formData = new FormData();

    [
      "email",
      "firstName",
      "lastName",
      "prefineryInvitation.code",
      "prefineryInvitation.email",
      "procliqInvitationCode",
      "tosAccepted"
    ].forEach(k => {
      if (typeof get(req, k) !== "undefined") {
        formData.append(k, get(req, k));
      }
    });

    // console.log(formData);

    const res = await axios.request({
      method: "POST",
      url: `${WALKIE_API_URL}/directory/user/register`,
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data: formData
    });

    response = {
      statusCode: res.status,
      data: res.data
    };
  }

  const output: APIResponseType<RegisterUserOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}

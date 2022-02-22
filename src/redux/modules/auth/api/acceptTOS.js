// @flow
import axios from "axios";
import { mock, type APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_WALKIE_API, WALKIE_API_URL } = env;

type AcceptTOSRequest = {
  jwt: string
};

type AcceptTOSResponse = {};

const RegisterUserResponseMock: AcceptTOSResponse = {};

export type AcceptTOSInput = {
  jwt: string
};

export type AcceptTOSOutput = {};

/**
 * encodes a `AcceptTOSInput` object to an api request.
 */
async function encoder(input: AcceptTOSInput): Promise<AcceptTOSRequest> {
  return input;
}

/**
 * decodes the api response to `AcceptTOSOutput`.
 */
async function decoder(res: AcceptTOSResponse): Promise<AcceptTOSOutput> {
  return {};
}

/**
 * acceptTOS accepts the TOS for a new user.
 */
export default async function acceptTOS(
  input: AcceptTOSInput
): Promise<APIResponseType<AcceptTOSOutput>> {
  const req = await encoder(input);

  let response = {};

  if (MOCK_WALKIE_API) {
    response = await mock(RegisterUserResponseMock);
  } else {
    const res = await axios.request({
      method: "GET",
      url: `${WALKIE_API_URL}/directory/users/me/tos/accept`,
      headers: {
        Authorization: `Bearer ${req.jwt}`,
        "Content-Type": "application/json"
      }
    });

    response = {
      statusCode: res.status,
      data: res.data
    };
  }

  const output: APIResponseType<AcceptTOSOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
}

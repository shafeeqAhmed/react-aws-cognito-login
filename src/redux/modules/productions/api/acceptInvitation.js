// @flow
import { post, mock } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_WALKIE_API, WALKIE_API_URL } = env;

type AcceptInvitationRequest = {
  code: string
};

type AcceptInvitationResponse = {};

const AcceptInvitationResponseMock: AcceptInvitationResponse = {};

export type AcceptInvitationInput = {
  code: string
};

export type AcceptInvitationOutput = {};

async function encoder(
  input: AcceptInvitationInput
): Promise<AcceptInvitationRequest> {
  return input;
}

async function decoder(
  res: AcceptInvitationResponse
): Promise<AcceptInvitationOutput> {
  return res;
}

/**
 * listProductions lists the productions the current user has access to.
 */
export default async function acceptInvitation(
  input: AcceptInvitationInput
): Promise<APIResponseType<AcceptInvitationOutput>> {
  const { code } = await encoder(input);

  const response = await (MOCK_WALKIE_API
    ? mock(AcceptInvitationResponseMock)
    : post(`${WALKIE_API_URL}/invitations/accept/${code}`));

  const output: APIResponseType<AcceptInvitationOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
}

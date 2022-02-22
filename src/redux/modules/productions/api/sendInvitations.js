// @flow
import { mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { InvitationToSend } from "../";
import env from "config/env";

const { MOCK_WALKIE_API, WALKIE_API_URL } = env;

type SendInvitationsRequest = {
  production_id: string,
  invitations: Array<InvitationToSend>
};

type SendInvitationsResponse = {
  data: Array<{
    code: string,
    date: string,
    id: number,
    production: {
      id: number,
      name: string,
      permission: string
    },
    status: string,
    user: {
      avatar: {
        name: string,
        sizeDesc: [string],
        urls: [string]
      },
      email: string,
      firstName: string,
      id: string,
      lastName: string
    }
  }>
};

const SendInvitationsResponseMock: SendInvitationsResponse = {
  data: [
    {
      code: "string",
      date: "2018-09-18T19:16:13.553Z",
      id: 0,
      production: {
        id: 0,
        name: "string",
        permission: "USER"
      },
      status: "PENDING",
      user: {
        avatar: {
          name: "string",
          sizeDesc: ["string"],
          urls: ["string"]
        },
        email: "string",
        firstName: "string",
        id: "string",
        lastName: "string"
      }
    }
  ]
};

export type SendInvitationsInput = {
  productionId: string,
  invitations: Array<InvitationToSend>
};

export type SendInvitationsOutput = {
  invitations: Array<{
    code: string,
    date: string,
    id: number,
    production: {
      id: number,
      name: string,
      permission: string
    },
    status: string,
    user: {
      avatar: {
        name: string,
        sizeDesc: [string],
        urls: [string]
      },
      email: string,
      firstName: string,
      id: string,
      lastName: string
    }
  }>
};

async function encoder(
  input: SendInvitationsInput
): Promise<SendInvitationsRequest> {
  return {
    production_id: input.productionId,
    invitations: input.invitations
  };
}

async function decoder(
  res: SendInvitationsResponse,
  input: SendInvitationsInput
): Promise<SendInvitationsOutput> {
  return { invitations: res.data };
}

export default async function sendInvitations(
  input: SendInvitationsInput
): Promise<APIResponseType<SendInvitationsOutput>> {
  // eslint-disable-next-line camelcase
  const req = await encoder(input);

  const response = await (MOCK_WALKIE_API
    ? mock(SendInvitationsResponseMock)
    : post(
        `${WALKIE_API_URL}/directory/productions/${
          req.production_id
        }/inviteBulk`,
        req.invitations
      ));

  const output: APIResponseType<SendInvitationsOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}

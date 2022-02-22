// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import { type Team } from "../";
import env from "config/env";

const { MOCK_WALKIE_API, WALKIE_API_URL } = env;

type CreateTeamRequest = {
  name: string,
  subdomain?: string
};

type CreateTeamResponse = {
  id: number
};

const CreateTeamResponseMock: CreateTeamResponse = {
  id: 2
};

export type CreateTeamInput = {
  name: string,
  subdomain?: string
};

export type CreateTeamOutput = {
  team: Team
};

async function encoder(input: CreateTeamInput): Promise<CreateTeamRequest> {
  return input;
}

async function decoder(
  res: CreateTeamResponse,
  input: CreateTeamInput
): Promise<CreateTeamOutput> {
  return { team: { ...res, ...input } };
}

export default async function createTeam(
  input: CreateTeamInput
): Promise<APIResponseType<CreateTeamOutput>> {
  // eslint-disable-next-line camelcase
  const req = await encoder(input);

  const response = await (MOCK_WALKIE_API
    ? mock(CreateTeamResponseMock)
    : post(`${WALKIE_API_URL}/directory/teams`, req));

  const output: APIResponseType<CreateTeamOutput> = {
    ...response,
    data: await decoder(response.data, input)
  };

  return output;
}

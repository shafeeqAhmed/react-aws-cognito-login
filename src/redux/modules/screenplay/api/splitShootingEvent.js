// @flow
import { mock, post, camelize } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { ShootingEventSplitType } from "src/redux/modules/screenplay";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type SplitRequest = {
  production_id: string,
  id: string,
  split_type: "split" | "reshoot"
};

type SplitResponse = {
  id: string,
  version: number,
  splitted_id: string
};

const SplitResponseMock: SplitResponse = {
  id: "16YnZJev9Ks840i9l5idJidDvHL",
  version: 2,
  splitted_id: "16YnZKeDiC6tQVhPa7lpIUqIWXs"
};

export type SplitInput = {
  productionId: number,
  shootingEventId: string,
  splitType: ShootingEventSplitType
};

export type SplitOutput = {
  id: string,
  version: number,
  splittedId: string
};

/**
 * encodes a `SplitInput` object to an api request.
 */
async function encoder(input: SplitInput): Promise<SplitRequest> {
  return {
    production_id: `${input.productionId}`,
    id: input.shootingEventId,
    split_type: input.splitType
  };
}

/**
 * decodes the api response to `SplitOutput`.
 */
async function decoder(res: SplitResponse): Promise<SplitOutput> {
  return camelize(res);
}

/**
 * split adds a scene to a shooting event.
 */
export default async function split(
  input: SplitInput
): Promise<APIResponseType<SplitOutput>> {
  // eslint-disable-next-line camelcase
  const { production_id, ...req } = await encoder(input);

  const response = await (MOCK_API
    ? mock(SplitResponseMock)
    : // eslint-disable-next-line camelcase
      post(
        // eslint-disable-next-line camelcase
        `${API_URL}/v1/productions/${production_id}/shootingevents/split`,
        req
      ));

  const output: APIResponseType<SplitOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
}

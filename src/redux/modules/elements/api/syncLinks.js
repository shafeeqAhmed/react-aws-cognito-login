// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

export type SyncLinksResponse = {};

const SyncLinksResponseMock: SyncLinksResponse = {};

export type SyncLinksRequest = {|
  +productionId: string,
  +screenplayId: string,
  +shootingEventId: string,
  +elementId?: string
|};

export const syncLinks = ({
  productionId,
  screenplayId,
  shootingEventId
}: SyncLinksRequest): Promise<APIResponseType<SyncLinksResponse>> =>
  MOCK_API
    ? mock(SyncLinksResponseMock)
    : post(`${API_URL}/v1/productions/${productionId}/elements/sync_links`, {
        screenplay_id: screenplayId,
        shootingevent_id: shootingEventId
      });

export default syncLinks;

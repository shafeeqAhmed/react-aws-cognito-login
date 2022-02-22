// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

export type UnlinkFromShootingEventResponse = {
  id: string,
  version: number
};

const UnlinkFromShootingEventResponseMock: UnlinkFromShootingEventResponse = {
  id: "1C2LCqOdy0dfzZvRNgyCjbLOQ58",
  version: 1
};

export type UnlinkFromShootingEventRequest = {|
  +productionId: string,
  +elementId: string,
  +shootingEventId: string
|};

export const unlinkFromShootingEvent = ({
  productionId,
  elementId,
  shootingEventId
}: UnlinkFromShootingEventRequest): Promise<
  APIResponseType<UnlinkFromShootingEventResponse>
> =>
  MOCK_API
    ? mock(UnlinkFromShootingEventResponseMock)
    : post(
        `${API_URL}/v1/productions/${productionId}/elements/unlink_from_shootingevent`,
        {
          id: elementId,
          shootingevent_id: shootingEventId
        }
      );

export default unlinkFromShootingEvent;

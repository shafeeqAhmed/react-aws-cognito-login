// @flow
import { mock, post, type APIResponseType } from "src/helpers/api";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type CreateScheduleDayEventResponse = {|
  id: string,
  version: number
|};

const CreateScheduleDayEventResponseMock: CreateScheduleDayEventResponse = {
  id: "1FIyY41T2HrbB7fLYzsgCeFWXl7",
  version: 1
};

export type CreateScheduleDayEventRequest = {|
  productionId: string,
  screenplayId: string,
  scheduledayId: string,
  shootingeventId: string,
  isPaid: boolean,
  isFixed: boolean,
  calendarStart: string,
  calendarEnd: string
|};

export const createScheduleDayEvent = ({
  productionId,
  screenplayId,
  scheduledayId,
  shootingeventId,
  isPaid = true,
  isFixed = false,
  calendarStart,
  calendarEnd
}: CreateScheduleDayEventRequest): Promise<
  APIResponseType<CreateScheduleDayEventResponse>
> =>
  MOCK_API
    ? mock(CreateScheduleDayEventResponseMock)
    : post(
        `${API_URL}/v1/productions/${productionId}/scheduledayevents/create`,
        {
          screenplay_id: screenplayId,
          scheduleday_id: scheduledayId,
          shootingevent_id: shootingeventId,
          is_paid: isPaid,
          is_fixed: isFixed,
          calendar_start: calendarStart,
          calendar_end: calendarEnd
        }
      );

export default createScheduleDayEvent;

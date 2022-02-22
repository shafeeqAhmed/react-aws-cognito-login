// @flow
import { camelize, mock, get } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { Department } from "../";
import env from "config/env";

const { MOCK_WALKIE_API, WALKIE_API_URL } = env;

type GetDepartmentByIdRequest = {
  pid: number,
  did: number
};

type GetDepartmentByIdResponse = {
  id: number,
  name: string,
  type: "CREW" | "CAST" | "EXTRAS"
};

const GetDepartmentByIdResponseMock: GetDepartmentByIdResponse = {
  id: 1,
  name: "Stunt Doubles",
  type: "EXTRAS"
};

export type GetDepartmentByIdInput = {
  productionId: number,
  departmentId: number
};

export type GetDepartmentByIdOutput = {
  department: Department
};

async function encoder(
  input: GetDepartmentByIdInput
): Promise<GetDepartmentByIdRequest> {
  return {
    pid: input.productionId,
    did: input.departmentId
  };
}

async function decoder(
  res: GetDepartmentByIdResponse
): Promise<GetDepartmentByIdOutput> {
  return { department: camelize(res) };
}

/**
 * getDepartmentById fetches information about a department.
 */
export default async function getDepartmentById(
  input: GetDepartmentByIdInput
): Promise<APIResponseType<GetDepartmentByIdOutput>> {
  const { pid, did } = await encoder(input);

  const response = await (MOCK_WALKIE_API
    ? mock(GetDepartmentByIdResponseMock)
    : get(`${WALKIE_API_URL}/directory/productions/${pid}/departments/${did}`));

  const output: APIResponseType<GetDepartmentByIdOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
}

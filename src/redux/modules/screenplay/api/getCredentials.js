// @flow
import { camelize, mock, post } from "src/helpers/api";
import type { APIResponseType } from "src/helpers/api";
import type { Credentials } from "src/redux/modules/screenplay";
import env from "config/env";

const { MOCK_API, API_URL } = env;

type GetCredentialsResponse = {
  project_id: string,
  api_key: string,
  access_token: string
};

const GetCredentialsResponseMock: GetCredentialsResponse = {
  project_id: "fake-firebase-project-id",
  api_key: "fake-firebase-api-key",
  access_token:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1ydm93dUBwcm9jbGlxLWI4OTY0LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwiYXVkIjoiaHR0cHM6Ly9pZGVudGl0eXRvb2xraXQuZ29vZ2xlYXBpcy5jb20vZ29vZ2xlLmlkZW50aXR5LmlkZW50aXR5dG9vbGtpdC52MS5JZGVudGl0eVRvb2xraXQiLCJleHAiOjE1MjU0Njk0MDIsImlhdCI6MTUyNTQ2NTgwMiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstcnZvd3VAcHJvY2xpcS1iODk2NC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6ImU0MzhhODIwLTcxZTUtNDM0Zi04OWQ1LWY1ZGZmZDdmNjkxOSIsImNsYWltcyI6eyJhbGxvd1JlYWQiOnRydWUsImFsbG93V3JpdGUiOnRydWUsInNjcmVlbnBsYXlJZCI6IjE0OWhjTG4xZ1RPbjNLWFZ4bEZndk8zbnFhVSJ9fQ.Lji47yAclYtptqtkueb5gJLpresBI-bmCi8tJ7e8wWrMcvSHRnCRuGSLgJS2hWCaH4kc7agEtZq4sjadh_V32ZcYiErS-PtGKQ__yo7qdbjxRmdAcFErYiBZewmKLC5LpmFHWopQAziw89m6CVegYGM96OGoXOoiqKQybDpDUowA_zqElLM6KF0xaviNdFdfwpwiY4sM-Rx938KjtZNFD7yPSZqKAOqvBVAg06_IbGbpWXbozzrfDXlzhbD9NsMbEMCcal8X9fRctt1H-TF0Cg1zE2AlvMtcePDbQEsXJ-OFiPTDQcE3vDEgRrLawJ1U1h81DBrLA14wa2DDIlGHOw"
};

export type GetCredentialsInput = {
  productionId: string,
  id: string
};

export type GetCredentialsOutput = {
  credentials: Credentials
};

/**
 * decodes the api response to `GetMetadataOutput`.
 */
async function decoder(
  res: GetCredentialsResponse
): Promise<GetCredentialsOutput> {
  return { credentials: camelize(res) };
}

/**
 * getCredentials fetches the credentials to connect to the realtime edition mode of a screenplay.
 * @params productionId ID of the production
 * @params id of the screenplay
 */
export default (async function getCredentials({
  productionId,
  id
}: GetCredentialsInput): Promise<APIResponseType<GetCredentialsOutput>> {
  const response = await (MOCK_API
    ? mock(GetCredentialsResponseMock)
    : post(
        `${API_URL}/v1/productions/${productionId}/screenplays/get_editor_credentials`,
        { id }
      ));

  const output: APIResponseType<GetCredentialsOutput> = {
    ...response,
    data: await decoder(response.data)
  };

  return output;
});

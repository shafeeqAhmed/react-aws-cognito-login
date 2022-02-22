// @flow
import axios from "axios";
import { get } from "lodash";
import { startUpload, endUpload } from "./";
import type { APIResponseType } from "src/helpers/api";
import type { Sound } from "../";
import env from "config/env";

const { MOCK_API } = env;

export type UploadProgressFunction = (
  soundId: string,
  loaded: number,
  total: number
) => void | Promise<void>;

export type UploadSoundRequest = {|
  +teamId: string,
  +blob: Blob,
  +name: string,
  +fileName: string,
  +description: string,
  +onUploadProgress: UploadProgressFunction,
  +setCancel?: Function => void
|};

export type UploadSoundResponse = {|
  +sound: Sound
|};

const uploadSound = async ({
  teamId,
  blob: data,
  name,
  fileName,
  description,
  onUploadProgress,
  setCancel
}: UploadSoundRequest): Promise<APIResponseType<UploadSoundResponse>> => {
  const now = new Date().toISOString();

  // prepare upload
  const { data: upload } = await startUpload({ teamId });
  const { id, upload_url: url } = upload;

  // upload to s3
  if (!MOCK_API) {
    await axios.request({
      method: "PUT",
      url,
      data,
      onUploadProgress: ({
        loaded,
        total
      }: {
        loaded: number,
        total: number
      }) => onUploadProgress(id, loaded, total),
      cancelToken: new axios.CancelToken(c => setCancel && setCancel(c))
    });
  }

  // confirm upload
  const res = await endUpload({
    teamId,
    id,
    name,
    fileName,
    description
  });

  return {
    statusCode: 200,
    data: {
      sound: {
        id,
        version: 0,
        ...get(res, "data", {}),
        team_id: teamId,
        name,
        file_name: fileName,
        description,
        productions: [],
        created_by: "",
        created_at: now,
        updated_at: now,
        deleted_at: undefined
      }
    }
  };
};

export default uploadSound;

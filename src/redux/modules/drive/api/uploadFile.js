// @flow
import axios from "axios";
import { startUpload, endUpload } from "./";
import type { APIResponseType } from "src/helpers/api";
import type { File } from "../";
import env from "config/env";

const { MOCK_API } = env;

export type UploadProgressFunction = (
  productionId: number,
  fileId: string,
  loaded: number,
  total: number
) => void | Promise<*>;

export type UploadFileInput = {
  productionId: number,
  blob: Blob,
  name: string,
  folderId: ?string,
  onUploadProgress: UploadProgressFunction,
  setCancel?: Function => void
};

export type UploadFileOutput = {
  file: File
};

export default async function uploadFile(
  input: UploadFileInput
): Promise<APIResponseType<UploadFileOutput>> {
  // start upload
  const startUploadOutput = await startUpload({
    productionId: input.productionId
  });

  // upload to s3
  const { id, uploadUrl } = startUploadOutput.data.file;

  if (!MOCK_API) {
    await axios.request({
      method: "PUT",
      url: uploadUrl,
      data: input.blob,
      onUploadProgress: (p: { loaded: number, total: number }) => {
        input.onUploadProgress(input.productionId, id, p.loaded, p.total);
      },
      cancelToken: new axios.CancelToken(c => {
        input.setCancel && input.setCancel(c);
      })
    });
  }

  // end upload
  const res = await endUpload({
    productionId: input.productionId,
    fileId: id,
    fileSize: input.blob.size,
    name: input.name,
    folderId: input.folderId
  });

  return {
    statusCode: 200,
    data: res.data
  };
}

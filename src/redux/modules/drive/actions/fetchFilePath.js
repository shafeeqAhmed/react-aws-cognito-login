// @flow
import { get } from "lodash";
import { getMetadata } from "src/redux/modules/drive/api";
import type { APIResponseType } from "src/helpers/api";
import type { File } from "../";

export const FETCH_FILE_PATH = ("procliq-web-editor/drive/FETCH_FILE_PATH": "procliq-web-editor/drive/FETCH_FILE_PATH");
export const FETCH_FILE_PATH_PENDING = ("procliq-web-editor/drive/FETCH_FILE_PATH_PENDING": "procliq-web-editor/drive/FETCH_FILE_PATH_PENDING");
export const FETCH_FILE_PATH_FULFILLED = ("procliq-web-editor/drive/FETCH_FILE_PATH_FULFILLED": "procliq-web-editor/drive/FETCH_FILE_PATH_FULFILLED");
export const FETCH_FILE_PATH_REJECTED = ("procliq-web-editor/drive/FETCH_FILE_PATH_REJECTED": "procliq-web-editor/drive/FETCH_FILE_PATH_REJECTED");

export type FetchFilePathAction = {
  type: typeof FETCH_FILE_PATH,
  payload: Promise<
    APIResponseType<{
      files: Array<File>
    }>
  >
};

export const fetchFilePath = (productionId: number, fileId: string) => ({
  type: FETCH_FILE_PATH,
  payload: async () => {
    const res = await getMetadata({ productionId, fileId });
    const file = get(res, "data.file", {});

    if (!file.filePath) {
      return { data: { files: [get(res, "data.file", null)] } };
    }

    const folderIds = file.filePath
      .split("/")
      .slice(0, -1)
      .filter(p => !!p.trim());

    const folderRes = await Promise.all(
      folderIds.map(id => getMetadata({ productionId, fileId: id }))
    );

    return {
      statusCode: 200,
      data: {
        files: [
          ...folderRes.map(r => get(r, "data.file")),
          get(res, "data.file", null)
        ]
      }
    };
  }
});

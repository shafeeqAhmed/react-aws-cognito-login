// @flow
export const COPY = ("procliq-web-editor/drive/COPY": "procliq-web-editor/drive/COPY");
export const CUT = ("procliq-web-editor/drive/CUT": "procliq-web-editor/drive/CUT");
export const PASTE = ("procliq-web-editor/drive/PASTE": "procliq-web-editor/drive/PASTE");

export type CopyAction = {
  type: typeof COPY,
  payload: {
    fileIds: Array<string>
  }
};

export type CutAction = {
  type: typeof CUT,
  payload: {
    fileIds: Array<string>
  }
};

export type PasteAction = {
  type: typeof PASTE,
  payload: {
    productionId: number,
    folderId: ?string
  }
};

export const copy = (fileIds: Array<string>): CopyAction => ({
  type: COPY,
  payload: { fileIds }
});

export const cut = (fileIds: Array<string>): CutAction => ({
  type: CUT,
  payload: { fileIds }
});

export const paste = (
  productionId: number,
  folderId: ?string
): PasteAction => ({
  type: PASTE,
  payload: { productionId, folderId }
});

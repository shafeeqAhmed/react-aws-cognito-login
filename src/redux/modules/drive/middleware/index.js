// @flow
import axios from "axios";
import { get } from "lodash";
import { OPEN_FILE, DOWNLOAD_FILE } from "src/redux/modules/drive/actions";
import { getFile } from "src/redux/modules/drive/selectors";
import type { Store } from "redux";
import type { RootReducerState } from "src/redux/modules";

export default function createMiddleware() {
  return (store: Store<RootReducerState, GlobalFSA<*>>) => (
    next: Function
  ) => async (action: GlobalFSA<*>) => {
    switch (action.type) {
      case DOWNLOAD_FILE: {
        const res = next(action);

        const fileId = get(action, "payload.fileId", "");
        if (!fileId) return res;

        const state = store.getState();
        const file = getFile(state, fileId);
        if (!file) return res;

        const url = get(file, "download.url");
        if (!url) return res;

        const zip = get(action, "payload.zip", false);
        const name = zip ? `${file.name}.zip` : file.name;

        await download(name, url);

        return res;
      }

      case OPEN_FILE: {
        const res = next(action);

        const fileId = get(action, "payload.fileId", "");
        if (!fileId) return res;

        const state = store.getState();
        const file = getFile(state, fileId);
        if (!file) return res;

        const url = get(file, "download.url");
        if (!url) return res;

        // TODO: fix Content-Type and Content-Disposition when creating url in the backend so that it opens inline
        window.open(url);

        return res;
      }

      default:
        return next(action);
    }
  };
}

// async function open(url: string) {
//   const popup = window.open();
//
//   const res = await axios({
//     url,
//     method: "GET",
//     responseType: "blob"
//   });
//
//   // eslint-disable-next-line no-undef
//   // popup.document.textContent = new Blob([res.data]);
//   const reader = new FileReader();
//   reader.onload = e => {
//     const contents = e.target.result;
//     fileInput.func(contents);
//     document.body.removeChild(fileInput);
//   };
//   reader.readAsText(file);
// }

// Download a file by url.
// NOTE: not sure how well it works cross browser, or in RN.
async function download(name: string, url: string) {
  const res = await axios({
    url,
    method: "GET",
    responseType: "blob"
  });

  // eslint-disable-next-line no-undef
  const uri = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = uri;
  link.setAttribute("download", name);

  // Can this be done without modifying the DOM?
  if (document.body) document.body.appendChild(link);
  console.log("click", link);
  link.click();
}

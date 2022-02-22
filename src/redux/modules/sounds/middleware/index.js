// @flow
import { get } from "lodash";
import { DOWNLOAD } from "src/redux/modules/sounds";
import type { Store } from "redux";
import type { RootReducerState } from "src/redux/modules";

export default function createMiddleware() {
  return (store: Store<RootReducerState, GlobalFSA<*>>) => (
    next: Function
  ) => async (action: GlobalFSA<*>) => {
    switch (action.type) {
      case DOWNLOAD: {
        const res = next(action);
        const { url, sound } = get(action, "meta.request", {});

        if (!url) return res;
        try {
          await download(url, get(sound, "file_name"));
        } catch (e) {
          return res;
        }

        return res;
      }

      default:
        return next(action);
    }
  };
}

// Download a file by url.
async function download(url: string, fileName?: string) {
  const names = url.split("/");
  const name = fileName || names[names.length - 1];

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", name);

  if (document.body) document.body.appendChild(link);
  link.click();
}

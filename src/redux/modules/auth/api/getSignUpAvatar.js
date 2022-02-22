// @flow
import { get } from "src/helpers/api";

const FACEBOOK_GRAPH_URL = "https://graph.facebook.com/v3.1";

const toDataUrl = (url: string): Promise<*> =>
  new Promise((resolve, reject) =>
    /* eslint-disable-next-line */
    fetch(url, { mode: "cors" })
      .then(data => data.blob())
      .then(response => {
        /* eslint-disable-next-line */
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(response);
      })
  );

type GetSignUpAvatarRequest = string;

type GetSignUpAvatarResponse = {
  dataUrl: ArrayBuffer | string
};

export type GetSignUpAvatarInput = {
  userId: string,
  // dataUrl?: ArrayBuffer | string,
  provider: "facebook" | "google",
  url?: string
};

export type GetSignUpAvatarOutput = {
  dataUrl?: ArrayBuffer
};

/**
 * encodes a `GetSignUpAvatart` object to an api request.
 */
async function encoder(
  input: GetSignUpAvatarInput
): Promise<GetSignUpAvatarRequest> {
  return input.userId;
}

/**
 * decodes the api response to `GetSignUpAvatarOutput`.
 */
async function decoder(
  res: GetSignUpAvatarResponse
): Promise<GetSignUpAvatarOutput> {
  return { data: { dataUrl: res.dataUrl } };
}

/**
 * GetSignUpAvatar get a base64 image.
 */
export default async function getSignUpAvatar(
  input: GetSignUpAvatarInput
): Promise<GetSignUpAvatarOutput> {
  // eslint-disable-next-line camelcase
  const userId = await encoder(input);

  let url = input.url || "";

  if (input.provider === "facebook") {
    const response = await get(
      `${FACEBOOK_GRAPH_URL}/${userId}/picture?width=3000&height=3000&redirect=0`
    );

    url = response.data.data.url;
  }

  const dataUrl = await toDataUrl(url);

  const output = {
    data: await decoder({ dataUrl })
  };

  return output;
}

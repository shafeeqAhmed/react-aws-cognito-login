// @flow
import Axios from "axios";
import type { $AxiosXHRConfigBase } from "axios";
import { getAuthToken } from "../auth";

const getClient = async (url: string): Promise<*> => {
  try {
    const token = await getAuthToken();

    if (!token) throw Error();

    const config: $AxiosXHRConfigBase<*> = {
      baseURL: url,
      timeout: 15000,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": "multipart/form-data"
      }
    };

    return Axios.create(config);
  } catch (error) {
    return error;
  }
};

export const postFile = (endpoint: string, file: Object): Promise<*> => {
  const data = new window.FormData();
  data.append("file", file);

  return getClient(endpoint).then(client => client.post(endpoint, data));
};

export const getFile = (endpoint: string): Promise<*> =>
  getClient(endpoint).then(client => client.get(endpoint));

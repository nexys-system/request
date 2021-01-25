import fetch from "node-fetch";
import { HTTP } from "@nexys/http";
import * as T from "./type";
import * as Utils from "./utils";

export { Utils };

const headersDefault: T.Headers = { "content-type": "application/json" };
const methodDefault: T.Method = "GET";

export const exec = async <InShape = { [k: string]: any }, OutShape = any>(
  host: string,
  path: string,
  method: T.Method = methodDefault,
  data?: InShape,
  headers: T.Headers = headersDefault,
  query?: T.Query
): Promise<OutShape> => {
  const urlFinal = Utils.getUrlFinal(host, path, query);

  const body: string | undefined = data && JSON.stringify(data);

  const options = {
    headers,
    method,
    body,
  };

  try {
    const r = await fetch(urlFinal, options);
    const statusCode = r.status;
    const body = await r.json();

    if (Utils.isStatusSuccess(statusCode)) {
      return body;
    }

    throw new HTTP.Error(body, statusCode);
  } catch (err) {
    if (err instanceof HTTP.Error) {
      throw err;
    }
    throw Error(err);
  }
};

// same as exec, but better interface
export const exec2 = async <InShape = { [k: string]: any }, OutShape = any>(
  host: string,
  path: string,
  {
    method = "GET",
    headers = headersDefault,
    query,
    data,
  }: { method: T.Method; data: InShape; headers: T.Headers; query?: T.Query }
): Promise<OutShape> => exec(host, path, method, data, headers, query);

// alias for exec2
export const r = exec2;

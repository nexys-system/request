import fetch from "node-fetch";
import * as f from "node-fetch";
import { HTTP } from "@nexys/http";
import * as T from "./type";
import * as Utils from "./utils";

export { Utils };

const headersDefault: T.Headers = { "content-type": "application/json" };
const methodDefault: T.Method = "GET";

type ReturnType = "text" | "json" | "arrayBuffer" | "blob";

const bodyToOut = (
  r: f.Response,
  type: ReturnType
): Promise<any | Blob | ArrayBuffer | string> => {
  if (type === "json") {
    return r.json();
  }

  if (type === "blob") {
    return r.blob();
  }

  if (type === "arrayBuffer") {
    return r.arrayBuffer();
  }

  return r.text();
};

export const exec = async <InShape = { [k: string]: any }, OutShape = any>(
  host: string,
  path: string,
  method: T.Method = methodDefault,
  data?: InShape,
  headers: T.Headers = headersDefault,
  query?: T.Query,
  returnType: ReturnType = "json"
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
    const body = await bodyToOut(r, returnType);

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
    returnType = "json",
    query,
    data,
  }: {
    method: T.Method;
    data: InShape;
    headers?: T.Headers;
    returnType?: ReturnType;
    query?: T.Query;
  }
): Promise<OutShape> =>
  exec(host, path, method, data, headers, query, returnType);

// alias for exec2
export const r = exec2;

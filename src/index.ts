import fetch from "node-fetch";
import { HTTP } from "@nexys/http";
import * as T from "./type";
import * as U from "./utils";

export const exec = async <InShape = { [k: string]: any }, OutShape = any>(
  host: string,
  path: string,
  method: T.Method = "GET",
  data?: InShape,
  headers: T.Headers = { "content-type": "application/json" },
  query?: T.Query
): Promise<OutShape> => {
  const urlFinal = U.getUrlFinal(host, path, query);

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

    if (U.isStatusSuccess(statusCode)) {
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

const headersDefault: T.Headers = { "content-type": "application/json" };

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

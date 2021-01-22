import fetch from "node-fetch";
import { HTTP } from "@nexys/http";

export const toQueryString = (query?: { [k: string]: string }): string => {
  if (!query) {
    return "";
  }

  const entries = Object.entries(query);

  if (entries.length === 0) {
    return "";
  }

  const queryString = Object.entries(query)
    .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
    .join("&");

  return "?" + queryString;
};

const getUrlFinal = (
  host: string,
  path: string = "/",
  query?: { [k: string]: string }
): string => {
  return host + path + toQueryString(query);
};

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * check if returned is a successful status, ie 2xx
 */
export const isStatusSuccess = (statusCode: number): boolean =>
  Math.floor(statusCode / 100) === 2;

export const exec = async <InShape = { [k: string]: any }, OutShape = any>(
  host: string,
  path: string,
  method: Method = "GET",
  data?: InShape,
  headers?: { [k: string]: string },
  query?: { [k: string]: string }
): Promise<OutShape> => {
  const urlFinal = getUrlFinal(host, path, query);

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

    if (isStatusSuccess(statusCode)) {
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

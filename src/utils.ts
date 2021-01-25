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

export const getUrlFinal = (
  host: string,
  path: string = "/",
  query?: { [k: string]: string }
): string => {
  return host + path + toQueryString(query);
};

/**
 * check if returned is a successful status, ie 2xx
 */
export const isStatusSuccess = (statusCode: number): boolean =>
  Math.floor(statusCode / 100) === 2;

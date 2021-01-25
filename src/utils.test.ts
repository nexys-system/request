import * as H from "./utils";

test("toQueryString", () => {
  const q = { a: "1", b: "2" };
  const r = H.toQueryString(q);
  const e = "?a=1&b=2";

  expect(r).toEqual(e);
});

test("geturlfinal", () => {
  expect(H.getUrlFinal("http://myhost", "/a/path", { k1: "v1" })).toEqual(
    "http://myhost/a/path?k1=v1"
  );
});

test("isStatusSuccess", () => {
  expect(H.isStatusSuccess(234)).toEqual(true);
  expect(H.isStatusSuccess(345)).toEqual(false);
});

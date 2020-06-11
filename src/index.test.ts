import * as H from "./";
import nock from "nock";
import HTTP from "@nexys/http";

test("toQueryString", () => {
  const q = { a: "1", b: "2" };
  const r = H.toQueryString(q);
  const e = "?a=1&b=2";

  expect(r).toEqual(e);
});

test("get request", async () => {
  const host = "https://api.github.com";
  const path = "/repos/atom/atom/license";
  const e = {
    license: {
      key: "mit",
      name: "MIT License",
      spdx_id: "MITy",
      url: "https://api.github.com/licenses/mit",
      node_id: "MDc6TGljZW5zZTEz",
    },
  };

  const scope = nock(host).get(path).reply(200, e);

  const r = await H.exec(host, path);

  expect(r).toEqual(e);
});

test("get request - 400", async () => {
  const host = "https://api.github.com";
  const path = "/repos/atom/atom/license";
  const e = {
    msg: "this is a 400 error message",
  };

  const scope = nock(host).get(path).reply(400, e);

  try {
    const r = await H.exec(host, path);
  } catch (err) {
    //expect(err instanceof HTTP.Error).toEqual(true);
    //console.log(err);
    expect(err.body).toEqual(e);
  }
});

test("isStatusSuccess", () => {
  expect(H.isStatusSuccess(234)).toEqual(true);
  expect(H.isStatusSuccess(345)).toEqual(false);
});

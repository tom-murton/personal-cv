import assert from "node:assert/strict";
import { test } from "node:test";

import worker from "./measurement-region.mjs";

const endpoint = "https://tommurton.com/apps/level-best/measurement-region";

function request(path, { method = "GET", country, headers } = {}) {
  const result = new Request(path, { method, headers });
  if (country !== undefined) {
    Object.defineProperty(result, "cf", { value: { country } });
  }
  return result;
}

function assetsEnvironment() {
  const fetched = [];
  return {
    fetched,
    ASSETS: {
      fetch(incoming) {
        fetched.push(incoming);
        return Promise.resolve(new Response("original asset", { status: 203 }));
      },
    },
  };
}

test("returns only the Cloudflare country and policy version without caching", async () => {
  for (const country of ["GB", "US", "AU", "NZ"]) {
    const env = assetsEnvironment();
    const response = await worker.fetch(request(endpoint, { country }), env);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { country, policy_version: 1 });
    assert.equal(response.headers.get("Cache-Control"), "private, no-store");
    assert.match(response.headers.get("Content-Type"), /^application\/json/);
    assert.deepEqual(env.fetched, []);
  }
});

test("unknown, invalid and spoofed header countries do not become a country", async () => {
  for (const country of [undefined, "XX", "T1", "ZZ", "AA", "us"]) {
    const response = await worker.fetch(
      request(endpoint, { country, headers: { "CF-IPCountry": "US" } }),
      assetsEnvironment(),
    );
    assert.deepEqual(await response.json(), { country: null, policy_version: 1 });
  }
});

test("HEAD returns matching headers without a body", async () => {
  const response = await worker.fetch(
    request(endpoint, { method: "HEAD", country: "GB" }),
    assetsEnvironment(),
  );
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "private, no-store");
  assert.equal(await response.text(), "");
});

test("other methods are refused without calling assets", async () => {
  const env = assetsEnvironment();
  const response = await worker.fetch(request(endpoint, { method: "POST" }), env);
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("Allow"), "GET, HEAD");
  assert.equal(response.headers.get("Cache-Control"), "private, no-store");
  assert.deepEqual(env.fetched, []);
});

test("other paths pass through to the original static assets binding", async () => {
  const env = assetsEnvironment();
  const incoming = request("https://tommurton.com/apps/level-best/privacy/index.html");
  const response = await worker.fetch(incoming, env);
  assert.equal(response.status, 203);
  assert.equal(await response.text(), "original asset");
  assert.deepEqual(env.fetched, [incoming]);
});

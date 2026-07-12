const test = require("node:test");
const assert = require("node:assert/strict");

function loadModules() {
  delete require.cache[require.resolve("../src/config/env")];
  delete require.cache[require.resolve("../src/services/geminiService")];

  return {
    env: require("../src/config/env"),
    geminiService: require("../src/services/geminiService"),
  };
}

test("env config uses GOOGLE_API_KEY when GEMINI_API_KEY is absent", () => {
  process.env.GEMINI_API_KEY = "";
  process.env.GOOGLE_API_KEY = "google-auth-key";

  const { env } = loadModules();

  assert.equal(env.GEMINI_API_KEY, "google-auth-key");
});

test("gemini service uses GOOGLE_API_KEY fallback for initialization", () => {
  process.env.GEMINI_API_KEY = "";
  process.env.GOOGLE_API_KEY = "google-auth-key";

  const { geminiService } = loadModules();

  assert.equal(geminiService.apiKey, "google-auth-key");
});

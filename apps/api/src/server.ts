import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();
app.listen(env.API_PORT, env.API_HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`[api] trustshyft phase 1 listening on http://${env.API_HOST}:${env.API_PORT}`);
});

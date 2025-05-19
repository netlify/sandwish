import { getStore } from "@netlify/blobs";
import { Config, Context } from "@netlify/functions";

import type { State } from "../../src/types.js";

export default async (req: Request, context: Context) => {
  // TODO: Use `context.params`
  const slug = req.url.split("/").pop();
  if (!slug) {
    return new Response(null, { status: 404 });
  }

  const store = getStore("sandwiches");

  const state = await store.get(slug, { type: "json" });
  if (!state) {
    return new Response(null, { status: 404 });
  }

  return Response.json(state as State);
};

export const config: Config = {
  method: "GET",
  path: "/sandwich/:slug"
};

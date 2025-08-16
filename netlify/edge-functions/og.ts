import { getStore } from "@netlify/blobs";
import type { Config, Context } from "@netlify/edge-functions";

import type { State } from "../../src/types.js";

const PLACEHOLDER = /\/favicon.png\?role=placeholder/gi;

export default async (req: Request, context: Context) => {
  console.log("-> EF", req.url, req.headers.get("Netlify-Agent-Category"));
  const url = new URL(req.url);
  const slug = url.pathname.slice(1);
  if (!slug) {
    return;
  }

  const store = getStore("sandwiches");
  const state = (await store.get(slug, { type: "json" })) as State;
  if (!state) {
    return;
  }

  const imagePath = `/sandwich-preview/${state.bread}/${state.fillings
    .reverse()
    .join("/")}.png`;
  const page = await context.next();
  const html = await page.text();
  const newHTML = html.replace(PLACEHOLDER, imagePath);

  return new Response(newHTML, page);
};

export const config: Config = {
  pattern: "/*"
};

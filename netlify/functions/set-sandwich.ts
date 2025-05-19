import { getStore } from "@netlify/blobs";
import { Config } from "@netlify/functions";
import slugify from "@sindresorhus/slugify";
import { v4 as uuid } from "uuid";

import type { Creation, State } from "../../src/types.js";

export default async (req: Request) => {
  const store = getStore("sandwiches");

  const payload = (await req.json()) as Creation;
  const { author, bread, fillings, title } = payload;

  if (!title || !author || !bread || !fillings) {
    return new Response(null, { status: 400 });
  }

  const id = uuid().replace(/-/g, "");
  const slug = `${slugify(title)}-${id}`;

  await store.setJSON(slug, payload);

  return Response.json({ ...payload, slug } as State);
};

export const config: Config = {
  method: "POST",
  path: "/sandwich"
};

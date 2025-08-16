import { getStore } from "@netlify/blobs";
import type { Config, Context } from "@netlify/edge-functions";

import {
  HTMLRewriter,
  init,
  Element
} from "https://deno.land/x/htmlrewriter/src/index.ts";

await init();

interface PageData {
  description: string;
  imagePath: string;
  title: string;
}

function rewriter(response: Response, data: PageData): Response {
  return (
    new HTMLRewriter()
      // Image
      .on("meta[property='og:image']", {
        element(element: Element) {
          element.setAttribute("content", data.imagePath);
        }
      })
      .on("meta[property='twitter:image']", {
        element(element: Element) {
          element.setAttribute("content", data.imagePath);
        }
      })

      // Title
      .on("meta[name='title']", {
        element(element: Element) {
          element.setAttribute("content", data.title);
        }
      })
      .on("meta[property='og:title']", {
        element(element: Element) {
          element.setAttribute("content", data.title);
        }
      })
      .on("meta[property='twitter:title']", {
        element(element: Element) {
          element.setAttribute("content", data.title);
        }
      })

      // Description
      .on("meta[name='description']", {
        element(element: Element) {
          element.setAttribute("content", data.description);
        }
      })
      .on("meta[property='og:description']", {
        element(element: Element) {
          element.setAttribute("content", data.description);
        }
      })
      .on("meta[property='twitter:description']", {
        element(element: Element) {
          element.setAttribute("content", data.description);
        }
      })

      .transform(response)
  );
}

import type { State } from "../../src/types.js";

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
  const author = state.author ? ` by ${state.author}` : "";

  return rewriter(await context.next(), {
    description: `A truly delicious creation${author}. Stack yours and share it with the world!`,
    imagePath,
    title: state.title
  });
};

export const config: Config = {
  header: {
    "Netlify-Agent-Category": "(crawler|page-preview)"
  },
  pattern: "^/[^.]*$"
};

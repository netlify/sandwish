import { Config, Context } from "@netlify/functions";
import sharp from "sharp";
import {
  breads,
  fillings,
  MAX_INGREDIENTS_IN_PREVIEW
} from "../../src/ingredients";

const CANVAS_SIZE = 600;
const IMAGE_FACTOR = 0.9;
const SPACING_FACTOR = 0.06;

export default async (req: Request) => {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split("/");
    const bread = parts[2];
    const fillingIds = parts.slice(3);

    // Find bread and filling ingredients
    const breadIngredient = breads.find((b) => b.id === bread);
    if (!breadIngredient) {
      return new Response(`Invalid bread ID: ${bread}`, { status: 400 });
    }

    const fillingIngredients = fillingIds
      .slice(0, MAX_INGREDIENTS_IN_PREVIEW)
      .map((idAndExtension) => {
        const [id] = idAndExtension.split(".");
        const ingredient = fillings.find((f) => f.id === id);
        if (!ingredient) {
          throw new Error(`Invalid filling ID: ${id}`);
        }
        return ingredient;
      })
      .reverse();

    // Create array to hold all the image layers
    const layers: sharp.OverlayOptions[] = [];

    // Calculate dimensions and offsets
    const breadDimensions = Math.round(CANVAS_SIZE * IMAGE_FACTOR);
    const breadOffset = (CANVAS_SIZE - breadDimensions) / 2;

    const totalHeight =
      breadDimensions +
      (fillingIngredients.length + 1) * CANVAS_SIZE * SPACING_FACTOR;
    const marginY = Math.round((CANVAS_SIZE - totalHeight) / 2);

    let currentY = Math.max(0, marginY);

    // Process top bread first
    // Get base URL from request URL
    const baseUrl = url.origin;

    // Fetch top bread image
    const topFilename =
      typeof breadIngredient.filename === "string"
        ? breadIngredient.filename
        : breadIngredient.filename.top;
    const topResponse = await fetch(`${baseUrl}/bread/${topFilename}`);
    const topBuffer = await sharp(await topResponse.arrayBuffer())
      .resize(breadDimensions, breadDimensions, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();

    layers.push({
      input: topBuffer,
      top: currentY,
      left: Math.round(breadOffset),
      blend: "over" as const
    });

    currentY += CANVAS_SIZE * SPACING_FACTOR;

    const jobs = fillingIngredients.map(async (filling) => {
      // Fetch filling image
      const fillingResponse = await fetch(
        `${baseUrl}/filling/${filling.filename}`
      );

      const size = Math.round(CANVAS_SIZE * IMAGE_FACTOR);
      const fillingBuffer = await sharp(await fillingResponse.arrayBuffer())
        .resize(size, size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toBuffer();

      const fillingDimensions = Math.round(CANVAS_SIZE * IMAGE_FACTOR);
      const fillingOffset = (CANVAS_SIZE - fillingDimensions) / 2;

      return {
        input: fillingBuffer,
        left: Math.round(fillingOffset),
        blend: "over" as const
      };
    });

    for (const layer of await Promise.all(jobs)) {
      layers.push({ ...layer, top: currentY });

      currentY += CANVAS_SIZE * SPACING_FACTOR;
    }

    // Process bottom bread last
    // Split bread - use bottom piece
    // Fetch bottom bread image
    const bottomFilename =
      typeof breadIngredient.filename === "string"
        ? breadIngredient.filename
        : breadIngredient.filename.bottom;
    const bottomResponse = await fetch(`${baseUrl}/bread/${bottomFilename}`);
    const bottomBuffer = await sharp(await bottomResponse.arrayBuffer())
      .resize(breadDimensions, breadDimensions, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();

    layers.push({
      input: bottomBuffer,
      top: currentY,
      left: Math.round(breadOffset),
      blend: "over" as const
    });

    // Add background as the first layer
    // Fetch background image
    const backgroundResponse = await fetch(`${baseUrl}/background.png`);
    const backgroundBuffer = await sharp(await backgroundResponse.arrayBuffer())
      .resize(CANVAS_SIZE, CANVAS_SIZE, {
        fit: "cover",
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();

    // Add background as last layer (at the bottom)
    layers.push({
      input: backgroundBuffer,
      top: 0,
      left: 0,
      blend: "over" as const
    });

    // Create final image with all layers
    const result = await sharp({
      create: {
        width: CANVAS_SIZE,
        height: CANVAS_SIZE,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite(layers.reverse())
      .png()
      .toBuffer();

    return new Response(result, {
      headers: {
        "CDN-Cache-Control": "public,max-age=31556952,durable",
        "Content-Type": "image/png",
        "Content-Length": result.byteLength.toString()
      }
    });
  } catch (error) {
    console.error("Error generating sandwich:", error);
    return new Response(`Error generating sandwich: ${error.message}`, {
      status: 500
    });
  }
};

export const config: Config = {
  method: "GET",
  path: "/sandwich-preview/:bread/*"
};

import { Config, Context } from "@netlify/functions";
import sharp from "sharp";
import { breads, fillings } from "../../src/ingredients";

const CANVAS_SIZE = 300;
const IMAGE_SIZE = 200; // Smaller base size for ingredients
const MAX_INGREDIENTS = 8;
const SPACING = 30;

export default async (req: Request, context: Context) => {
  try {
    const parts = new URL(req.url).pathname.split("/");
    const bread = parts[2];
    const fillingIds = parts[3].split(",");

    // Find bread and filling ingredients
    const breadIngredient = breads.find((b) => b.id === bread);
    if (!breadIngredient) {
      return new Response(`Invalid bread ID: ${bread}`, { status: 400 });
    }

    const fillingIngredients = fillingIds
      .slice(0, MAX_INGREDIENTS)
      .map((id) => {
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
    const breadDimensions = Math.round(IMAGE_SIZE * breadIngredient.scale);
    const breadOffset = (CANVAS_SIZE - breadDimensions) / 2;

    const totalHeight =
      breadDimensions + (fillingIngredients.length + 1) * SPACING;
    const marginY = (CANVAS_SIZE - totalHeight) / 2;

    let currentY = Math.max(0, marginY);

    // Process top bread first
    // Get base URL from request URL
    const baseUrl = new URL(req.url).origin;

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

    currentY += SPACING;

    const jobs = fillingIngredients.map(async (filling) => {
      // Fetch filling image
      const fillingResponse = await fetch(
        `${baseUrl}/filling/${filling.filename}`
      );
      const fillingBuffer = await sharp(await fillingResponse.arrayBuffer())
        .resize(
          Math.round(IMAGE_SIZE * filling.scale),
          Math.round(IMAGE_SIZE * filling.scale),
          {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          }
        )
        .toBuffer();

      const fillingDimensions = Math.round(IMAGE_SIZE * filling.scale);
      const fillingOffset = (CANVAS_SIZE - fillingDimensions) / 2;

      return {
        input: fillingBuffer,
        left: Math.round(fillingOffset),
        blend: "over" as const
      };
    });

    for (const layer of await Promise.all(jobs)) {
      layers.push({ ...layer, top: currentY });

      currentY += SPACING;
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
        "Content-Type": "image/png"
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
  path: "/sandwich-preview/:bread/:fillings"
};

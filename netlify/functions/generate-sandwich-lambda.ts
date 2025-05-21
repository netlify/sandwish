import { Handler } from "@netlify/functions";
import sharp from "sharp";
import {
  breads,
  fillings,
  MAX_INGREDIENTS_IN_PREVIEW
} from "../../src/ingredients";

const CANVAS_SIZE = 1200;
const IMAGE_SIZE = 800; // Smaller base size for ingredients
const SPACING = 80;

export const handler: Handler = async (event, context) => {
  try {
    const parts = event.path.split("/");
    const bread = parts[4];
    const fillingIds = parts[5].split(",");

    // Find bread and filling ingredients
    const breadIngredient = breads.find((b) => b.id === bread);
    if (!breadIngredient) {
      return {
        statusCode: 400,
        body: `Invalid bread ID: ${bread}`
      };
    }

    const fillingIngredients = fillingIds
      .slice(0, MAX_INGREDIENTS_IN_PREVIEW)
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
    const marginY = Math.round((CANVAS_SIZE - totalHeight) / 2);

    let currentY = Math.max(0, marginY);

    // Fetch top bread image
    const topFilename =
      typeof breadIngredient.filename === "string"
        ? breadIngredient.filename
        : breadIngredient.filename.top;
    const topResponse = await fetch(
      new URL(`/bread/${topFilename}`, event.rawUrl)
    );
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
        new URL(`/filling/${filling.filename}`, event.rawUrl)
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
    console.log("-->", new URL(`/bread/${bottomFilename}`, event.rawUrl));
    const bottomResponse = await fetch(
      new URL(`/bread/${bottomFilename}`, event.rawUrl)
    );
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
    const backgroundResponse = await fetch(
      new URL(`/background.png`, event.rawUrl)
    );
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

    return {
      statusCode: 200,
      headers: {
        "CDN-Cache-Control": "public,max-age=31556952,durable",
        "Content-Type": "image/png"
      },
      body: result.toString("base64"),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error("Error generating sandwich:", error);
    return {
      statusCode: 500,
      body: `Error generating sandwich: ${error.message}`
    };
  }
};

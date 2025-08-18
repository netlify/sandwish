import { Config, Context } from "@netlify/functions";
import sharp from "sharp";
import {
  breads,
  fillings,
  MAX_INGREDIENTS_IN_PREVIEW
} from "../../src/ingredients";

const CANVAS_SIZE = 600;
const MAX_INGREDIENTS = 12;
const SPACING_FACTOR = 0.2;

const getImage = async (url: string, width: number, height?: number) => {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const image = sharp(buffer);
  const resizedBuffer = image.resize(width, height);
  const metadata = await resizedBuffer.metadata();
  const leftMargin = Math.round((CANVAS_SIZE - width) / 2);
  const dimensions = {
    width: metadata.width,
    height: height ?? Math.round((metadata.height * width) / metadata.width)
  };

  return { buffer: await resizedBuffer.toBuffer(), dimensions, leftMargin };
};

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
      .reverse()
      .slice(0, MAX_INGREDIENTS);

    const imageFactor = getImageFactor(fillingIngredients.length);
    const gap = Math.round(CANVAS_SIZE * imageFactor * SPACING_FACTOR);
    const ingredientWidth = Math.round(CANVAS_SIZE * imageFactor);

    // Create array to hold all the image layers
    const layers: sharp.OverlayOptions[] = [];

    // Get base URL from request URL
    const baseUrl = url.origin;

    const background = await getImage(`${baseUrl}/background.png`, CANVAS_SIZE);

    const topFilename =
      typeof breadIngredient.filename === "string"
        ? breadIngredient.filename
        : breadIngredient.filename.top;
    const top = await getImage(
      `${baseUrl}/bread/${topFilename}`,
      ingredientWidth
    );

    const middle = await Promise.all(
      fillingIngredients.map((filling) =>
        getImage(`${baseUrl}/filling/${filling.filename}`, ingredientWidth)
      )
    );

    const bottomFilename =
      typeof breadIngredient.filename === "string"
        ? breadIngredient.filename
        : breadIngredient.filename.bottom;
    const bottom = await getImage(
      `${baseUrl}/bread/${bottomFilename}`,
      ingredientWidth
    );

    const totalHeight = top.dimensions.height + middle.length * gap + gap;

    let currentY =
      totalHeight > CANVAS_SIZE
        ? 20
        : Math.round((CANVAS_SIZE - totalHeight) / 2);

    layers.push({
      input: top.buffer,
      top: currentY,
      left: top.leftMargin,
      blend: "dest-over" as const
    });

    currentY += top.dimensions.height;

    for (const { buffer, dimensions, leftMargin } of middle) {
      const layerY = currentY + gap - dimensions.height;

      layers.push({
        input: buffer,
        top: layerY,
        left: leftMargin,
        blend: "dest-over" as const
      });

      currentY += gap;
    }

    layers.push({
      input: bottom.buffer,
      top: currentY + gap - bottom.dimensions.height,
      left: bottom.leftMargin,
      blend: "dest-over" as const
    });

    layers.push({
      input: background.buffer,
      top: 0,
      left: 0,
      blend: "dest-over" as const
    });

    layers.push({
      input: background.buffer,
      top: background.dimensions.height,
      left: 0,
      blend: "dest-over" as const
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
      .composite(layers)
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

function getImageFactor(numIngredients) {
  // Linear interpolation.
  return Math.max(Math.min(0.6 - (0.22 / 5) * (numIngredients - 3), 0.6), 0.38);
}

export const config: Config = {
  method: "GET",
  path: "/sandwich-preview/:bread/*"
};

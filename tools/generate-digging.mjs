// Regenerate digging/action site photos at high quality.
// Usage: node --use-system-ca tools/generate-digging.mjs
import { writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(import.meta.dirname, "..", "assets", "img");
const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error("OPENAI_API_KEY is not set"); process.exit(1); }

const REAL =
  "Ultra-photorealistic construction site photograph, shot on a professional DSLR camera, " +
  "natural golden hour sunset lighting with warm orange glow and long shadows, dramatic sky " +
  "with orange and blue gradient and scattered clouds, realistic dirt texture and dust in the air, " +
  "sharp mechanical details on yellow heavy machinery, documentary industrial photography style, " +
  "no text, no watermark, no people, no CGI look, no illustration style.";

const IMAGES = [
  {
    name: "hero",
    size: "1536x1024",
    prompt:
      "Wide cinematic photograph of a large yellow hydraulic excavator actively digging on a mound of earth " +
      "at a construction site during sunset. The excavator bucket is raised with soil, dramatic golden hour " +
      "backlight, piles of excavated dirt, an articulated dump truck parked on the ground below. " + REAL,
  },
  {
    name: "service-excavation",
    size: "1024x1024",
    prompt:
      "Photorealistic close-to-medium shot of a yellow hydraulic excavator digging a deep trench in brown earth " +
      "at sunset. The bucket is inside the trench mid-dig, hydraulic arm extended, dramatic colorful sky with " +
      "orange clouds and blue tones, construction site with soil piles. " + REAL,
  },
  {
    name: "service-earthmoving",
    size: "1024x1024",
    prompt:
      "Photorealistic photograph of a yellow excavator beside a large yellow articulated dump truck at golden hour sunset, " +
      "carefully loading soil directly INTO the open rear dump bed. The bucket is above the truck bed, NOT on the hood or cab. " +
      "Correct earthmoving operation, side angle view, dust in warm light, dramatic sunset sky. " + REAL,
  },
];

async function generate({ name, prompt, size }) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-1", prompt, size, quality: "high", n: 1 }),
  });
  if (!res.ok) throw new Error(`${name}: ${res.status} ${await res.text()}`);
  const json = await res.json();
  const file = path.join(OUT, `${name}.png`);
  await writeFile(file, Buffer.from(json.data[0].b64_json, "base64"));
  console.log(`DONE ${name}`);
}

let failed = 0;
for (let i = 0; i < IMAGES.length; i += 2) {
  const results = await Promise.allSettled(IMAGES.slice(i, i + 2).map(generate));
  for (const r of results) {
    if (r.status === "rejected") { failed++; console.error("FAILED:", r.reason.message); }
  }
}
process.exit(failed === 0 ? 0 : 1);

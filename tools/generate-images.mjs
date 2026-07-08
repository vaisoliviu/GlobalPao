// One-shot script: generates site imagery via the OpenAI Images API.
// Usage: node tools/generate-images.mjs   (requires OPENAI_API_KEY env var)
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.resolve(import.meta.dirname, "..", "assets", "img");

const STYLE =
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
      "backlight, piles of excavated dirt, an articulated dump truck parked on the ground below. " + STYLE,
  },
  {
    name: "service-excavation",
    size: "1024x1024",
    prompt:
      "Photorealistic close-to-medium shot of a yellow hydraulic excavator digging a deep trench in brown earth " +
      "at sunset. The bucket is inside the trench mid-dig, hydraulic arm extended, dramatic colorful sky with " +
      "orange clouds and blue tones, construction site with soil piles. " + STYLE,
  },
  {
    name: "service-earthmoving",
    size: "1024x1024",
    prompt:
      "Photorealistic photograph of a yellow excavator beside a large yellow articulated dump truck at golden hour sunset, " +
      "carefully loading soil directly INTO the open rear dump bed. The bucket is above the truck bed, NOT on the hood or cab. " +
      "Correct earthmoving operation, side angle view, dust in warm light, dramatic sunset sky. " + STYLE,
  },
  {
    name: "service-demolition",
    size: "1024x1024",
    prompt:
      "An excavator with hydraulic breaker demolishing an old concrete structure, controlled demolition, rubble and dust. " + STYLE,
  },
  {
    name: "service-landscaping",
    size: "1024x1024",
    prompt:
      "A bulldozer grading and leveling terrain for landscape adjustment, freshly shaped earth slopes, green field edge visible. " + STYLE,
  },
  {
    name: "service-roadworks",
    size: "1024x1024",
    prompt:
      "A vibratory road roller compacting a fresh asphalt road under construction, road works scene. " + STYLE,
  },
  {
    name: "about-fleet",
    size: "1536x1024",
    prompt:
      "Wide shot of FOUR SEPARATE heavy construction machines parked in a row on a gravel yard at golden hour sunset, " +
      "with clear visible gaps between each vehicle. From left to right: a standalone hydraulic excavator on tracks, " +
      "then a standalone bulldozer with front blade, then a standalone dump truck, then a standalone road roller compactor. " +
      "Each machine is a complete distinct vehicle, NOT merged or fused together, NOT hybrid. " + STYLE,
  },
];

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) {
  console.error("OPENAI_API_KEY is not set");
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

async function generate({ name, prompt, size }) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size,
      quality: "high",
      n: 1,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${name}: HTTP ${res.status} ${body}`);
  }
  const json = await res.json();
  const b64 = json.data[0].b64_json;
  const file = path.join(OUT_DIR, `${name}.png`);
  await writeFile(file, Buffer.from(b64, "base64"));
  console.log(`DONE ${name} -> ${file}`);
}

let failed = 0;
// Two at a time to avoid rate limits.
for (let i = 0; i < IMAGES.length; i += 2) {
  const batch = IMAGES.slice(i, i + 2);
  const results = await Promise.allSettled(batch.map(generate));
  for (const r of results) {
    if (r.status === "rejected") {
      failed++;
      console.error("FAILED:", r.reason.message);
    }
  }
}

console.log(failed === 0 ? "ALL_IMAGES_OK" : `FINISHED_WITH_${failed}_FAILURES`);
process.exit(failed === 0 ? 0 : 1);

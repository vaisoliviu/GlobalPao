// One-shot script: generates site imagery via the OpenAI Images API.
// Usage: node tools/generate-images.mjs   (requires OPENAI_API_KEY env var)
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.resolve(import.meta.dirname, "..", "assets", "img");

const STYLE =
  "Professional photography style, golden hour warm light, slight haze and dust in the air, " +
  "high detail, realistic, construction industry, no text, no watermark, no people looking at camera.";

const IMAGES = [
  {
    name: "hero",
    size: "1536x1024",
    prompt:
      "Wide cinematic shot of a large yellow hydraulic excavator working on an earthworks construction site at sunrise, " +
      "piles of excavated soil, a dump truck in the background, dramatic sky. " + STYLE,
  },
  {
    name: "service-excavation",
    size: "1024x1024",
    prompt:
      "A hydraulic excavator digging a deep foundation trench on a construction site, bucket full of earth mid-swing. " + STYLE,
  },
  {
    name: "service-earthmoving",
    size: "1024x1024",
    prompt:
      "A large articulated dump truck being loaded with soil by an excavator, earthmoving operation on a big site. " + STYLE,
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
      "A lineup of heavy construction machinery parked on a gravel yard at dusk: excavator, bulldozer, dump truck and road roller, company fleet portrait. " + STYLE,
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
      quality: "medium",
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

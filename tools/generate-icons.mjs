// One-shot script: regenerates the fleet icons with REAL transparent backgrounds.
// Usage: node --use-system-ca tools/generate-icons.mjs   (requires OPENAI_API_KEY)
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.resolve(import.meta.dirname, "..", "assets", "img");

const STYLE =
  "Clean modern flat vector icon, side profile view, minimalist geometric shapes, " +
  "golden yellow #ffc400 body with dark charcoal #17181c details and outlines, " +
  "consistent icon-set style, centered with generous padding, no text, no shadow, no ground line.";

const ICONS = [
  { name: "icon-excavator", prompt: "A hydraulic tracked excavator with raised boom arm and bucket. " + STYLE },
  { name: "icon-bulldozer", prompt: "A tracked bulldozer with a large front blade. " + STYLE },
  { name: "icon-dumptruck", prompt: "A dump truck (tipper truck) with a raised-edge cargo bed. " + STYLE },
  { name: "icon-roller", prompt: "A road roller compactor with a large smooth steel front drum. " + STYLE },
];

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) {
  console.error("OPENAI_API_KEY is not set");
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

async function generate({ name, prompt }) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      quality: "medium",
      background: "transparent",
      output_format: "png",
      n: 1,
    }),
  });
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status} ${await res.text()}`);
  const json = await res.json();
  const file = path.join(OUT_DIR, `${name}.png`);
  await writeFile(file, Buffer.from(json.data[0].b64_json, "base64"));
  console.log(`DONE ${name}`);
}

let failed = 0;
for (let i = 0; i < ICONS.length; i += 2) {
  const results = await Promise.allSettled(ICONS.slice(i, i + 2).map(generate));
  for (const r of results) {
    if (r.status === "rejected") { failed++; console.error("FAILED:", r.reason.message); }
  }
}
console.log(failed === 0 ? "ALL_ICONS_OK" : `FINISHED_WITH_${failed}_FAILURES`);
process.exit(failed === 0 ? 0 : 1);

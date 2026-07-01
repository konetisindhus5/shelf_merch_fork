import sharp from "sharp";
import { rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, "../assets");

const files = [
  "tote.png",
  "template.png",
  "mug.png",
  "hoodie.png",
  "diary.png",
  "cap.png",
  "bottle.png",
];

function colorDist(a, b) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

function isCheckerColor(rgb, checkerColors, tolerance) {
  return checkerColors.some((c) => colorDist(rgb, c) <= tolerance);
}

function detectCheckerColors(data, width, height) {
  const samples = [];
  const step = Math.max(2, Math.floor(Math.min(width, height) / 60));

  for (let x = 0; x < width; x += step) {
    samples.push([x, 0], [x, height - 1]);
  }
  for (let y = 0; y < height; y += step) {
    samples.push([0, y], [width - 1, y]);
  }

  const buckets = new Map();
  for (const [x, y] of samples) {
    const i = (y * width + x) * 4;
    const key = `${data[i]},${data[i + 1]},${data[i + 2]}`;
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  const top = [...buckets.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([key]) => key.split(",").map(Number));

  const merged = [];
  for (const rgb of top) {
    if (!merged.some((c) => colorDist(c, rgb) < 20)) merged.push(rgb);
    if (merged.length >= 2) break;
  }

  return merged.length >= 2 ? merged : [[255, 255, 255], [204, 204, 204]];
}

function markTransparent(data, width, height, channels, checkerColors) {
  const total = width * height;
  const transparent = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const mark = (idx) => {
    if (transparent[idx]) return;
    transparent[idx] = 1;
    queue[tail++] = idx;
  };

  const tryMarkChecker = (idx) => {
    if (transparent[idx]) return;
    const i = idx * channels;
    const rgb = [data[i], data[i + 1], data[i + 2]];
    if (!isCheckerColor(rgb, checkerColors, 32)) return;
    mark(idx);
  };

  for (let x = 0; x < width; x++) {
    tryMarkChecker(x);
    tryMarkChecker((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    tryMarkChecker(y * width);
    tryMarkChecker(y * width + (width - 1));
  }

  while (head < tail) {
    const idx = queue[head++];
    const x = idx % width;
    const y = (idx - x) / width;
    if (x > 0) tryMarkChecker(idx - 1);
    if (x < width - 1) tryMarkChecker(idx + 1);
    if (y > 0) tryMarkChecker(idx - width);
    if (y < height - 1) tryMarkChecker(idx + width);
  }

  // Remove enclosed checkerboard pockets (handle openings, etc.).
  for (let idx = 0; idx < total; idx++) {
    if (transparent[idx]) continue;
    const i = idx * channels;
    const rgb = [data[i], data[i + 1], data[i + 2]];
    if (isCheckerColor(rgb, checkerColors, 8)) transparent[idx] = 1;
  }

  let count = 0;
  for (let idx = 0; idx < total; idx++) {
    if (!transparent[idx]) continue;
    data[idx * channels + 3] = 0;
    count++;
  }

  return count;
}

async function removeCheckerboard(filePath) {
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const checkerColors = detectCheckerColors(data, width, height);
  const transparent = markTransparent(data, width, height, channels, checkerColors);

  const out = await sharp(data, { raw: { width, height, channels } }).png().toBuffer();
  const tempPath = `${filePath}.tmp.png`;
  await writeFile(tempPath, out);
  try {
    await rename(tempPath, filePath);
  } catch (err) {
    await unlink(tempPath).catch(() => {});
    throw err;
  }

  return { width, height, checkerColors, transparent, total: width * height };
}

async function main() {
  for (const file of files) {
    const filePath = path.join(assetsDir, file);
    const result = await removeCheckerboard(filePath);
    console.log(
      `${file}: ${result.width}x${result.height} checker=${JSON.stringify(result.checkerColors)} transparent=${result.transparent}/${result.total}`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

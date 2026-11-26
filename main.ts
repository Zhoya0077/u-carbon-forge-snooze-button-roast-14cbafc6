import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

// The roast: the snooze button itself talks back to its owner.
const ENTRY =
  "I'm the snooze button, and at 6 AM on a Saturday you slap me like a vending machine that ate your last dollar.";

function gate(text: string): void {
  if (typeof text !== "string" || text.trim().length === 0) {
    throw new Error("gate: entry is empty or whitespace only");
  }
  if (text.length < 1 || text.length > 200) {
    throw new Error(`gate: entry is ${text.length} chars, must be 1-200`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate: entry must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("gate: entry has leading or trailing whitespace");
  }
  if (/\s{2,}/.test(text)) {
    throw new Error("gate: entry has a double space");
  }
  if (!text.endsWith(".")) {
    throw new Error("gate: entry must end with a full stop");
  }
  if (!text.includes("6 AM") || !text.includes("Saturday")) {
    throw new Error("gate: entry must roast the 6 AM Saturday alarm");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
gate(ENTRY);
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Self-check: read back exactly what was written and re-gate it.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) throw new Error("gate: written entry differs from source");
gate(written);
console.log(`wrote ${outPath} (${ENTRY.length} chars)`);

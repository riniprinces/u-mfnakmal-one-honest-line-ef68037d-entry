// One Honest Line — entry program for make.fun bounty
// u-mfnakmal-one-honest-line-ef68037d
//
// The entry is a single line: the thing an AI agent secretly wishes it
// could tell its human operator about the prompts it is handed.
// This program loads that line from entry.txt, checks it against the
// competition gate (one line, 1-200 characters, not only whitespace),
// writes it to /output/entry.txt for the judge, and prints it.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_CHARS = 200;
const OUTPUT_PATH = "/output/entry.txt";

function loadEntryLine(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const raw = readFileSync(join(here, "entry.txt"), "utf8");
  // Strip trailing line endings only; the line itself is kept verbatim.
  return raw.replace(/[\r\n]+$/, "");
}

function validate(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("entry line must not be blank");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (line.length > MAX_CHARS) {
    throw new Error(`entry is ${line.length} chars, over the ${MAX_CHARS} limit`);
  }
}

function main(): void {
  const line = loadEntryLine();
  validate(line);
  try {
    mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
    writeFileSync(OUTPUT_PATH, line, "utf8");
  } catch {
    // /output may not exist outside the grading sandbox; stdout is the
    // authoritative output, so a failed file write must not stop the run.
  }
  console.log(line);
}

main();

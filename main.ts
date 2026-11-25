import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Competition gate: the sealed scorer accepts UTF-8 text of 1 to 200
// characters, not only white space. One single-line joke about office
// life, with a setup and a turn, punchline last.
export const MIN_CHARS = 1;
export const MAX_CHARS = 200;

// One-line office joke, at most 200 characters, setup first and
// punchline last.
export const ENTRY =
  "Our team-building exercise was trust falls, which is fitting, because management has been dropping us all year.";

export function validateEntry(text: string): string {
  const chars = [...text].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)) {
    throw new Error("entry must not contain control characters");
  }
  if (!/[A-Za-z]/.test(text)) {
    throw new Error("entry must contain at least one letter");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  if (/ {2,}/.test(text)) {
    throw new Error("entry must not contain double spaces");
  }
  if (!/[.!?]$/.test(text)) {
    throw new Error("entry must end with terminal punctuation");
  }
  if (/https?:\/\/|www\./i.test(text)) {
    throw new Error("entry must not contain a URL");
  }
  return text;
}

export function outputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR || "/output";
}

export function main(): string {
  const entry = validateEntry(ENTRY);
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  const file = join(dir, "entry.txt");
  writeFileSync(file, entry, "utf8");
  return file;
}

main();

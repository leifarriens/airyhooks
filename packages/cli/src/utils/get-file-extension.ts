export function getFileExtension(
  ext: "js" | "jsx" | "none" | "ts" | "tsx",
): string {
  if (ext === "none") {
    return "";
  } else {
    return `.${ext}`;
  }
}

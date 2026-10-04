import katex from "katex";
const escape = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
export function proofText(text: string) {
  return text
    .split(/(\$[^$]+\$)/g)
    .map((part) =>
      part.startsWith("$") && part.endsWith("$")
        ? katex.renderToString(part.slice(1, -1).replaceAll("’", "'"), {
            throwOnError: true,
          })
        : escape(part),
    )
    .join("");
}
export const noteAnchor = (title: string) =>
  title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s/g, "-");

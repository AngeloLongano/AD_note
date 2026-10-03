import { readFileSync } from "node:fs";
export const prerender = true;
export function GET() {
  return new Response(
    readFileSync("output/pdf/cookbook/cookbook-algoritmi-distribuiti.pdf"),
    {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'inline; filename="cookbook-algoritmi-distribuiti.pdf"',
      },
    },
  );
}

// docGenerator.js — Uses OpenAI to generate README and API docs

import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export async function generateDocs(repo, fileContents) {
  // Build a combined code summary to send to OpenAI
  const codeSummary = fileContents
    .map(f => `### File: ${f.path}\n\`\`\`\n${f.content.slice(0, 1500)}\n\`\`\``)
    .join("\n\n");

  const repoName = repo.split("/")[1];

  // --- Generate README ---
  console.log("   📝 Generating README.md...");
  const readmeRes = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert software technical writer. 
Generate clean, professional Markdown documentation.
Always use proper Markdown formatting with headers, code blocks, and badges.`,
      },
      {
        role: "user",
        content: `Generate a complete README.md for a GitHub project named "${repoName}".

Based on these source files:
${codeSummary}

The README must include:
1. Project title with a relevant emoji
2. One-line description
3. Shields.io badges (license, language)
4. Features list (bullet points)
5. Installation steps (with code blocks)
6. Usage examples (with code blocks)
7. Project structure (file tree)
8. Contributing section
9. License section

Make it professional and well-structured.`,
      },
    ],
    max_tokens: 1500,
  });

  const readme = readmeRes.choices[0].message.content;

  // --- Generate API Docs ---
  console.log("   📋 Generating API_DOCS.md...");
  const apiRes = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert at writing API and code documentation.
Generate clear, developer-friendly Markdown documentation.`,
      },
      {
        role: "user",
        content: `Generate API documentation for the project "${repoName}".

Based on these source files:
${codeSummary}

The API docs must include:
1. Title: "API Documentation — ${repoName}"
2. Overview section
3. For each file: list all functions/methods with:
   - Function name
   - Description
   - Parameters (name, type, description)
   - Return value
   - Example usage
4. Environment variables section (list any process.env or os.environ usage found)
5. Error handling notes

Format everything as clean Markdown.`,
      },
    ],
    max_tokens: 1500,
  });

  const apiDocs = apiRes.choices[0].message.content;

  return { readme, apiDocs };
}
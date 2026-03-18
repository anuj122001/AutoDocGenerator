#!/usr/bin/env node

import dotenv from "dotenv";
import { fetchRepoFiles, getFileContent, pushFilesToRepo } from "./githubClient.js";
import { generateDocs } from "./docGenerator.js";
import chalk from "chalk";

dotenv.config();

// Validate required environment variables
const missing = [];
if (!process.env.OPENAI_API_KEY) missing.push("OPENAI_API_KEY");
if (!process.env.GITHUB_TOKEN)   missing.push("GITHUB_TOKEN");
if (missing.length > 0) {
  console.error(chalk.red(`\n❌ Missing environment variables: ${missing.join(", ")}`));
  console.error(chalk.gray("   Make sure your .env file exists and contains these keys.\n"));
  process.exit(1);
}

const repo = process.argv[2];

if (!repo) {
  console.error(chalk.red("❌ Please provide a GitHub repo: node index.js owner/repo"));
  process.exit(1);
}

console.log(chalk.cyan(`\n🚀 Auto Doc Generator`));
console.log(chalk.gray(`   Repo: ${repo}\n`));

async function run() {
  try {
    // Step 1: Fetch file tree from repo
    console.log(chalk.yellow("📂 Fetching repository file structure..."));
    const files = await fetchRepoFiles(repo);
    const codeFiles = files.filter(f =>
      f.type === "blob" &&
      /\.(js|ts|py|java|cpp|c|go|rb|rs|php|cs)$/.test(f.path) &&
      !f.path.includes("node_modules") &&
      !f.path.includes(".min.")
    ).slice(0, 10); // limit to 10 files to stay within token limits

    if (codeFiles.length === 0) {
      console.log(chalk.red("❌ No supported code files found in this repo."));
      process.exit(1);
    }

    console.log(chalk.green(`✅ Found ${codeFiles.length} code files to analyze.\n`));

    // Step 2: Read file contents
    console.log(chalk.yellow("📖 Reading file contents..."));
    const fileContents = [];
    for (const file of codeFiles) {
      const content = await getFileContent(repo, file.path);
      if (content) {
        fileContents.push({ path: file.path, content });
        console.log(chalk.gray(`   ✔ ${file.path}`));
      }
    }

    // Step 3: Generate docs using OpenAI
    console.log(chalk.yellow("\n🤖 Generating documentation with AI...\n"));
    const { readme, apiDocs } = await generateDocs(repo, fileContents);

    console.log(chalk.green("✅ Documentation generated!\n"));

    // Step 4: Push docs back to GitHub
    console.log(chalk.yellow("📤 Pushing docs to repository..."));
    await pushFilesToRepo(repo, [
      { path: "README.md", content: readme, message: "docs: auto-generated README" },
      { path: "API_DOCS.md", content: apiDocs, message: "docs: auto-generated API docs" },
    ]);

    console.log(chalk.green("\n✅ Done! Documentation has been pushed to your repo."));
    console.log(chalk.cyan(`   👉 https://github.com/${repo}\n`));

  } catch (err) {
    console.error(chalk.red("\n❌ Error:"), err.message);
    process.exit(1);
  }
}

run();
import dotenv from "dotenv";
dotenv.config();

const BASE = "https://api.github.com";

function getHeaders() {
  const token = process.env.GITHUB_TOKEN;
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function fetchRepoFiles(repo) {
  const headers = getHeaders();
  const [owner, repoName] = repo.split("/");

  const repoRes = await fetch(`${BASE}/repos/${owner}/${repoName}`, { headers });
  if (!repoRes.ok) {
    const errBody = await repoRes.json().catch(() => ({}));
    throw new Error(`GitHub API error (${repoRes.status}): ${errBody.message}`);
  }
  const repoData = await repoRes.json();
  const branch = repoData.default_branch;

  const treeRes = await fetch(
    `${BASE}/repos/${owner}/${repoName}/git/trees/${branch}?recursive=1`,
    { headers }
  );
  if (!treeRes.ok) throw new Error("Failed to fetch repo file tree.");
  const treeData = await treeRes.json();
  return treeData.tree || [];
}

export async function getFileContent(repo, filePath) {
  const headers = getHeaders();
  const [owner, repoName] = repo.split("/");
  const res = await fetch(
    `${BASE}/repos/${owner}/${repoName}/contents/${filePath}`,
    { headers }
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (data.encoding === "base64") {
    return Buffer.from(data.content, "base64").toString("utf-8");
  }
  return null;
}

export async function pushFilesToRepo(repo, files) {
  const headers = getHeaders();
  const [owner, repoName] = repo.split("/");
  for (const file of files) {
    const encoded = Buffer.from(file.content).toString("base64");
    let sha = null;
    const checkRes = await fetch(
      `${BASE}/repos/${owner}/${repoName}/contents/${file.path}`,
      { headers }
    );
    if (checkRes.ok) {
      const existing = await checkRes.json();
      sha = existing.sha;
    }
    const body = {
      message: file.message,
      content: encoded,
      ...(sha && { sha }),
    };
    const pushRes = await fetch(
      `${BASE}/repos/${owner}/${repoName}/contents/${file.path}`,
      { method: "PUT", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify(body) }
    );
    if (!pushRes.ok) {
      const err = await pushRes.json();
      throw new Error(`Failed to push ${file.path}: ${err.message}`);
    }
    console.log(`   ✔ Pushed ${file.path}`);
  }
}

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createServer } from "node:net";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";

const projectRoot = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
let nextServer;
let baseUrl;
let serverOutput = "";

async function getAvailablePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 3000;
  await new Promise((resolve) => server.close(resolve));
  return port;
}

before(async () => {
  const port = await getAvailablePort();
  baseUrl = `http://127.0.0.1:${port}`;
  const nextCli = join(projectRoot, "node_modules", "next", "dist", "bin", "next");

  nextServer = spawn(process.execPath, [nextCli, "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: projectRoot,
    env: { ...process.env, NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
  });

  nextServer.stdout.on("data", (chunk) => { serverOutput += chunk.toString(); });
  nextServer.stderr.on("data", (chunk) => { serverOutput += chunk.toString(); });

  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (nextServer.exitCode !== null) {
      throw new Error(`Next.js production server stopped early.\n${serverOutput}`);
    }
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Next.js production server did not become ready.\n${serverOutput}`);
}, { timeout: 30_000 });

after(() => {
  nextServer?.kill();
});

test("serves the Bizim Endüstriyel storefront from the production root route", async () => {
  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Bizim Endüstriyel/);
  assert.match(html, /İşiniz/);
  assert.match(html, /Profesyonel hırdavat/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("serves critical public assets", async () => {
  const [favicon, hero, optimizedHero] = await Promise.all([
    fetch(`${baseUrl}/favicon.png`),
    fetch(`${baseUrl}/images/hero-workbench.jpg`),
    fetch(`${baseUrl}/_next/image?url=%2Fimages%2Fhero-workbench.jpg&w=1080&q=75`),
  ]);

  assert.equal(favicon.status, 200);
  assert.match(favicon.headers.get("content-type") ?? "", /^image\/png\b/i);
  assert.equal(hero.status, 200);
  assert.match(hero.headers.get("content-type") ?? "", /^image\/jpeg\b/i);
  assert.equal(optimizedHero.status, 200);
  assert.match(optimizedHero.headers.get("content-type") ?? "", /^image\//i);
});

test("keeps Vercel and Next.js configuration free of Vinext runtime references", async () => {
  const [page, layout, packageJson, vercelConfig] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /SEPETE EKLE/);
  assert.match(layout, /lang="tr"/);
  assert.match(packageJson, /"build": "next build"/);
  assert.match(packageJson, /"next": "16\.2\.6"/);
  assert.match(vercelConfig, /"framework": "nextjs"/);
  assert.doesNotMatch(packageJson, /vinext|wrangler|cloudflare/i);
});

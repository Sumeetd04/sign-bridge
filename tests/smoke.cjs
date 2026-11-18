const { chromium } = require("@playwright/test");
const bundled = require("@sparticuz/chromium").default;
const assert = require("node:assert/strict");
(async () => {
  const path = require("node:path");
  await require("@sparticuz/chromium").inflate(
    path.resolve(
      path.dirname(require.resolve("@sparticuz/chromium")),
      "../bin/al2023.tar.br",
    ),
  );
  process.env.LD_LIBRARY_PATH = [
    "/tmp/al2023/lib",
    process.env.LD_LIBRARY_PATH || "",
  ]
    .filter(Boolean)
    .join(":");
  const browser = await chromium.launch({
    executablePath: await bundled.executablePath(),
    args: bundled.args,
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:3000");
  await page.getByRole("heading", { name: /A little practice/ }).waitFor();
  await page.screenshot({
    path: "/tmp/signbridge-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: /Start your journey/ }).click();
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Next sign" }).click();
  await page.getByRole("button", { name: "Complete lesson" }).click();
  await page.getByRole("link", { name: "My progress" }).click();
  assert.equal(await page.locator(".stat-value").nth(1).innerText(), "1 / 4");
  await page.getByRole("link", { name: "Sign dictionary" }).click();
  await page.getByRole("searchbox").fill("thank");
  assert.equal(await page.locator(".sign-card").count(), 1);
  await page
    .getByRole("button", { name: "Save Thank you", exact: true })
    .click();
  await page.reload();
  await page.getByRole("button", { name: /Show saved/ }).click();
  assert.equal(await page.locator(".sign-card").count(), 1);
  await page.getByRole("link", { name: "Quizzes & practice" }).click();
  for (let i = 0; i < 5; i++) {
    await page.locator("[data-answer]").first().click();
    await page
      .getByRole("button", {
        name: i === 4 ? "See my results" : "Next question",
      })
      .click();
  }
  await page.getByText("Session complete", { exact: true }).waitFor();
  await page.getByRole("link", { name: "Voice to sign" }).click();
  await page.getByRole("textbox", { name: "Word to look up" }).fill("hello");
  await page.getByRole("button", { name: "Find a sign" }).click();
  await page
    .locator("#voice-output h3")
    .getByText("Hello", { exact: true })
    .waitFor();
  await page.getByRole("link", { name: "Text to speech" }).click();
  await page.getByRole("button", { name: "Say hello" }).click();
  assert.equal(
    await page.locator("#speak-text").inputValue(),
    "Hello! My name is…",
  );
  await page.getByRole("link", { name: "Camera practice" }).click();
  await page.getByLabel("Practice sign").selectOption("thanks");
  await page.locator("#practice-guide h3").getByText("Thank you").waitFor();
  await page
    .getByRole("button", { name: "Sign in or create an account" })
    .click();
  await page.getByRole("button", { name: "New here? Join us" }).click();
  await page.getByLabel("Your name").fill("Test Learner");
  await page.getByLabel("Email address").fill(`test-${Date.now()}@example.com`);
  await page.getByLabel("Password", { exact: true }).fill("TestPassword123!");
  await page
    .getByRole("button", { name: "Create account", exact: false })
    .click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.reload();
  await page.getByRole("button", { name: "Account: Test Learner" }).waitFor();
  await page.getByRole("link", { name: "My progress" }).click();
  assert.equal(await page.locator(".stat-value").nth(1).innerText(), "1 / 4");
  await page.getByRole("button", { name: "Account: Test Learner" }).click();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:3000/#home");
  await page.getByRole("heading", { name: /A little practice/ }).waitFor();
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Mobile overflow",
  );
  await page.screenshot({ path: "/tmp/signbridge-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.getByRole("link", { name: "Sign dictionary" }).click();
  await page.getByRole("searchbox").waitFor();
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Dictionary mobile overflow",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: dashboard, lessons, persistence, dictionary, bookmarks, quiz, voice lookup, speech presets, camera guides, account registration/logout, account progress sync, mobile navigation and overflow, no JS errors.",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

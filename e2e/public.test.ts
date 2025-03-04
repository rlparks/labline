import { expect, test } from "@playwright/test";

test("public header has expected look", async ({ page }) => {
	await page.goto("/");

	await expect(page.getByRole("link", { name: "labline" })).toBeVisible();
	await expect(page.locator("h4")).toContainText("labline");
	await expect(page.getByAltText("labline logo")).toBeVisible();
	await expect(page.getByRole("button", { name: "Login" })).toBeVisible();

	// user buttons shouldn't exist
	await expect(page.getByRole("link", { name: "Search by Building" })).not.toBeVisible();
	await expect(page.getByRole("link", { name: "Search All Labs" })).not.toBeVisible();
	await expect(page.getByRole("link", { name: "Summary" })).not.toBeVisible();
	await expect(page.getByRole("link", { name: "Admin" })).not.toBeVisible();

	await expect(page.getByRole("banner")).toMatchAriaSnapshot(`
      - banner:
        - navigation:
          - link "labline logo labline":
            - img "labline logo"
            - heading "labline" [level=4]
          - button "login Login"
      `);
});

test("public footer has expected look", async ({ page }) => {
	await page.goto("/");

	await expect(page.getByText("Created by Rebecca Parks at")).toBeVisible();
	await expect(page.locator("#right")).toContainText("Created by Rebecca Parks at ESD");

	await expect(page.getByRole("link", { name: "ESD" })).toBeVisible();
	await expect(page.getByRole("contentinfo")).toMatchAriaSnapshot(`
      - contentinfo:
        - navigation:
          - text: Created by Rebecca Parks at
          - link "ESD"
      `);
	await expect(page.getByRole("link", { name: "ESD" })).toHaveAttribute(
		"href",
		"https://esd.uga.edu/",
	);
});

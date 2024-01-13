const { test, expect } = require("@playwright/test");
import { loop } from "./utils/loop";
import { CURSOR, ARROW, placeOverlay, removeOverlays } from "./utils/overlay";
const { start, stop } = require("./utils/evcc");

const BASE_PATH = "features/screenshots";

test.beforeAll(async () => {
  await start("vehicles.evcc.yaml");
});
test.afterAll(async () => {
  await stop();
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

loop((screenshot) => {
  test("min soc / limit soc / limit energy", async ({ page }) => {
    await page.goto(`/`);

    await expect(
      page.getByRole("button", { name: "blue IONIQ 6" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "white Model 3" }),
    ).toBeVisible();

    await page.locator("[data-testid=charging-plan] button").first().click();
    await wait(300);
    await page
      .locator("#chargingPlanModal_1 .nav-tabs .nav-item")
      .last()
      .click();
    await page.locator("#chargingplan_1_minsoc").selectOption("25");
    await placeOverlay(page, "#chargingplan_1_minsoc", CURSOR, 70, 5);
    await screenshot(
      page,
      `${BASE_PATH}/minsoc-setting`,
      "#chargingPlanModal_1 .modal-content",
      {
        all: 20,
      },
    );
    await removeOverlays(page);
    await page.locator("#chargingPlanModal_1 [aria-label=Close]").click();
    await wait(500);
    await screenshot(
      page,
      `${BASE_PATH}/minsoc-loadpoint`,
      ".container--loadpoint > .carousel > div:nth-child(1)",
      {
        all: 20,
      },
    );

    await page.locator("[data-testid=charging-plan] button").last().click();
    await wait(300);
    await page
      .locator("#chargingPlanModal_2 .nav-tabs .nav-item")
      .last()
      .click();
    await page.locator("#chargingplan_2_limitsoc").selectOption("80");
    await placeOverlay(page, "#chargingplan_2_limitsoc", CURSOR, 70, 5);
    await screenshot(
      page,
      `${BASE_PATH}/limitsoc-setting`,
      "#chargingPlanModal_2 .modal-content",
      {
        all: 20,
      },
    );
    await removeOverlays(page);
    await page.locator("#chargingPlanModal_2 [aria-label=Close]").click();
    await page
      .getByTestId("limit-soc")
      .locator("select")
      .last()
      .selectOption("90");
    await wait(500);
    await placeOverlay(
      page,
      ".container--loadpoint > .carousel > div:nth-child(2) [data-testid=limit-soc] select",
      CURSOR,
      15,
      0,
    );
    await screenshot(
      page,
      `${BASE_PATH}/limitsoc-loadpoint`,
      ".container--loadpoint > .carousel > div:nth-child(2)",
      {
        all: 20,
      },
    );

    // limit energy
    await page.getByRole("button", { name: "white Model 3" }).click();
    await page.getByRole("button", { name: "red Fiat 500e" }).click();
    await expect(
      page.getByRole("button", { name: "red Fiat 500e" }),
    ).toBeVisible();
    await page
      .getByTestId("limit-energy")
      .locator("select")
      .last()
      .selectOption("30");
    await wait(500);
    await screenshot(
      page,
      `${BASE_PATH}/limitenergy-loadpoint`,
      ".container--loadpoint > .carousel > div:nth-child(2)",
      {
        all: 20,
      },
    );
  });
});

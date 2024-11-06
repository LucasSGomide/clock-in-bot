async function legacyBotRunClockIn() {
    const browser = await puppeteer.launch({ headless: false });
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(process.env.CLOCK_IN_URL, ["geolocation"]);
  
    const page = await browser.newPage();
    await page.goto(process.env.LOGIN_URL);
  
    await page.evaluate(() => {
      localStorage.setItem("modalAlreadyDisplayed", "true");
    });
  
    const loginInput = await page.waitForSelector(
      '[placeholder="Enter your user"]'
    );
    await loginInput.type(process.env.USER_LOGIN);
  
    const passwordInput = await page.waitForSelector(
      '[placeholder="Enter your password"]'
    );
    await passwordInput.type(process.env.USER_PASSWORD);
  
    await page.click(
      'button[type="button"].po-button.po-text-ellipsis.po-button-primary'
    );
  
    await page.waitForSelector('li p[aria-label="Menu Attendance"]');
    await page.goto(process.env.CLOCK_IN_URL);
  
    const swipeButton = await page.waitForSelector("#div-swipeButtonText");
    await swipeButton.click({ clickCount: 2 });
  
    await page.waitForSelector("#div-swipeButtonOperationSuccessText");
    // await browser.close()
  }
require("dotenv").config();
const { argv } = require("node:process");
const schedule = require("node-schedule");
const puppeteer = require("puppeteer");
const moment = require("moment");

async function runClockIn() {
  const browser = await puppeteer.launch({ headless: false });
  const context = browser.defaultBrowserContext();
  await context.overridePermissions(process.env.CLOCK_IN_URL, ["geolocation"]);

  const page = await browser.newPage();
  await page.goto(process.env.LOGIN_URL);

  await page.evaluate(() => {
    localStorage.setItem("terms@lastVerify", new Date().toISOString());
  });

  const loginInput = await page.waitForSelector('#login input#matricula');
  await loginInput.type(process.env.USER_LOGIN);

  const passwordInput = await page.waitForSelector('[placeholder="Senha"]');
  await passwordInput.type(process.env.USER_PASSWORD);

  await page.click('#boxLogin button.btn.btn-primary.pull-right');

  // await page.waitForSelector('li p[aria-label="Menu Attendance"]');
  // await page.goto(process.env.CLOCK_IN_URL);

  // const swipeButton = await page.waitForSelector("#div-swipeButtonText");
  // await swipeButton.click({ clickCount: 2 });

  // await page.waitForSelector("#div-swipeButtonOperationSuccessText");
  // await browser.close()
}

const timeToSchedule = argv && argv.length > 2 && argv[2].split(":");
const isSchedule = Boolean(timeToSchedule);
const executionTime = isSchedule
  ? moment().hour(timeToSchedule[0]).minute(timeToSchedule[1]).second(30)
  : moment();
const displayTime = executionTime.format("dddd, MMM D, YYYY, h:mm:ss a");

console.log("Start clock-in scheduler execution...");
isSchedule
  ? console.log(`Scheduled time: ${displayTime}`)
  : console.log("No scheduled time, clock-in will run right now...");

isSchedule
  ? schedule.scheduleJob(executionTime.toDate(), runClockIn)
  : runClockIn();

const puppeteer = require('puppeteer')


async function start() {
    // launching the browser with await
    const browser = await puppeteer.launch()
    // creating new tab or new page in browser
    const page = await browser.newPage()
    // goto the page you want to visit
    await page.goto("https://learnwebcode.github.io/practice-requests/")
    // take a screen shot of a page
    await page.screenshot({path: "amazing.png"})
    // close browser
    await browser.close

}
// calling the start fuction
start()
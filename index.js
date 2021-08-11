const puppeteer = require('puppeteer')
//use promise so no messy call back code
const fs = require('fs').promises
const cron = require("node-cron")

async function start() {
    // launching the browser with await
    const browser = await puppeteer.launch()

    // creating new tab or new page in browser
    const page = await browser.newPage()

    // goto the page you want to visit
    await page.goto("https://learnwebcode.github.io/practice-requests/")
    // take a screen shot of a page... fullpage: true.. take entire page screen shot.
    // await page.screenshot({path: "amazing.png",  fullPage: true })
  

    const names = await page.evaluate(() =>{
       return Array.from(document.querySelectorAll(".info strong")).map( x => x.textContent)
    })
    //   \r\n = return and new line
    await fs.writeFile("names.txt", names.join("\r\n"))
     // targeting a click me button.
     await page.click("#clickme")
     // Single $eval is for selecting a single element.
     const clickedData = await page.$eval("#data", el => el.textContent)
     console.log(clickedData)
    // eval function made to select multiple elements... getting all imgs
    const photos = await page.$$eval("img" , (imgs)=> {
        return imgs.map(x => x.src )
    })
    // selecting the form on the test website and entering blue then clicking and waiting for nav.
    await page.type("#ourfield", "blue")
    // use promis.all to await both commands to finish.
    await Promise.all([page.click("#ourform button"), page.waitForNavigation()])    
    // waiting for previous steps the selecting message element text content.   
    const info = await page.$eval("#message", el => el.textContent)
    console.log(info)

    // telling the program to navigate all the photo urls
    for (const photo of photos){
        const imgPage = await page.goto(photo)
        await fs.writeFile(photo.split("/").pop() , await imgPage.buffer())
    }
    
    // close browser
    await browser.close
}
// set the program to run every 5 seconds
// setInterval(start, 5000)
// calling the start fuction
// start()
// scheduling the program to run at certain tinmes using cron
cron.schedule("*/5* * * * *", start)
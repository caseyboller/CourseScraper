const puppeteer = require('puppeteer');
const $ = require('cheerio');
const getTopResult = require('./getTopResult')
const getCourseReqs = require('./getCourseReqs')


async function getCourses (url) {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url);
            let courses = await page.evaluate(() => {
                let results = [];
                let items = document.querySelectorAll('tr > td > div > a');
                items.forEach((item) => {
                    results.push({
                        course: item.innerText,
                        link: item.getAttribute('href'),   
                    });
                });
                return results;
            })

            // WORK IN PROGRESs
            let yearNexts = await page.evaluate(() => {
                let results = [];
                //let items =  $("h5:contains('YEAR')").parentsUntil('tr');
                let items =  $("h5:contains('YEAR')");
                for (i = 0; i < items.length; i++) {
                    results.push(
                        [items.get(i).innerText]
                    )
                }
                return results;
            })
            console.log(yearNexts)
            browser.close();
            return resolve(courses);

        } catch (e) {
            return reject(e);
        }
    })
}
module.exports = getCourses;

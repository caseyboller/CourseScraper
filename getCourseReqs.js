const puppeteer = require('puppeteer');
const $ = require('cheerio');

function getCourseReqs (url) {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url);

            let results = await page.evaluate(() => {
                // if ($("h2:contains('Corequisite')").next().text() == 'Nil') {
                coreqsList = [];
                // Find the heading for "Corequisites" and then traverse to the table after it
                $("h2:contains('Corequisite')").next()
                // find the table content
                .find('div.table-content').each(function(i, item) {
                    // add each item to the list
                    coreqsList.push($(this).text().trim());
                });

                prereqsList = [];
                $("h2:contains('Prerequisite')").next()
                .find('div.table-content').each(function(i, item) {
                    prereqsList.push($(this).text().trim());
                });
                return [coreqsList, prereqsList];
            }).catch(function (errr) {
                console.log(errr);
            })
            
            browser.close();
            return resolve(results);

        } catch (e) {
            return reject(e);
        }
    })
}

module.exports = getCourseReqs;

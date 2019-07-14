const puppeteer = require('puppeteer');
const $ = require('cheerio');

function getTopResult (searchTerm = 'computer') {
    searchTerm = searchTerm.replace(' ', '+');
    searchUrl = 'https://search.unisa.edu.au/s/search.html?query=' + searchTerm +
    '&f.Tabs%7Ctab=Degrees+%26+Courses&collection=study-search&f.Student+Type|pmpProgramsStudentType=Australian'
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(searchUrl);
            let course = await page.evaluate(() => {
                let results = [];
                let item = document.querySelector('#all > div.row.search-listing-content.margin-top > div.columns.large-9.large-push-3 > div:nth-child(1) > div:nth-child(1) > div > h3 > a');
                var shortLink = item.getAttribute('href');
                shortLink = shortLink.substring(shortLink.indexOf('study.unisa'), shortLink.indexOf('index_url')-1)
                shortLink = shortLink.replace(/%2F/g, '/');
                shortLink = 'https://' + shortLink;
                return ({
                    course: item.innerText,
                    link: shortLink,
                });
            })
            browser.close();
            return resolve(course);

        } catch (e) {
            return reject(e);
        }
    })
}

module.exports = getTopResult;
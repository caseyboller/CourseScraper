const puppeteer = require('puppeteer');
const $ = require('cheerio');
const getTopResult = require('./getTopResult')

if (process.argv.length < 3) {
    console.log('Please enter an argument (node .\\getCourses.js \'search terms here\')');
    return undefined;
}

function getCourses (url) {
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
            browser.close();
            return resolve(courses);

        } catch (e) {
            return reject(e);
        }
    })
}

try {
    getTopResult(process.argv[2])
    .then(function (res) {
        console.log('Top result for \"' + process.argv[2] + '\" is:\n>> ' + res['course'])
        var url = res['link']
        console.log(url)
        return url;
    })
    .then(function(searchUrl) {
        getCourses(searchUrl).then(function(data) {
            for (var i=0;i<data.length;i++) {
                console.log(i+1 + '.', data[i]['course'])
            }
            return data;
        });
    })
    .catch(function (err) {
        console.log('Probably no courses found, try a different search :(');
        // console.log(err);
        process.exit();
    });
} catch (e) {
    console.log('Ahh!')
    console.log(e);
    process.exit();
}


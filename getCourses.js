const puppeteer = require('puppeteer');
const $ = require('cheerio');
const getTopResult = require('./getTopResult')
const getCourseReqs = require('./getCourseReqs')

if (process.argv.length < 3) {
    console.log('Please enter an argument (node .\\getCourses.js \'search terms here\')');
    return undefined;
}

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
                    // let reqs = (async () => {
                    //     var ret = await getCourseReqs('https://study.unisa.edu.au' + data[i]['link']);
                    //     console.log(ret)
                    //     return ret;
                    // });
                    // results.push(reqs);
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
        getCourses(searchUrl).then(async function(data) {
            for (var i=0;i<data.length;i++) {
                console.log(i+1 + '.', data[i]['course']);
                reqs = await getCourseReqs('https://study.unisa.edu.au' + data[i]['link']);
                if (reqs[0].length > 0 ) {console.log('    Corequisites: ', reqs[0].toString())};
                if (reqs[1].length > 0 ) {console.log('    Prerequisites: ', reqs[1].toString())};
                
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


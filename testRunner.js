const puppeteer = require('puppeteer');
const $ = require('cheerio');
const getTopResult = require('./getTopResult')
const getCourses = require('./getCourses')

getCourses('https://study.unisa.edu.au/degrees/bachelor-of-software-engineering-honours/').then(function (data) {
    console.log(data.toString());
    if (data[0].length > 0 ) {console.log('    Corequisites: ', data[0].toString())};
    if (data[1].length > 0 ) {console.log('    Prerequisites: ', data[1].toString())};
});

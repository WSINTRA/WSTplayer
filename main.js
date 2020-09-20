///////////////////////////////////////////////////////////////////////////////////////////////////
//Build a webscraper in JS that will run in node
//After gathering the top 30 unique trending movie torrents from https://1337x.to/trending/w/movies/
//Connect to the youtube API and build a playlist of trailers for those movies
//By Will Simpson www.williamrobertsimpson.com Thanks to jzjzjzj for ptn and thanks to google for pupeteer and youtube API
//////////////////////////////////////////////////////////////////////////////////////////////////

//Step 1
//Create a new puppeteer instance that connects to https://1337x.to/trending/w/movies/
const puppeteer = require('puppeteer');
const youTubeSearch = require('./SearchSample');
//ptn is a torrent name parse from https://github.com/jzjzjzj/parse-torrent-name
var ptn = require('parse-torrent-name');

async function run() {

    const browser = await puppeteer.launch({ headless: true }); // default is true
    const page = await browser.newPage();

    await page.goto('https://1337x.to/trending/w/movies/');
    //TEST
    // await page.screenshot({ path: 'testScreener.png' });

    //Step 2
    //Parse the returning data and find the table that contains the torrent titles

    let torrentTable = 'body > main > div > div > div.featured-list.trending-torrent > div.table-list-wrap > table > tbody'

    //Step 3
    //Create an array of all unique titles, since many titles will be similar except for the scene tags, filter by the first 4 letters
    let tableLen = 50; //set this back to 50 when ready
    let titleArray = []
    for (let i = 0; i < tableLen; i++) {
        let index = i;
        let torrentTitle = `body > main > div > div > div.featured-list.trending-torrent > div.table-list-wrap > table > tbody > tr:nth-child(${index}) > td.coll-1.name > a`
        titleArray.push(await page.evaluate((sel) => {
            let element = document.querySelector(sel);
            return element ? element.innerText : null;
        }, torrentTitle))
    }
    titleArray = titleArray.filter(el => el !== null)
    titleArray = titleArray.map(element => ptn(element))

    await browser.close();

    uniqeTitles = [...new Set(titleArray.map(el => (el.title + " trailer")))];

    //TEST
    console.log(uniqeTitles)

    //Step 4
    //Connect to the youTube API with credentials

    let data = await youTubeSearch(uniqeTitles);


}
run()

//Build a webscraper in JS that will run in node
//After gathering the top 30 unique trneding movie torrents from https://1337x.to/trending/w/movies/
//Connect to the youtube API and build a playlist of trailers for those movies

//Break down
//Will need the youtube API and Puppeteer for the webscraping

//Step 1
//Create a new puppeteer instance that connects to https://1337x.to/trending/w/movies/
const puppeteer = require('puppeteer');

async function run() {

    const browser = await puppeteer.launch({ headless: true }); // default is true
    const page = await browser.newPage();

    await page.goto('https://1337x.to/trending/w/movies/');
    //TEST
    // await page.screenshot({ path: 'testScreener.png' });

    //Step 2
    //Parse the returning data and find the table that contains the torrent titles

    //     <td class="coll-1 name">
    // <div class="rating-box" style="padding-top: 2px;">
    // <span class="active"><i class="flaticon-arw-right grey"></i></span>
    // <span><i class="flaticon-arw-right"></i></span>
    // <span class="rating-text" style="margin-top: 2px;">1</span>
    // <span><i class="flaticon-arw-right"></i></span>
    // </div>
    // <a href="/torrent/4611461/Mulan-2020-1080p-WEBRip-x264-AAC5-1-RARBG/">Mulan.2020.1080p.WEBRip.x264.AAC5.1-RARBG</a> </td>

    let torrentTable = 'body > main > div > div > div.featured-list.trending-torrent > div.table-list-wrap > table > tbody'

    //Step 3
    //Create an array of all unique titles, since many titles will be similar except for the scene tags, filter by the first 4 letters


    let tableLen = 50;
    let titleArray = []
    for (let i = 0; i < tableLen; i++) {
        let index = i;
        let torrentTitle = `body > main > div > div > div.featured-list.trending-torrent > div.table-list-wrap > table > tbody > tr:nth-child(${index}) > td.coll-1.name > a`
        titleArray.push(await page.evaluate((sel) => {
            let element = document.querySelector(sel);
            return element ? element.innerText : null;
        }, torrentTitle))
    }

    //TEST
    console.log(titleArray)


    browser.close();
}

run()



//TEST

//Step 3
//Create an array of all unique titles, since many titles will be similar except for the scene tags, filter by the first 4 letters

//TEST

//Step 4
//Connect to the youTube API with credentials

//TEST

//Step 5
//Create a new playlist using the youtube API

//TEST

//Step 6 
//For each title in the array list, search the youtube ApI for title with the string trailer added to it

//Step 7
//Insert each top search result into the newly created playlist

//TEST

// Refinement

//before using the array to search titles, strip the titles of any 1080, 720, x265 tags and anything that comes after them, the usual format is title.year.format.release
//Try to keep the year and seperate with space before submitting the title to the youtube API
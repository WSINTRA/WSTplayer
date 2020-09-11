//Build a webscraper in JS that will run in node
//After gathering the top 30 unique trneding movie torrents from https://1337x.to/trending/w/movies/
//Connect to the youtube API and build a playlist of trailers for those movies

//Break down
//Will need the youtube API and Puppeteer for the webscraping

//Step 1
//Create a new puppeteer instance that connects to https://1337x.to/trending/w/movies/
const puppeteer = require('puppeteer');
const youTubeSearch = require('./SearchSample');
//ptn is a torrent name parse from https://github.com/jzjzjzj/parse-torrent-name
var ptn = require('parse-torrent-name');
const CREDS = require('./cred');

async function run() {

    // const browser = await puppeteer.launch({ headless: true }); // default is true
    // const page = await browser.newPage();

    // await page.goto('https://1337x.to/trending/w/movies/');
    // //TEST
    // // await page.screenshot({ path: 'testScreener.png' });

    // //Step 2
    // //Parse the returning data and find the table that contains the torrent titles

    // let torrentTable = 'body > main > div > div > div.featured-list.trending-torrent > div.table-list-wrap > table > tbody'

    // //Step 3
    // //Create an array of all unique titles, since many titles will be similar except for the scene tags, filter by the first 4 letters
    // let tableLen = 50;
    // let titleArray = []
    // for (let i = 0; i < tableLen; i++) {
    //     let index = i;
    //     let torrentTitle = `body > main > div > div > div.featured-list.trending-torrent > div.table-list-wrap > table > tbody > tr:nth-child(${index}) > td.coll-1.name > a`
    //     titleArray.push(await page.evaluate((sel) => {
    //         let element = document.querySelector(sel);
    //         return element ? element.innerText : null;
    //     }, torrentTitle))
    // }
    // titleArray = titleArray.filter(el => el !== null)
    // titleArray = titleArray.map(element => ptn(element))

    // uniqeTitles = [...new Set(titleArray.map(el => (el.title + " trailer")))];
    // //TEST
    // console.log(uniqeTitles)

    //Step 4
    //Connect to the youTube API with credentials

    let data = await youTubeSearch("Dogs");
    //TEST
    console.log(data);


}
run()








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
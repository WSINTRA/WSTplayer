//Build a webscraper in JS that will run in node
//After gathering the top 30 unique trneding movie torrents from https://1337x.to/trending/w/movies/
//Connect to the youtube API and build a playlist of trailers for those movies

//Break down
//Will need the youtube API and Puppeteer for the webscraping

//Step 1
//Create a new puppeteer instance that connects to https://1337x.to/trending/w/movies/

//TEST

//Step 2
//Parse the returning data and find the table that contains the torrent titles

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
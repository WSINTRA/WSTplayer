// Copyright 2016 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';
var fs = require('fs');
const { google } = require('googleapis');
const path = require('path');
var OAuth2 = google.auth.OAuth2;

var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';

async function runSample(searchParamArray) {
  let titlesArray = searchParamArray;

    fs.readFile('client_secret.json', async function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        // Authorize a client with the loaded credentials, then call the YouTube API.
        authorize(JSON.parse(content),callAPI,titlesArray);
    });

    function authorize(credentials, callback, titlesArray) {
        var clientSecret = credentials.installed.client_secret;
        var clientId = credentials.installed.client_id;
        var redirectUrl = credentials.installed.redirect_uris[0];
        var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, function(err, token) {
            if (err) {
                getNewToken(oauth2Client, callback);
            } else {
                oauth2Client.credentials = JSON.parse(token);
                callback(oauth2Client, titlesArray);
            }
        });
    }

    async function callAPI(auth, titlesArray) {
        var youtTube = google.youtube('v3');
        google.options({ auth });
        const searchForVideo = async (searchTerm) => {
          return youtTube.search.list({ part: 'id,snippet', q: `${searchTerm}`, maxResults: 1 })
        }
        const newPlaylist = async () => { //Inserts new playlist and returns a promise
          let todaysDate = (new Date()).toLocaleDateString().split("/").join("/")
          return youtTube.playlists.insert({
              "part": [
                  "snippet, status"
              ],
              "resource": {
                  "snippet": {
                      "title": `Trending Movies this week ${todaysDate}`,
                      "description": `Top movie trailers trending on https://1337x.to/trending/w/movies/ for ${todaysDate}`,
                  },
                  "status": {
                      "privacyStatus": "public"
                  }
              }
          });
        }
        const insertVideoToPlayList = async (playListID,video,index) => {
          return youtTube.playlistItems.insert({
              "part": [
                  "id, snippet"
              ],
              "resource": {
                  "snippet": {
                      "playlistId": playListID,
                      "position": index,
                      "resourceId": {
                          "videoId": video.videoID,
                          "kind": video.kind
                      }
                  }
              }
          })
        }
        let trailers = await Promise.all(titlesArray.map(title => searchForVideo(title) ) ); 
        let trailerIDs = trailers.map((trailer)=> trailer.data.item[0].id)
        let weeklyPlayList= await newPlaylist()
        console.log(weeklyPlayList.data.id, "PlayList ID");
        debugger
        let updatedPlaylist = await Promise.all( trailers.map((trailer,index) => insertVideoToPlayList(weeklyPlayList,trailer,index) ) )
        updatedPlaylist.map(playlistItem => console.log)
        // playListInsertPackage = trailerIDs.map((id,index)=> {return {
        //     "playListID": weeklyPlayList.data.id,
        //     "position": index,
        //     "video": {
        //         "videoID": videoTitles[i].videoId,
        //         "kind": videoTitles[i].kind
        //     }
        // }})
            //Resolves promise for each trailer searched and returns an array of data
        // const getVideoTitlesID = async() => {
        //     return Promise.all(searchParamArray.map(searchTerm => searchForVideo(searchTerm)))
        // }
        // titlesArray.map((title) => Promise.all(searchForVideo(title)))
        //resolve titles and then create an array with just ID and Kind
        // let videoTitles = await getVideoTitlesID().then(data => {
        //     // console.log('VideoTitleData',data)
        //     //Promise.all returns an array of server responses, the info I need is in response.data.items[0] <- The first item in the array is a video ID
        //     trailerIDs = data.map(res => res.data.items[0])
        //     return trailerIDs
        //     //Trailer ID's becomes an array of video ID's I will need for the playlist
        // }).then(trailerIDs => {
        //     let weeklyTrailers = trailerIDs.map(result => result.id)
        //     return weeklyTrailers
        // });
        //Step 5
        //Create a new playlist using the youtube API, and store the playlist ID
        //Step 6 
        //For each title in the array list, search the youtube ApI for title with the string trailer added to it
        
            // .then(data => {
            //     return data.data.id;
            // }).catch(err => console.log(err))

        // let listOfPlaylistItems = [];

        

        // for (let i = 0; i < videoTitles.length; i++) {
        //     listOfPlaylistItems[i] = {

        //         "playListID": weeklyPlayListID,
        //         "position": i,
        //         "video": {
        //             "videoID": videoTitles[i].videoId,
        //             "kind": videoTitles[i].kind
        //         }
        //     }
        // }
        //TEST 
        // console.log(listOfPlaylistItems[0].video)
        // console.log(listOfPlaylistItems[1].playListID)
            //Step 7
            //Insert each top search result into the newly created playlist
            // Inserts a new video to a playlist and returns a promise
            // {   playlistItem: { playlistID: "2039382", video: {videoID:"9289", kind:"Some#Video"}  } }
        // .then(async res => {
        //         if(!res.ok){
        //             const err = res
        //             throw err
        //         }
        //         console.log(res)
        //     }).catch((err)=> {
        //         console.log("Insert video error", err);
        //     });
        // }

        // var counter = 0;

        // function addVideosToPlaylist() {
        //     myLoop(listOfPlaylistItems[0]);
        // }

        // function myLoop(video_id) {
        //     insertVideoToPlayList(video_id);
        //     setTimeout(function() {
        //         counter++;
        //         if (counter < listOfPlaylistItems.length) {
        //             myLoop(listOfPlaylistItems[counter]);
        //         }
        //     }, 3000);
        // }
        // addVideosToPlaylist()

    }
    return "Done"
}

if (module === require.main) {
    runSample().catch(console.error);
}
module.exports = runSample;
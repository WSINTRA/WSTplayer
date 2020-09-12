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
var KRACKPOTKIN = "UCZeToi2PcAUJnnbpEuS8HpQ" //My Channel ID

var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';
// initialize the Youtube API library
const youtube = google.youtube('v3');


// a very simple example of searching for youtube videos
async function runSample(searchParamArray) {
    console.log(searchParamArray, "Array is in module")
    fs.readFile('client_secret.json', async function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        // Authorize a client with the loaded credentials, then call the YouTube API.
        authorize(JSON.parse(content), search);
    });

    function authorize(credentials, callback) {
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
                callback(oauth2Client);
            }
        });
    }
    async function search(auth) {
        var service = google.youtube('v3');
        google.options({ auth });
        let trailerIDs = []

        // trailerIDs = searchParamArray.map(searchTerm => await service.search.list({ part: 'id,snippet', q: `${searchTerm}`, maxResults: 1 }).data.items[0].id)

        // const list = [1, 2, 3, 4, 5] //...an array filled with values

        const functionWithPromise = (searchTerm) => { //a function that returns a promise
            return service.search.list({ part: 'id,snippet', q: `${searchTerm}`, maxResults: 1 })
        }

        const anAsyncFunction = async item => {
            return functionWithPromise(item)
        }

        const getData = async() => {
            return Promise.all(searchParamArray.map(item => anAsyncFunction(item)))
        }

        getData().then(data => {
                trailerIDs = data.filter(res => res.data.items[0])

                console.log(trailerIDs)
            })
            // var results = await service.search.list({ part: 'id,snippet', q: `${searchTerm}`, maxResults: 1 });

        // let videoForPlayList = results.data.items[0].id.videoId
        // let currentPlaylist = await service.playlists.list({
        //     "part": [
        //         "snippet,contentDetails"
        //     ],
        //     "channelId": KRACKPOTKIN,
        //     "maxResults": 25
        // });

        //Step 5
        //Create a new playlist using the youtube API

        try {
            let todaysDate = (new Date()).toLocaleDateString().split("/").join("/")
            let newPlaylist = await service.playlists.insert({
                part: [
                    "snippet"
                ],
                "resource": {
                    "snippet": {
                        "title": `Trending Movies this week ${todaysDate}`
                    }
                }
            });
            console.log(newPlaylist)
        } catch (err) {
            console.log(err)
        }

        //TEST

        //Step 6 
        //For each title in the array list, search the youtube ApI for title with the string trailer added to it

        //Step 7
        //Insert each top search result into the newly created playlist

    }
    return "Done"
}

if (module === require.main) {
    runSample().catch(console.error);
}
module.exports = runSample;
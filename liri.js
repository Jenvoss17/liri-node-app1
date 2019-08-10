const Spotify = require('node-spotify-api');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const readline = require('readline');

require("dotenv").config();
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

const DIVIDER = '---------------------------------';

const command = process.argv[2];
const query = process.argv[3];
function splitTheDiff(command, query) {
    switch (command) {
        case 'concert-this':
            searchConcerts(query);
            break;
        case 'spotify-this-song':
            searchSpotify(query);
            break;
        case 'movie-this':
            searchMovies(query);
            break;
        case 'do-what-it-says':
            randomize();
            break;
        default:
            console.log('invalid args');
            break;

    }
}
splitTheDiff(command, query);

function searchConcerts(artist) {
    console.log('concert')
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function (res) {
            const concerts = res.data;
            concerts.forEach(function (concert) {
                console.log('venue: ' + concert.venue.name);
                console.log('location: ' + concert.venue.city + ', ' + concert.venue.region + ' ' + concert.venue.country)
                console.log('date: ' + moment(concert.datetime).format('L'))
                console.log(DIVIDER)
            })
        })
        .catch(function (err) {
            console.log(err);
            throw err;
        })
}

function searchSpotify(song) {
    console.log('spotify')
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        if (data.tracks.items.length > 0) {
            data.tracks.items.forEach(function (item) {
                const artists = item.artists;
                artists.forEach(function (artist) {
                    console.log('artist: ' + artist.name);
                })
                console.log('name: ' + item.name);
                console.log('link: ' + item.href);
                console.log('album: ' + item.album.name)
                console.log(DIVIDER)
            })
        } else {
            return searchSpotify('The Sign');
        }
    });
}

function searchMovies(title) {
    console.log('movies')
    axios.get('http://www.omdbapi.com/?apikey=trilogy' + '&t=' + title)
        .then(function (res) {
            const movie = res.data;
            console.log('title: ' + movie.Title);
            console.log('year: ' + movie.Year);
            console.log('IMDB: ' + movie.Ratings[0].Value);
            console.log('Rotten Tomatoes: ' + movie.Ratings[1].Value);
        })
        .catch(function (err) {
            console.log(err);
            throw err;
        })
}

function randomize() {
    console.log('random')
    readFile();
}
function readFile() {
    fs.readFile('./random.txt', 'utf8', function read(err, data) {
        if (err) { throw err; }
        processFile(data);
    });
}

function processFile(content) {
    let commands = content.split('\n');

    // run random.
    var command = commands[Math.floor(Math.random() * commands.length)];
    command = command.split(',');
    splitTheDiff(command[0], command[1])

    // run all. - why run just one when you can run them all?
    // commands.forEach(function (command) {
    //     command = command.split(',');
    //     splitTheDiff(command[0], command[1])
    // })
}
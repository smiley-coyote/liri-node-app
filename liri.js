require("dotenv").config();
var fs = require("fs");
var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var myTweets = "";


var inputArr = process.argv;
var command = process.argv[2];
var userInput = "";
var output = "";
var newLine = "--------------------------------------------"

var twitterCommand = "my-tweets";
var spotifyCommand = "spotify-this-song";
var movieCommand = "movie-this";
var liriCommand = "do-what-it-says";



for(i=3; i<inputArr.length; i++){
   if(i>3 && i<inputArr.length){
   userInput = userInput + "+" + inputArr[i];
   }
   else{
      userInput += inputArr[i];
   }
}

var queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";

if(command === twitterCommand){
runTwitter();

}

if(command === spotifyCommand && userInput !== ""){
runSpotify();

}

if (command === spotifyCommand && userInput === ""){
   userInput = "the+sign";
   runSpotify();
   
}

if(command === movieCommand){
   runMovie();
   
}

if(command === liriCommand){
   fs.readFile("random.txt", "utf8", function(error, data){
      if(error){
         console.log("ERROR ------------------------------------------")
         console.log(error);
         console.log("------------------------------------------------")
         return;
      }
      var randomText = data.replace(',', ' ');
      randomText = randomText.replace('"', '');
      randomText = randomText.replace('"', '');
      randomText = randomText.split(" ")
     
      
   for(i=1; i<randomText.length; i++){
      if(i>1 && i<randomText.length){
         userInput = userInput + "+" + randomText[i];
      } 
      else{
         userInput += randomText[i];
      }
   }
   runSpotify();
   
   })
}


function runTwitter(){
   var params = {screen_name: 'Nick17176492'};
   client.get('statuses/user_timeline', params, function(error, tweets, response) {
     if (!error) {
        for(i=0;i<tweets.length;i++){
         console.log(tweets[i].created_at);
         console.log('"' + tweets[i].text + '"');
         console.log("--------------------------------")
         output = tweets[i].created_at + ': "' + tweets[i].text + '"';
         appendFile();
        }
       
     }
   });
}
function runSpotify(){
   spotify
   .request('https://api.spotify.com/v1/search?query=' + userInput + '&type=track&offset=0&limit=1')
   .then(function(data) {
     var artist = "Artist: " + data.tracks.items[0].artists[0].name;
     var song = "Song: " + data.tracks.items[0].name;
     var preview = "";
     var album = "Album: " + data.tracks.items[0].album.name;
     
     if(data.tracks.items[0].preview_url == null){
        preview = "Preview doesn't exist. Full track here: " + data.tracks.items[0].external_urls.spotify;
     } else {
        preview = "Preview track: " + data.tracks.items[0].preview_url
     }
     console.log("--------------------------------")
     console.log(artist + '\n' + song + '\n' + preview + '\n' + album);
     console.log("--------------------------------")
     output = (artist + '\n' + song + '\n' + preview + '\n' + album);
     appendFile();
     
   })
   .catch(function(err) {
     console.error('Error occurred: ' + err); 
   });
}
function runMovie(){
   request(queryUrl, function(error, response, body) {

      // If the request is successful
      if (!error && response.statusCode === 200) {
      var title = "Title: " + JSON.parse(body).Title
      var year = "Release year: " + JSON.parse(body).Year
      var imdbRating = "IMDB rating: " + JSON.parse(body).Ratings[0].Value;
      var rottenTomatoes = "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value;
      var country = "Country of origin: " + JSON.parse(body).Country;
      var language = "Language: " + JSON.parse(body).Language;
      var plot = "Plot: " + JSON.parse(body).Plot;
      var actors = "Actors: " + JSON.parse(body).Actors;
      console.log("--------------------------------")
      console.log(title + '\n' + year + '\n' + imdbRating + '\n' + rottenTomatoes + '\n' + country + '\n' + language + '\n' + plot + '\n' + actors);
      console.log("--------------------------------")
      output = title + '\n' + year + '\n' + imdbRating + '\n' + rottenTomatoes + '\n' + country + '\n' + language + '\n' + plot + '\n' + actors;
      appendFile();
      }
    });
}

function appendFile(){
   fs.appendFile("log.txt", "\n" + newLine + "\n" + output, function(err) {
      if (err) {
        return console.log(err);
      }
    });
}
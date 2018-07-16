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
   var params = {screen_name: 'Nick17176492'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
     for(i=0;i<tweets.length;i++){
      console.log(tweets[i].created_at);
      console.log('"' + tweets[i].text + '"');
      console.log("--------------------------------")
     }
    
  }
});
}
if(command === spotifyCommand && userInput !== ""){
   
   spotify
  .request('https://api.spotify.com/v1/search?query=' + userInput + '&type=track&offset=0&limit=1')
  .then(function(data) {
    var artist = "artist: " + data.tracks.items[0].artists[0].name;
    var song = "song: " + data.tracks.items[0].name;
    var preview = "";
    var album = "album: " + data.tracks.items[0].album.name;
    
    if(data.tracks.items[0].preview_url == null){
       preview = "preview doesn't exist. Full track here: " + data.tracks.items[0].external_urls.spotify;
    } else {
       preview = "preview track: " + data.tracks.items[0].preview_url
    }
    console.log(artist);
    console.log(song);
    console.log(preview);
    console.log(album);
    
  })
  .catch(function(err) {
    console.error('Error occurred: ' + err); 
  });
} else if (command === spotifyCommand && userInput == ""){
   spotify
   .request('https://api.spotify.com/v1/search?query=the+sign&type=track&offset=0&limit=1')
   .then(function(data) {
      var artist = "artist: " + data.tracks.items[0].artists[0].name;
      var song = "song: " + data.tracks.items[0].name;
      var preview = "";
      var album = "album: " + data.tracks.items[0].album.name;
      
      if(data.tracks.items[0].preview_url == null){
         preview = "preview doesn't exist. Full track here: " + data.tracks.items[0].external_urls.spotify;
      } else {
         preview = "preview track: " + data.tracks.items[0].preview_url
      }
      console.log(artist);
      console.log(song);
      console.log(preview);
      console.log(album);
    })
    
    .catch(function(err) {
      console.error('Error occurred: ' + err); 
    });
}
if(command === movieCommand){
   request(queryUrl, function(error, response, body) {

      // If the request is successful
      if (!error && response.statusCode === 200) {
    
        // Parse the body of the site and recover just the imdbRating
        // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
      //   console.log("Release Year: " + JSON.stringify(body));
      /*    * Title of the movie.
       * Year the movie came out.
       * IMDB Rating of the movie.
       * Rotten Tomatoes Rating of the movie.
       * Country where the movie was produced.
       * Language of the movie.
       * Plot of the movie.
       * Actors in the movie.
       */
      var title = "title: " + JSON.parse(body).Title
      var year = "release year: " + JSON.parse(body).Year
      var imdbRating = "IMDB rating: " + JSON.parse(body).Ratings[0].Value;
      var rottenTomatoes = "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value;
      var country = "country of origin: " + JSON.parse(body).Country;
      var language = "language: " + JSON.parse(body).Language;
      var plot = "plot: " + JSON.parse(body).Plot;
      var actors = "plot: " + JSON.parse(body).Actors;
      console.log("--------------------------------")
      console.log(title);
      console.log(year);
      console.log(imdbRating);
      console.log(rottenTomatoes);
      console.log(country);
      console.log(language);
      console.log(plot);
      console.log(actors);
      console.log("--------------------------------")
      }
    });
}
if(command === liriCommand){
   console.log("liri");
}


// fs.readFile("random.txt", "utf8", function(error, data){
//    if(error){
//       console.log("ERROR ------------------------------------------")
//       console.log(error);
//       console.log("------------------------------------------------")
//       return;
//    }

//    console.log(data);
// })
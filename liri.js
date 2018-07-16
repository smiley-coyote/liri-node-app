// require("dotenv").config();

// var spotify = new Spotify(keys.spotify);
// var client = new Twitter(keys.twitter);

// var liri = process.argv;

var fs = require("fs");

fs.readFile("random.txt", "utf8", function(error, data){
   if(error){
      console.log("ERROR ------------------------------------------")
      console.log(error);
      console.log("------------------------------------------------")
      return;
   }

   console.log(data);
})
require('dotenv').config();
const express = require("express");
const https = require("https");
const app = express();

app.get("/", function(req, res){

  const url = `https://api.openweathermap.org/data/2.5/weather?q=san ramon,california&units=imperial&appid=${process.env.ID}`;

  https.get(url, function(response) {
    console.log(response.statusCode);
    response.on("data", function(data){
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const imageURL = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
        res.write("<p>The weather is currently " + weatherDescription + "</p>");
        res.write("<h1>The temperature in San Ramon is " + temp + " degrees Celcius.</h1>");
        res.write("<img src=" + imageURL+ ">");
        res.send();
      })
    })
})

app.listen(3000, function(){
  console.log("Server is running on port 3000.");
})

//version 1: Weather API
//Goal: when search button is clicked, run functions that will:
//1: check user input date against current date and select current weather query or forecast query
//2: use information entered by user to query Weatherbit.io

//define variable for html search button
var searchButton = $(".button");

//define variables that capture the city, state, and date indicated by user, by default are blank
var cityInput = "";
var stateInput = "";
var dateInput = "";

//define variables that represent the WeatherBit APIKey
var APIKey = "faa9f8bb779e4165b52c0af7edcdbf68";

//define current date using a moment
var currentDate = moment().format('YYYY-MM-DD');
console.log('WA: This is the current date: ' + currentDate);


//**CLICK EVENT**//

//create on click event trigged by main age Search button that will check user inputs and initiate queries
searchButton.on("click", selectQuery);


//**FUNCTIONS & AJAX CALLS**//

//check user input date against current date and select current weather query or forecast query
function selectQuery () {
   
    //captures the city, state and date variables to values entered by the user
    cityInput = $('#City').val();
    stateInput = $('#state').val(); 
    dateInput = $('#date').val();

    //console log result of user entry
    console.log('WA-sQ: State entered: ' + dateInput);
    console.log('WA-sQ: City entered: ' + cityInput);
    console.log('WA-sQ: Date entered: ' + stateInput);

    //check date user entered against the current date to determine whether current or future weather query must be run
    if (dateInput === currentDate) {
        console.log('WA-sQ: Dates both = today, query for current weather');
       
        displayCTWeather ()
    }
    else if (dateInput > currentDate) {
        console.log("WA-sQ: Date entered is later than today's date, query for forecast");

        displayFTWeather ();
    }

// end select query function
}

//query current weather conditions and render details
function displayCTWeather () {

    //define variable that represents current conditions query info
    var queryCurrentWeather = "https://api.weatherbit.io/v2.0/current?" + "city=" + cityInput + "," + stateInput + "&units=I" + "&key=" + APIKey;

    $.ajax({
        url: queryCurrentWeather,
        method: "GET"
        })
        //Store retrieved data inside response object
        .then(function(response) {
    
        //console log response object
        console.log(response);

        //set variable for returned temperature, convert to Farenheit and round up
        var temp = response.data[0].temp;

        //console log location key
        console.log(temp);

        //end ajax call
        });
 
//end function
}

//query forecast weather conditions and render details
function displayFTWeather () {

    //define variable that represents forecast conditions query info
    var queryForecast = "https://api.weatherbit.io/v2.0/forecast/daily?" + "city=" + cityInput + "," + stateInput + "&units=I" + "&key=" + APIKey;

    $.ajax({
        url: queryForecast,
        method: "GET"
        })
        //Store retrieved data inside response object
        .then(function(response) {
    
        //console log response object
        console.log(response);

        // var forecastObj = forecast.list[i].dt_txt;
        // var forecastDate = forecastObj.split(' ')[0];

        //set variable for returned temperature, convert to Farenheit and round up
        var tempF = response.data[0].temp;

        //console log location key
        console.log(tempF);

        //end ajax call
        });
 
}


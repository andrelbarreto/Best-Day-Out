//version 1: Weather API

//Goal: when search button is clicked, run function that will use information entered by user to query Weatherbit.io
//steps listed in pseudocode-weatherapi.txt


//define variable for html search button
var searchButton = $(".button");

//define variable that captures the city indicated by user, which by default is blank
var cityInput = "";

//define variable that captures the state indicated by user, which by default is blank
var stateInput = "";

var dateInput = "";

//define variables that represent the APIKey(s if needed)
var APIKey = "faa9f8bb779e4165b52c0af7edcdbf68";

//define current date using a moment
var currentDate = moment().format('YYYY-MM-DD');
console.log('This is the current date: ' + currentDate);


//**CLICK EVENT**//

//create on click event trigged by submit button that will check input date and initiate queries
searchButton.on("click", selectQuery);


//**FUNCTIONS/AJAX CALLS**//

//function will check user input date against current date and select current weather query or forecast query
function selectQuery () {
   
    //define variable that captures the city, state and date entered by the user
    cityInput = $('#City').val();
    stateInput = $('#state').val(); 
    dateInput = $('#date').val();

    //console log result of user entry
    console.log('This is the state entered: ' + dateInput);
    console.log('This is the city entered: ' + cityInput);
    console.log('This is the date entered: ' + stateInput);

    if (dateInput === currentDate) {
        console.log('these dates are the same');
       
        queryCurrentWeatherAPI ()
    }
    else if (dateInput > currentDate) {
        console.log("the date selected is later than today's date");

        queryForecastAPI ();
    }

// end select query function
}

function queryCurrentWeatherAPI () {

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

function queryForecastAPI () {

    //define variable that represents current conditions query info
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


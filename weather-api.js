// version 1: Weather API
// Goal: when search button is clicked, run functions that will:
// 1: check user input date against current date and select current weather query or forecast query
// 2: use information entered by user to query Weatherbit.io

// define variable for html search button
var searchButton = $(".button");

// define variables that capture the city, state, and date indicated by user, by default are blank
var cityInput = "";
var stateInput = "";
var dateInput = "";

// define variables that represent the WeatherBit APIKey
var APIKey = "faa9f8bb779e4165b52c0af7edcdbf68";

// define current date using a moment
var currentDate = moment().format('YYYY-MM-DD');
console.log('WA: This is the current date: ' + currentDate);


// **CLICK EVENT** //

//create on click event trigged by main age Search button that will check user inputs and initiate queries
searchButton.on("click", selectQuery);


// **FUNCTIONS & AJAX CALLS** //

// check user input date against current date and select current weather query or forecast query
function selectQuery () {
   
    // captures the city, state and date variables to values entered by the user
    cityInput = $('#City').val();
    stateInput = $('#state').val(); 
    dateInput = $('#date').val();

    // console log result of user entry
    console.log('WA-sQ: Date entered: ' + dateInput);
    console.log('WA-sQ: City entered: ' + cityInput);
    console.log('WA-sQ: State entered: ' + stateInput);

    // check date user entered against the current date to determine whether current or future weather query must be run
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

// query current weather conditions and render details
function displayCTWeather () {

    // define variable that represents current conditions query info
    var queryCurrentWeather = "https://api.weatherbit.io/v2.0/current?" + "city=" + cityInput + "," + stateInput + "&units=I" + "&key=" + APIKey;

    $.ajax({
        url: queryCurrentWeather,
        method: "GET"
        })
        // store retrieved data inside response object
        .then(function(response) {
    
        // console log response object
        console.log('WA-cW: current weather query was run');
        console.log(response);

        // set variables for returned temperature and round up
        var wtempCurrent = Math.ceil(response.data[0].temp);
        var wtempFeels = Math.ceil(response.data[0].app_temp);

        // set variables for UV Index, Humidity, Description and Icon
        var wUV = response.data[0].uv;
        var wHumidity = response.data[0].rh;
        var wDescription = response.data[0].weather.description;
        // var weatherIcon = https://www.weatherbit.io/static/img/icons/{icon_code}.png


        // console log results
         console.log('This is the current temp: ' + wtempCurrent);
         console.log('Feels like: ' + wtempFeels);
         console.log('This is the UV Index: ' + wUV);
         console.log('The humidity is: ' + wHumidity);
         console.log('The weather is: ' + wDescription);

        //end ajax call
        });
 
// end function
}

// query forecast weather conditions and render details
function displayFTWeather () {

    // define variable that represents forecast conditions query info
    var queryForecast = "https://api.weatherbit.io/v2.0/forecast/daily?" + "city=" + cityInput + "," + stateInput + "&units=I" + "&key=" + APIKey;

    $.ajax({
        url: queryForecast,
        method: "GET"
        })
        // store retrieved data inside response object
        .then(function(response) {
    
        //console log response object
        console.log('WA-cW: forecast weather query was run');
        console.log(response);

        // set variable to return number value of response length
        // var responseLength = response.data.length;
        // console.log('This is the response length: ' + responseLength);

        //define variable that will update to yes if date entered by user falls within forecast dates provided by forecast response
        var result = "";

        // run for loop that checks that the date user entered is within the scope of the returned forecast information from the response object
        for (var i = 0; i < response.data.length; i++) {

            if (dateInput === response.data[i].valid_date) {
                console.log(dateInput + " = " + response.data[i].valid_date + ' so we will provide weather details');

                result = 'yes';
                console.log(result);

            }

            // if result not found for date entered by user, indicate weather information is not yet available
            if (result !== 'yes') {
            console.log('The weather is not yet available for this date. Stay tuned!');
            }

         //end for loop    
        }


        //end ajax call
        });
 
}


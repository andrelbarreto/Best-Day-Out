// version 1: Weather API
// Goal: when search button is clicked, run functions that will:
// 1: check user input date against current date and select current weather query or forecast query
// 2: use information entered by user to query Weatherbit.io for current and future weather conditions
// 3: generate weather photos loosely based on weather conditions



// **GLOBAL VARIABLES** //

// define variable for html search button
var searchButton = $(".button");

// define current date using a moment
var currentDate = moment().format('YYYY-MM-DD');
var currentHour = moment().format('HH');
// console.log('WA: This is the current date: ' + currentDate);

// define variables that capture the city, state, and date indicated by user, by default are Chicago
var cityInput = "Chicago";
var stateInput = "IL";
var dateInput = currentDate
// console.log(dateInput);

// define variables that represent the WeatherBit APIKey
var APIKey = "faa9f8bb779e4165b52c0af7edcdbf68";

//set date with full word month and day format
var currentDateMD = moment().format('MMMM D');

//set variable that captures weather image div and applies 
var weatherImage = $('#weather-image').attr('src', 'images/weather/wfog.jpg');

//define weather element to which current weather will be added
var weatherCard = $('#weather-primary').addClass('has-text-white is-overlay has-text-weight-semibold has-text-left');

//define weather forecast element to which projected forecast will be added
var weatherForecastID = $('#weather-forecast.content').addClass('has-text-left');

//define variable into which weather icon data will be pushed for photos
var weatherIcon = "";


// **CLICK EVENT** //

//create on click event trigged by main page Search button that will check user inputs and initiate queries
searchButton.on("click", selectQuery);


// **FUNCTIONS & AJAX CALLS** //

// check user input date against current date and select current weather query or forecast query
function selectQuery () {
   
    // captures the city, state and date variables to values entered by the user
    cityInput = $('#City').val();
    stateInput = $('#state').val(); 
    dateInput = $('#date').val();

    // console log result of user entry
    // console.log('WA-sQ: Date entered: ' + dateInput);
    // console.log('WA-sQ: City entered: ' + cityInput);
    // console.log('WA-sQ: State entered: ' + stateInput);

    // check date user entered against the current date to determine whether current or future weather query must be run
    if (dateInput === currentDate) {
        // console.log('WA-sQ: Dates both = today, query for current weather');
       
        displayCTWeather ()
    }
    else if (dateInput > currentDate) {
        // console.log("WA-sQ: Date entered is later than today's date, query for forecast");

        displayFTWeather ();
    }

// end select query function
}

// query current weather conditions and render details
function displayCTWeather () {

    // define variable that represents current conditions query info
    var queryCTWeather = "https://api.weatherbit.io/v2.0/current?" + "city=" + cityInput + "," + stateInput + "&units=I" + "&key=" + APIKey;

    $.ajax({
        url: queryCTWeather,
        method: "GET"
        })
        // store retrieved data inside response object
        .then(function(response) {
    
        // console log response object
        console.log('WA-cW: current weather query was run');
        // console.log(response);
        
        //clear sections of any existing divs
        weatherCard.empty();
        weatherForecastID.empty();
        weatherIcon = "";
        

        var wCityName = response.data[0].city_name;

        // set variables for returned temperature and round up
        var wTempNow = Math.ceil(response.data[0].temp);
        var wTempFeels = Math.ceil(response.data[0].app_temp) + String.fromCharCode(176);

        // set remaining weather variables
        var wUV = Math.ceil(response.data[0].uv);
        var wHumidity = response.data[0].rh;
        var wDescription = response.data[0].weather.description;
        var wWindSpeed = response.data[0].wind_spd;
        var wIcon = response.data[0].weather.icon;

        //update weather icon for set Icon function
        weatherIcon = wIcon;
        

        // create divs and append to weather card
        
        //define variables for creating first level div 
        var levelCurrentDiv = $('<div id="city-temp">').addClass('level is-mobile is-marginless');

        //define variables that will be appended to the first level div
        var wcityNameDiv = $('<span id=city-name>').addClass('is-size-3 level-left').text(wCityName);

        var wtempCurrentDiv = $('<div id=temp-current>').addClass('is-size-3 level-right').text(wTempNow + String.fromCharCode(176));

        //define variables for creating second level div 
        var levelDetailDiv = $('<div id="temp-details">').addClass('level is-mobile');

        //define variables that will be appended to the second level div
        var wDescriptionDiv = $('<div id=description>').addClass('level-left').text(wDescription);

        var wtempIcon = $('<img width=60px height=60px>').attr('src', "https://www.weatherbit.io/static/img/icons/" + wIcon + ".png")

        //define remaining weather variables and divs to be created
        var wtempFeelsDiv = $('<div id=temp-feels>').text("Feels like: " 
         + wTempFeels);
        var wUVDiv = $('<div id=uv>').text("UV Index: " + wUV);
        var wHumidityDiv = $('<div id=humidity>').text("Humidity: " + wHumidity + "%");
        var wWindSpeedDiv = $('<div id=humidity>').text("Wind Speed: " + wWindSpeed + " mph");
        
        //append weather details and divs to weather card
        weatherCard.append(levelCurrentDiv, levelDetailDiv, wtempFeelsDiv, wUVDiv, wHumidityDiv, wWindSpeedDiv);

        levelCurrentDiv.append(wcityNameDiv, wtempIcon);
        levelDetailDiv.append(wtempCurrentDiv, wDescriptionDiv);

        //run projected forecast function to add future weather details to card
        addProjectedFT ();
        setWIconImage (); 
        
       // console log results
    //    console.log('This is the current temp: ' + wTempNow);
    //    console.log('Feels like: ' + wTempFeels);
    //    console.log('This is the UV Index: ' + wUV);
    //    console.log('The humidity is: ' + wHumidity);
    //    console.log('The weather is: ' + wDescription);

    //end ajax call
    });
 
// end displayWeatherCT function
}

// query forecast weather conditions and render details
function displayFTWeather () {

    // define variable that represents forecast conditions query info
    var queryFTWeather = "https://api.weatherbit.io/v2.0/forecast/daily?" + "city=" + cityInput + "," + stateInput + "&units=I" + "&key=" + APIKey;

    $.ajax({
        url: queryFTWeather,
        method: "GET"
        })
        // store retrieved data inside response object
        .then(function(response) {
    
        //console log type of response run
        console.log('WA-cW: forecast weather query was run');
        // console.log(response);
        
        //clear sections of any existing divs
        weatherCard.empty();
        weatherForecastID.empty();

        weatherIcon = "";

        //define variable that will update to yes if date entered by user falls within forecast dates provided by forecast response
        var result = "";
        

        // set variable to return number value of response length
        // var responseLength = response.data.length;
        // console.log('This is the response length: ' + responseLength);


        // run for loop that checks that the date user entered is within the scope of the returned forecast information from the response object
        for (var i = 0; i < response.data.length; i++) {

            if (dateInput === response.data[i].valid_date) {
                // console.log("WA-fW: dateInput" + " = " + response.data[i].valid_date + " so provide weather details");

                result = 'yes';
                // console.log("WA-fw: " + result);

                // set variables for returned temperature and round up
                var wftemp = Math.ceil(response.data[i].temp);
                var wftempLow = Math.ceil(response.data[i].low_temp);
                var wftempHigh = Math.ceil(response.data[i].high_temp);
                
                var wfcityName = cityInput;

                // set variables for UV Index, Humidity, Description and Icon
                var wfHumidity = response.data[i].rh;
                var wfUV = Math.ceil(response.data[i].uv);
                var wfDescription = response.data[i].weather.description;
                var wfWindSpeed = response.data[i].wind_spd;
                var wfIcon = response.data[i].weather.icon;
                weatherIcon = wfIcon;

                // create divs and append to card in index file
                
                //define variables for creating first level div 
                var levelCurrentDiv = $('<div id="city-temp">').addClass('level is-mobile is-marginless');

                //define variables that will be appended to the first level div
                var wfcityNameDiv = $('<span id=city-name>').text(wfcityName).addClass('is-size-3 level-left');

                var wftempForecastDiv = $('<div id=temp-forecast>').addClass('is-size-3 level-right').text(wftemp + String.fromCharCode(176));

                //define variables for creating second level div
                var levelDetailDiv = $('<div id="temp-details">').addClass('level is-mobile');
                
                //define variables that will be appended to the second level div
                var wfDescriptionDiv = $('<div id=description>').text(wfDescription).addClass('level-left');

                var wftempIcon = $('<img width=60px height=60px>').attr('src', "https://www.weatherbit.io/static/img/icons/" + wfIcon + ".png").addClass('level-right');

                //define remaining weather variables and divs to be created
                var wftempLowDiv = $('<span id=temp-low>').text("Low:  " + wftempLow + " " + String.fromCharCode(176) + " " + String.fromCharCode(8226));
                var wftempHighDiv = $('<span id=temp-high>').text(" " + " High: " + wftempHigh + String.fromCharCode(176));
                var wfUVDiv = $('<div id=uv>').text("UV Index: " + wfUV);
                var wfHumidityDiv = $('<div id=humidity>').text("Humidity: " + wfHumidity + "%");
                var wfWindSpeedDiv = $('<div id=humidity>').text("Wind Speed: " + wfWindSpeed + " mph");

                //append weather details and divs to weather card
                weatherCard.append(levelCurrentDiv, levelDetailDiv, wftempLowDiv, wftempHighDiv, wfUVDiv, wfHumidityDiv, wfWindSpeedDiv);

                levelCurrentDiv.append(wfcityNameDiv, wftempIcon);
                levelDetailDiv.append(wftempForecastDiv, wfDescriptionDiv);
                                            
                //console log results
                // console.log('The temp will be: ' + wftemp);
                // console.log('The temp low will be: ' + wftempLow);
                // console.log('The temp high will be: ' + wftempHigh);
                // console.log('The humidity will be: ' + wfHumidity);
                // console.log('THe UV Index will be: ' + wfUV);
                // console.log('The weather will be: ' + wfDescription);

            //close if statement
            }

         // close for loop    
        }

        // if result not found for date entered by user, indicate weather information is not yet available
        if (result !== 'yes') {

            // console.log('The weather is not yet available for this date. Stay tuned!');
            var noResults = $('<p>').text("The weather is not yet available for this date. Stay tuned!");
            weatherCard.append(noResults);

        } else if (result == 'yes') {

            //run projected forecast function to add future weather details to card
            addProjectedFT ();
            
        // end else statement
        }

        //run function to update image paired with weather icon
        setWIconImage ();

    // end ajax call
    });
 
}

//query forecast weather and render projected forecast to card
function addProjectedFT () {
    
    //clear sections of any existing divs
    weatherForecastID.empty();

    // define variable that represents forecast conditions query info
    var queryForecast = "https://api.weatherbit.io/v2.0/forecast/daily?" + "city=" + cityInput + "," + stateInput + "&units=I" + "&key=" + APIKey;

    $.ajax({
        url: queryForecast,
        method: "GET"
        })
        // store retrieved data inside response object
        .then(function(response) {

        //create for loop for adding projected forecast section to card
        for (var j = 1; j < 6; j++) {
            
            //set var for Month Date
            var longDate = moment(dateInput, 'YYYY-MM-DD').add(+j, 'days').format('MMMM D');

            //set var for dateInput + 1 day to represent forecast dates to pull back
            var updatedDate = moment(dateInput, 'YYYY-MM-DD').add(+j, 'days').format('YYYY-MM-DD');
            // console.log("This is the long date: " + longDate);
            // console.log("This is the updated date: " + updatedDate);
            
            //run through the full list of data from the response
            for (var i = 0; i < response.data.length; i++) {
                    // console.log("This is the updated date: " + updatedDate);
                    // console.log("This is the response date searched: " + response.data[i].valid_date);

                //if the updated date input matches a date in the response data, create forecast divs
                if (updatedDate === response.data[i].valid_date) {

                    //create variables
                    var wpfTempLow = Math.ceil(response.data[i].low_temp);
                    var wpfTempHigh = Math.ceil(response.data[i].high_temp);
                    var wpfIcon = response.data[i].weather.icon

                    //create divs
                    var longDateDiv = $('<div>').text(longDate).addClass('has-text-grey-darker');
                    var wpfTempLowDiv = $('<div>').text("L: " + wpfTempLow + String.fromCharCode(176)).addClass('has-text-grey');
                    var wpfTempHighDiv = $('<div>').text("H: " + wpfTempHigh + String.fromCharCode(176));
                    var wpfTempIcons = $('<img width=40px height=40px>').attr('src', "https://www.weatherbit.io/static/img/icons/" + wpfIcon + ".png");

 
                    var levelProjFT = $('<div id="projected">').addClass('level is-mobile is-marginless');

                    weatherForecastID.append(levelProjFT);
                    levelProjFT.append(longDateDiv, wpfTempIcons, wpfTempHighDiv, wpfTempLowDiv);

                // end if statement
                }
                 
            // end internal for loop
            }

        //end for loop 
        }
    
    // end then response
    });

// close projectedFT function
}


//generate photo background for card based on weather icon
function setWIconImage () {

    // console.log(weatherIcon);
    // console.log(dateInput == currentDate);
    // console.log(cityInput == "Chicago")
    // console.log(currentHour > 17)
    // console.log(currentHour)

    //if thunderstorm
    if (weatherIcon.startsWith('t')) {
        weatherImage = $('#weather-image').attr('src', 'images/weather/wthunder.jpg');
    }

    //if drizzle, rain, or unknown precipitation
    if (weatherIcon.startsWith('f') || weatherIcon.startsWith('d') || weatherIcon.startsWith('r') || weatherIcon.startsWith('u')) {
        weatherImage = $('#weather-image').attr('src', 'images/weather/wrain.jpg');
    }

    //if snow
    if (weatherIcon.startsWith('s') || weatherIcon.startsWith('a')) {
        weatherImage = $('#weather-image').attr('src', 'images/weather/wsnow.jpg');
    }

    //if fog
    if (weatherIcon.startsWith('a')) {
        weatherImage = $('#weather-image').attr('src', 'images/weather/wfog.jpg');
    }

    //if clear or clouds
    //if clear or clouds and the city is not Chicago, display the wclear image
    if (weatherIcon.startsWith('c') && cityInput !== "Chicago") {

        weatherImage = $('#weather-image').attr('src', 'images/weather/wclear3.jpg');

    //if clear or clouds and the city input is Chicago
    } else if (weatherIcon.startsWith('c') && cityInput == "Chicago") {

        //if during the day today or a future date, set generic clear photo
        if (dateInput == currentDate && currentHour < 17 || dateInput !== currentDate) {

            weatherImage = $('#weather-image').attr('src', 'images/weather/wclear3.jpg');

        }

         //if it's today and it's the evening, display an evening variable
         if (dateInput == currentDate && currentHour >= 17) {
             

            weatherImage = $('#weather-image').attr('src', 'images/weather/wnight2.jpg');
            
        }

    //end else if statement
    }

// end set icon image function
}

//run the display current weather function at startup
displayCTWeather ();
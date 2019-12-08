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

var currentDateMMMM = moment().format('MMMM D');

var weatherImage = $('#weather-image').attr('src', 'images/weatherbck4.jpg');


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

    // define variable that represents forecast conditions query info
    var queryForecast = "https://api.weatherbit.io/v2.0/forecast/daily?" + "city=" + cityInput + "," + stateInput + "&units=I" + "&key=" + APIKey;

    $.ajax({
        url: queryCurrentWeather,
        method: "GET"
        })
        // store retrieved data inside response object
        .then(function(response) {
    
        // console log response object
        console.log('WA-cW: current weather query was run');
        console.log(response);

        //define weather element to which projected forecast will be added
        var weatherCard = $('#weather-primary').addClass('has-text-white is-overlay has-text-weight-semibold has-text-left');

        //define weather forecast element to which projected forecast will be added
        var weatherForecastID = $('#weather-forecast.content').addClass('has-text-left');
        
        //clear sections of any existing divs
        weatherCard.empty();
        weatherForecastID.empty();

        // set variables for returned temperature and round up
        var wcityName = response.data[0].city_name;
        var wtempCurrent = Math.ceil(response.data[0].temp);
        var wtempFeels = Math.ceil(response.data[0].app_temp);

        // set variables for UV Index, Humidity, Description and Icon
        var wUV = response.data[0].uv;
        var wHumidity = response.data[0].rh;
        var wDescription = response.data[0].weather.description;
        var weatherIcon = response.data[0].weather.icon;

        // create divs and append to card in index file
        
        // var locationIcon = $<'span class= tbd'>
        var levelCurrentDiv = $('<div class=level id="city-temp">');
        var wcityNameDiv = $('<span class=city-name-div>').attr('class', 'is-size-3').text(wcityName);
        var wtempCurrentDiv = $('<div class=temp-current-div>').attr('class', 'is-size-3').text(wtempCurrent + String.fromCharCode(176));
        var wtempIcon = $('<img width=40px height=40px>').attr('src', "https://www.weatherbit.io/static/img/icons/" + weatherIcon + ".png");

        var levelDetailDiv = $('<div class=level id="temp-details">');
        var wtempFeelsDiv = $('<div class=temp-feels-div>').text("Feels like: " 
         + wtempFeels);
        var wUVDiv = $('<p class=uv-div>').text("UV Index: " + wUV);
        var wHumidityDiv = $('<div class=humidity-div>').text("Humidity: " + wHumidity + "%");
        var wDescriptionDiv = $('<div class=descrip-div>').text(wDescription);
        
        weatherCard.append(levelCurrentDiv, levelDetailDiv, wtempFeelsDiv, wUVDiv, wHumidityDiv)
        levelCurrentDiv.append(wcityNameDiv, wtempCurrentDiv);

        //will likely remove this and fix spacing on card
        levelDetailDiv.append(wDescriptionDiv, wtempIcon);


        $.ajax({
            url: queryForecast,
            method: "GET"
            })
            // store retrieved data inside response object
            .then(function(response) {
        
                var weatherForecastID = $('#weather-forecast.content').addClass('has-text-left');
                
        
                for (var i = 1; i < 6; i++) {

                    var longDateStr = moment(dateInput, 'YYYY-MM-DD').add(+i, 'days').format('MMMM D');
                    console.log("This is the long date string: " + longDateStr);

        
                    var wftempLow = Math.ceil(response.data[i].low_temp);
                    var wftempHigh = Math.ceil(response.data[i].high_temp);
                    var weatherIcons = response.data[i].weather.icon
                    var wtempIcons = $('<img width=40px height=40px>').attr('src', "https://www.weatherbit.io/static/img/icons/" + weatherIcons + ".png");
        
                    var projectedForecast = $('<div>').html(longDateStr + " " + wftempLow + String.fromCharCode(176) + " " + wftempHigh + String.fromCharCode(176) + " ");
        
                    weatherForecastID.append(projectedForecast, wtempIcons);
                }
            });
        
        
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

        //define weather element to which projected forecast will be added
        var weatherCard = $('#weather-primary').addClass('has-text-white is-overlay has-text-weight-semibold has-text-left');

        //define weather forecast element to which projected forecast will be added
        var weatherForecastID = $('#weather-forecast.content').addClass('has-text-left');
        
        //clear sections of any existing divs
        weatherCard.empty();
        weatherForecastID.empty();

        // set variable to return number value of response length
        // var responseLength = response.data.length;
        // console.log('This is the response length: ' + responseLength);

        //define variable that will update to yes if date entered by user falls within forecast dates provided by forecast response
        var result = "";

        // run for loop that checks that the date user entered is within the scope of the returned forecast information from the response object
        for (var i = 0; i < response.data.length; i++) {

            if (dateInput === response.data[i].valid_date) {
                console.log("WA-fW: dateInput" + " = " + response.data[i].valid_date + " so provide weather details");

                result = 'yes';
                console.log("WA-fw: " + result);

                // set variables for returned temperature and round up
                
                var wftemp = Math.ceil(response.data[i].temp);
                var wftempLow = Math.ceil(response.data[i].low_temp);
                var wftempHigh = Math.ceil(response.data[i].high_temp);
                

                // set variables for UV Index, Humidity, Description and Icon
                var wfcityName = cityInput;
                var wfHumidity = response.data[i].rh;
                var wfUV = response.data[i].uv;
                var wfDescription = response.data[i].weather.description;
                var wfweatherIcon = response.data[i].weather.icon;

                // var weatherIcon = https://www.weatherbit.io/static/img/icons/{icon_code}.png


                // create divs and append to card in index file
                
                // var locationIcon = $<'span class= tbd'>
                var levelCurrentDiv = $('<div class=level id="city-temp">');
                var wfcityNameDiv = $('<span class=city-name-div>').attr('class', 'is-size-3').text(wfcityName);
                var wftempForecastDiv = $('<div class=temp-forecast-div>').attr('class', 'is-size-3').text(wftemp + String.fromCharCode(176));
                var wftempIcon = $('<img width=40px height=40px>').attr('src', "https://www.weatherbit.io/static/img/icons/" + wfweatherIcon + ".png");

                var levelDetailDiv = $('<div class=level id="temp-details">');
                var wftempLowDiv = $('<span class=temp-feels-div>').text("Low:  " 
                + wftempLow + " ");
                var wftempHighDiv = $('<span class=temp-feels-div>').text("High: " 
                + wftempHigh);
                var wfUVDiv = $('<p class=uv-div>').text("UV Index: " + wfUV);
                var wfHumidityDiv = $('<div class=humidity-div>').text("Humidity: " + wfHumidity + "%");
                var wfDescriptionDiv = $('<div class=descrip-div>').text(wfDescription);
                
                weatherCard.append(levelCurrentDiv, levelDetailDiv, wftempLowDiv, wftempHighDiv, wfUVDiv, wfHumidityDiv)
                levelCurrentDiv.append(wfcityNameDiv, wftempForecastDiv);

                //will likely remove this and fix spacing on card
                levelDetailDiv.append(wfDescriptionDiv, wftempIcon);
                                            
                        
                //console log results
                console.log('The temp will be: ' + wftemp);
                console.log('The temp low will be: ' + wftempLow);
                console.log('The temp high will be: ' + wftempHigh);
                console.log('The humidity will be: ' + wfHumidity);
                console.log('THe UV Index will be: ' + wfUV);
                console.log('The weather will be: ' + wfDescription);

                


            //close if statement
            }

         // close for loop    
        }

        // if result not found for date entered by user, indicate weather information is not yet available
        if (result !== 'yes') {

            console.log('The weather is not yet available for this date. Stay tuned!');
            var noResults = $('<p>').text("The weather is not yet available for this date. Stay tuned!");
            weatherCard.append(noResults);

        }

        //create for loop for adding projected forecast section to card
        for (var i = 1; i < 6; i++) {
        
            var longDateStr = moment(dateInput, 'YYYY-MM-DD').add(+i, 'days').format('MMMM D');
            console.log("This is the long date string: " + longDateStr);


            var wftempLow = Math.ceil(response.data[i].low_temp);
            var wftempHigh = Math.ceil(response.data[i].high_temp);
            var weatherIcons = response.data[i].weather.icon
            var wtempIcons = $('<img width=40px height=40px>').attr('src', "https://www.weatherbit.io/static/img/icons/" + weatherIcons + ".png");

            var projectedForecast = $('<div>').html(longDateStr + " " + wftempLow + String.fromCharCode(176) + " " + wftempHigh + String.fromCharCode(176) + " ");

            weatherForecastID.append(projectedForecast, wtempIcons);
        }


        // end ajax call
        });
 
}


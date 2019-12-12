var page = 0;
//gets a copy of original HTML because Ticketmaster widget overwrites it
var ticketMatsterWidgetTemplate = document.getElementById('Ticketmaster-widget').outerHTML;
// define variables for search button that captures the city, state, date and category indicated by user, by default are chosen to show first card
var searchButton = $(".button");
var cityI= "Chicago";
var stateI = "IL";
var dateI = "12/12/2019";
var categoryI= "";
var Family="yes";
var TktAPIKey = "MRyvwbGL4H4yvINfi4pGByvFdAPc4yrC";
// var showFamily = false;


//create on click event trigged by main Search button that will check user inputs and initiate queries
searchButton.on("click", function() { 
  console.log(" Show family events state is " + Family);
  //once search button is clicked function selectQuery will change var values to those inputed
  FamilyorNot();
  console.log(" Show family events state is " + Family);
  selectQuery();
  // runs the function that gets json events per page from ticketmaster
  getEvents(page);
  // reloads the ticketmasterwidget with new values from variables
  reloadTicketmasterWidget();
});



// check user input date and capture variables
function selectQuery() {
   
  // captures the city, state and date variables to values entered by the user
 // Category has not been implemented in latest version categoryI = $('#category').val();
  cityI = $('#City').val();
  stateI = $('#state').val(); 
  dateI = $('#date').val();
  //Family = $("input[name='answer']:checked").val();
 // Family = $("input[name='answer']:checked").attr('id')
  //showFamily = document.getElementById('showFamily').checked;
  console.log("What is the value of Family? " + Family);
  //Calls function to determine value of radio button and associate variables to show Family events or 21+
  // FamilyorNot();
  

  // console log result of user entry
  console.log("Category is" + categoryI);
  console.log(' Date entered: ' + dateI);
  console.log(' City entered: ' + cityI);
  console.log(' State entered: ' + stateI);
  console.log("Show family events only is" + Family);

}
// end select query



function FamilyorNot() {
  console.log('family or not initialized');
  
  Family = $("input[name='answer']:checked").val();
  
  console.log('post jquery grab, Family value is: ' + Family);
  console.log('familyOrNot has run');
}






//function that verifies which radio button has been checked and gives values to variables assigned
//Ticketmaster has two options for family events, one is a string with yes, no or only to show Family events along with others or not at all, and only shows only Family events. other boolean when false will not show only family events

function FamilyorNot2() {
  if(document.getElementById('showFamily').checked) {
    //Family events only radio button is checked
    Family="only";
    console.log(" Only family events is checked so mark Family as " + Family);
  }
  else if(document.getElementById('over21').checked) {
    //over 21 button is checked
    
    Family="no";
    console.log("Over 21 is checked so mark it as " + Family);
    
  }
  console.log("The function FamilyorNot has run");
}


//fuction to show events list using jquery and divs for events-panel and attraction-panel
function getEvents(page) {

  $('#events-panel').show();
  $('#attraction-panel').hide();
// checks for number of pages and return values
  if (page < 0) {
    page = 0;
    return;
  }
  if (page > 0) {
    if (page > getEvents.json.page.totalPages-1) {
      page=0;
      return;
    }
  }
 
  //json created using GET and parameters with variable values. once search button is pressed the values on the variables change from assigned to user input
  $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/events.json?apikey="+TktAPIKey+"&city="+cityI+"&countryCode=US"+"&state="+stateI+"&size=4&page="+page,
   // using family parameter and date for url:"https://app.ticketmaster.com/discovery/v2/events.json?apikey="+TktAPIKey+"&city="+cityI+"&countryCode=US"+"&state="+stateI+"&dates.localdate="+dateI+"&classificationName="+categoryI+"&includeFamily="+Family+"&size=4&page="+page,
    async:true,
    dataType: "json",
    // if succesful call it creates a function for json using getEvents to show each page and showEvents to list each one
    success: function(json) {
          getEvents.json = json;
          showEvents(json);
    // console log the json object to verify data / debugging
          console.log(json);
         },
    // if there is an error for the call it logs into the console which error was received    
    error: function(xhr, status, err) {
  			  console.log(err);
  		   }
  });
}


//function to parse data to show each event
//The Discovery API for Ticketmaster has four main entities: event, attraction, classification, and venue:
function showEvents(json) {
  // create variables starting with jquery using the list-group-item from html
  var items = $('#events .list-group-item');
  items.hide();
  // creates a variable events with the object json attribute for embedded events
  var events = json._embedded.events;
  var item = items.first();
  //creates a loop to list all the events
  for (var i=0;i<events.length;i++) {
    item.children('.list-group-item-heading').text(events[i].name);
    item.children('.list-group-item-text').text(events[i].dates.start.localDate);
    try {
      item.children('.venue').text(events[i]._embedded.venues[0].name + " in " + events[i]._embedded.venues[0].city.name);
    } catch (err) {
      console.log(err);
    }
    item.show();
    item.off("click");
    item.click(events[i], function(eventObject) {
      console.log(eventObject.data);
      try {
        getAttraction(eventObject.data._embedded.attractions[0].id);
      } catch (err) {
      console.log(err);
      }
    });
    item=item.next();
  }
}
// add buttons click to show each page of the json object with events from ticketmaster

//previous allows to return to previous listed events /  items from Ticketmaster
$('#prev').click(function() { 
  getEvents(--page);
});
//next shows next list of events / items from Ticketmaster
$('#next').click(function() {
  getEvents(++page);
});

//if user clicks on any listed item, it gets the attraction id to show more details and runs showAttraction function
function getAttraction(id) {
  $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/attractions/"+id+".json?apikey="+TktAPIKey,
    async:true,
    dataType: "json",
    success: function(json) {
          showAttraction(json);
  		   },
    error: function(xhr, status, err) {
  			  console.log(err);
  		   }
  });
}

//Function that shows details of any item clicked from the list including image, the classification / category, genre and subgenre of event clicked
function showAttraction(json) {
  $('#events-panel').hide();
  $('#attraction-panel').show();
  
  $('#attraction-panel').click(function() {
    getEvents(page);
  });
  
  $('#attraction .list-group-item-heading').first().text(json.name);
  $('#attraction img').first().attr('src',json.images[0].url);
  $('#classification').text(json.classifications[0].segment.name + " - " + json.classifications[0].genre.name + " - " + json.classifications[0].subGenre.name);
  console.log(json.classifications[0].genre.name);
}


// deletes the old widget, appends a new one based on the template variable, and reruns the ticketmaster script
function reloadTicketmasterWidget() {
    // reset the widget
    $('#Ticketmaster-widget').fadeOut(400, function() {
        // creates a new template, sets id and city
        var newTemplate = $(ticketMatsterWidgetTemplate);
        newTemplate.attr('w-city', cityI, 'w-state', stateI);
        // writes new html over the existing widget
        $('#Ticketmaster-widget').html(newTemplate);
        // this will run the script from ticketmaster that converts our html
        // into the ticketmaster widget
        var s = document.createElement('script');
        s.src = 'https://ticketmaster-api-staging.github.io/products-and-docs/widgets/event-discovery/1.0.0/lib/main-widget.js';
        document.body.appendChild(s);
        $('#Ticketmaster-widget').fadeIn(400);
    })
}
// put this in after the new search, modify it
//setTimeout(() => {
 //   reloadTicketmasterWidget();
//}, 2000);

getEvents(page);
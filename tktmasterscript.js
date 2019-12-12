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

//create on click event trigged by main Search button that will check user inputs and initiate queries
searchButton.on("click", function() {
  selectQuery();
  getEvents(page);
  reloadTicketmasterWidget();
});



// check user input date and capture variables
function selectQuery() {
   
  // captures the city, state and date variables to values entered by the user
  categoryI = $('#category').val();
  cityI = $('#City').val();
  stateI = $('#state').val(); 
  dateI = $('#date').val();
  

  // console log result of user entry
  console.log("Category is" + categoryI);
  console.log(' Date entered: ' + dateI);
  console.log(' City entered: ' + cityI);
  console.log(' State entered: ' + stateI);

}
// end select query


function getEvents(page) {

  $('#events-panel').show();
  $('#attraction-panel').hide();

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
 
  //json created using GET and parameters with variable values given by user
  $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/events.json?apikey="+TktAPIKey+"&city="+cityI+"&countryCode=US"+"&state="+stateI+"&includeFamily="+Family+"&classificationName="+categoryI+"&size=4&page="+page,
    async:true,
    dataType: "json",
    success: function(json) {
          getEvents.json = json;
          showEvents(json);
          console.log(json);
  		   },
    error: function(xhr, status, err) {
  			  console.log(err);
  		   }
  });
}


//function to parse date to show each event
function showEvents(json) {
  // alert('showEvetnts')
  var items = $('#events .list-group-item');
  items.hide();
  var events = json._embedded.events;
  var item = items.first();
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

$('#prev').click(function() {
  getEvents(--page);
});

$('#next').click(function() {
  getEvents(++page);
});

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
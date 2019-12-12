var apiKey = '94dd61b974f3c56fae9c3b1562808092';
var cityID;

//Get City ID for User Search
$('#locationBtn').on('click', function(e) {
  e.preventDefault();
  var location = $('#userLocation').val();
  $('#userLocation').val('');
  var queryURL = `https://developers.zomato.com/api/v2.1/locations?query=${location}`;
  $.ajax({
    url: queryURL,
    method: 'GET',
    headers: {
      'user-key': apiKey
    }
  }).done(function(response) {
    console.log(response);
    cityID = response.location_suggestions[0].city_id;
    console.log(cityID);
    $('#location').html(response.location_suggestions[0].city_name);
    return cityID;
  });
  //Search Click function inside location function
  $('#clickMe').on('click', function(e) {
    e.preventDefault();

    var userSearch = $('#userSearch').val();
		$('#userSearch').val('');
    var queryURL = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityID}&entity_type=city&cuisines=${userSearch}&count=10&sort=rating&order=dsc`;
    //Ajax call to Zomato API
    $.ajax({
      url: queryURL,
      method: 'GET',
      headers: {
        'user-key': apiKey
      }
    }).done(function(response) {
      console.log(response);
      console.log(cityID);
      for(var i=0; i<response.restaurants.length; i++)
      $('#restaurantName').html(response.restaurants[i].restaurant.name);
      $('#type').html(response.restaurants[0].restaurant.cuisines);
      $('#address').html(response.restaurants[0].restaurant.location.address);
      $('#webpage').html(response.restaurants[0].restaurant.url);
    });
  });
});

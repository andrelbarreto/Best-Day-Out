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
    console.log(userSearch)
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
        // Empty the restaurants so the old results are gone.
      $('.restaurant-cont').empty();

      for(var i=0; i<response.restaurants.length; i++){
          var {name, cuisines, url} = response.restaurants[i].restaurant;
          var {address} = response.restaurants[i].restaurant.location;
          console.log(name, cuisines, address)
          var rtCard = $("<div>");
          console.log(rtCard);
          
          rtCard.append(`<p>Restaurant Name: ${name}</p><p>Type: ${cuisines}</p><p>Address: ${address}</p><p><a href="${url}" target=_blank>Visit Site</a>`);
          console.log(rtCard);
          $(".restaurant-cont").append(rtCard);
        //   $('#restaurantName').html(response.restaurants[i].restaurant.name);
        //   $('#type').html(response.restaurants[i].restaurant.cuisines);
        //   $('#address').html(response.restaurants[i].restaurant.location.address);
        //   $('#webpage').html(response.restaurants[i].restaurant.url);
      }
    });
  });
});

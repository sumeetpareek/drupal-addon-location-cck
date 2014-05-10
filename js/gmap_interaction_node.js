(function ($) {
	var directionsDisplay;
	var directionsService;
	var m;

	/*Get Current Location*/
	$('.node-gmap-get-my-location').live('click', function() {
		if (navigator.geolocation)  
        {  
            navigator.geolocation.getCurrentPosition(node_handle_geolocation_query, handle_errors);
            $('.node-gmap-get-direction').show();
        }  
        else  
        {  
            yqlgeo.get('visitor', normalize_yql_response);  
        }
	});
	/*Error handler*/
	function handle_errors(error)  
    	{  
        	switch(error.code)  
        	{  
            		case error.PERMISSION_DENIED: alert("User did not share geolocation data");  
	    		break;  
            		case error.POSITION_UNAVAILABLE: alert("Could not detect current position");  
            		break;  
            		case error.TIMEOUT: alert("Retrieving position timed out");  
            		break;  
            		default: alert("Unknown error");  
            		break;  
        	}  
    	}
	/*Success handler - node page*/
	function node_handle_geolocation_query(position){  
		directionsDisplay = new google.maps.DirectionsRenderer();
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        gmap_id = $('.field-type-location .field-item .gmap-map').attr('id');
        gmap_object = Drupal.gmap.getMap(gmap_id);
        m = gmap_object['map'];
    	var marker = new google.maps.Marker({
            map: m,
            position: latlng,
            title: 'My Location'
	    });
    	m.panTo(latlng);
    	directionsDisplay.setMap(m);
    	}
	/*IP address based Geolocation*/
	function normalize_yql_response(response)  
    	{  
        	if (response.error)  
        	{  
            		var error = { code : 0 };  
            		handle_error(error);  
            		return;  
        	}  
        	var position = {  
            		coords :  
            		{  
                		latitude: response.place.centroid.latitude,  
                		longitude: response.place.centroid.longitude  
            		},  
            		address :  
            		{  
                		city: response.place.locality2.content,  
                		region: response.place.admin1.content,  
                		country: response.place.country.content  
            		}	  
        	};  
        	handle_geolocation_query(position);  
    	}

	/*Get Direction*/
	$('.node-gmap-get-direction').live('click', function() {
		if (navigator.geolocation)  
        {  
            navigator.geolocation.getCurrentPosition(handle_geolocation_getdirection, handle_errors);  
        }  
        else  
        {  
            yqlgeo.get('visitor', normalize_yql_response);  
        }
	});

	/*Success handler - node page*/
	/*Rendering Dierction*/
/*	function initialize() {
	//	directionDisplay = new google.maps.DirectionsRenderer();
		//gmap_id = $('.field-type-location .field-item .gmap-map').attr('id');
		//var mapOptions = {
		  //zoom: 15,
		  //mapTypeId: google.maps.MapTypeId.ROADMAP,
	//	}
	//	m = google.maps.Map(document.getElementById(gmap_id), mapOptions);
		//directionDisplay.setMap(m);
	}*/

	/*Calling set direction on the renderer object*/
	function handle_geolocation_getdirection(position){ 
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        if (document.getElementById("location-cck-latitude")) {
          var nodelatitude = document.getElementById("location-cck-latitude").innerHTML;
        }
        if (document.getElementById("location-cck-longitude")) {
          var nodelongitude = document.getElementById("location-cck-longitude").innerHTML;
        }
        var node_latlng = new google.maps.LatLng(nodelatitude, nodelongitude);
        if (document.getElementById("edit-travel-mode")) {
        var selectedMode = document.getElementById("edit-travel-mode").value;
        }
        else {
        var selectedMode = "DRIVING";
        }
        directionsService = new google.maps.DirectionsService();
        var request = {
		    origin:latlng,
		    destination:node_latlng,
		    travelMode: google.maps.TravelMode[selectedMode]
		};
		directionsService.route(request, function(result, status) {
//		alert(JSON.stringify(status, null, 4));
			if (status == google.maps.DirectionsStatus.OK) {
		      		directionsDisplay.setDirections(result);
		      		if (document.getElementById("show_panel_case")) {
			      		directionsDisplay.setPanel(document.getElementById("directionsPanel"));
		      		}
		  	}
		});
    	}

})(jQuery);

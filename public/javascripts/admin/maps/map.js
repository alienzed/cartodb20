  var carto_map;		// Initialize map adding neccessary elements  function initMap() {    createMapElements();  }	// Show map function -> carto_map  function showMap() {    if (carto_map==null) {      carto_map = new CartoMap(new google.maps.LatLng(0,0),2);    } else {      carto_map.show();    }  }  	// Hide map function -> carto_map  function hideMap() {    carto_map.hide();  }
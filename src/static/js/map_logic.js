// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the second tile layer that will be the background of our map.
let lightMap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the third tile layer that will be the background of our map.
let darkMap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{style}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
    style: "dark-v10",
	accessToken: API_KEY
});

// Create a base layer that holds all three maps.
let baseMaps = {
  "Streets": streets,
  "Light": lightMap,
  "Dark": darkMap
};

let airbnb_full = new L.LayerGroup();
let accommodates = new L.LayerGroup();
let neighborhoods = new L.LayerGroup();
let host = new L.LayerGroup();

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [32.75, -117.15],
	zoom: 11.3,
	layers: [streets]
});

let features = {
    "By Price": airbnb_full,
    "By Guests": accommodates,
	"By Host Properties": host,
};

let Overlays = {
	"Neighborhoods": neighborhoods
}; 
// // Then we add a control to the map that will allow the user to change which
// // layers are visible.
// L.control.layers(baseMaps).addTo(map);
// L.control.layers(features, Overlays, {collapsed: false}).addTo(map);


// get neighborhood data
d3.json("https://raw.githubusercontent.com/csedatole/Airbnb-Predictions/main/src/static/resources/neighbourhoods.geojson").then(function(data) {
	L.geoJSON(data, {
		color: "#ffa812",
		fillOpacity: 0.2,
		weight: 1.5
	}).addTo(neighborhoods);
	neighborhoods.addTo(map);
});

// get rental data
d3.csv("https://raw.githubusercontent.com/csedatole/Airbnb-Predictions/main/src/static/resources/airbnb_fall_full.csv", (data) => {
	
	function priceOpacity(price) {
		if (price > 2999){
			return 1;
		}
		if (price > 1999){
			return 0.9;
		}
		if (price > 999) {
			return 0.8;
		}
		if (price > 499) {
			return  0.7;
		}
		if (price > 199) {
			return 0.6;
		}
		if (price > 99) {
			return 0.5;
		}
		return 0.4;
	}

	function priceColor(price) {
		if (price > 2999){
			return '#03045e';
		}
		if (price > 1999){
			return '#023e8a';
		}
		if (price > 999) {
			return '#0077b6';
		}
		if (price > 499) {
			return  '#0096c7';
		}
		if (price > 199) {
			return '#00b4d8';
		}
		if (price > 99) {
			return '#48cae4';
		}
		return '#90e0ef';
	}

	function priceRadius(price) {
		if (price > 0){
			return (0.5* Math.log10(price)**2);
		};
	}

	L.circleMarker([data.latitude, data.longitude],{
		radius: priceRadius(data.price),
		color: priceColor(data.price),
		fillOpacity: priceOpacity(data.price),
		weight: 1
	}).bindPopup("ID: " + "<a href=" + data.listing_url + ">" + data.id + "</a>" +
		"<br>Host: " + data.host_name + 
		"<br>Price: $" + data.price + 
		"<br>Guests: " + data.accommodates).addTo(airbnb_full);
	
	// Then we add the earthquake layer to our map.
	airbnb_full.addTo(map);

	function accColor(acc) {
		if (acc > 12){
			return "#03045e";
		}
		if (acc > 10){
			return "#023e8a";
		}
		if (acc > 8) {
			return "#0077b6";
		}
		if (acc > 6) {
			return  "#0096c7";
		}
		if (acc > 4) {
			return "#00b4d8";
		}
		if (acc > 2){
			return "#48cae4";
		}
		return "#90e0ef";
	}

	function accOpacity(acc) {
		if (acc > 12){
			return 0.9;
		}
		if (acc > 10){
			return 0.8;
		}
		if (acc > 8){
			return 0.7;
		}
		if (acc > 6){
			return 0.6;
		}
		if (acc > 4){
			return 0.5;
		}
		if (acc > 2){
			return 0.4;
		}
		return 0.3;
	}

	function accRadius(acc) {
		if (acc > 0){
			return (0.5* acc);
		};
	}

	L.circleMarker([data.latitude, data.longitude],{
		radius: accRadius(data.accommodates),
		color: accColor(data.accommodates),
		fillOpacity: accOpacity(data.accommodates),
		weight: 1
	}).bindPopup("ID: " + "<a href=" + data.listing_url + ">" + data.id + "</a>" +
		"<br>Host: " + data.host_name + 
		"<br>Price: $" + data.price + 
		"<br>Guests: " + data.accommodates).addTo(accommodates);
	
	// Then we add the earthquake layer to our map.
	accommodates.addTo(map);

	function hostColor(host) {
		if (host > 50){
			return "#03045e";
		}
		if (host> 10){
			return "#023e8a";
		}
		if (host > 4){
			return "#0077b6";
		}
		if (host > 3) {
			return "#0096c7";
		}
		if (host > 2) {
			return  "#00b4d8";
		}
		if (host > 1) {
			return "#48cae4";
		}
		return "#90e0ef";
	}

	function hostRadius(host) {
		if (host > 0){
			return 3;
		};
	}

	L.circleMarker([data.latitude, data.longitude],{
		radius: hostRadius(data.host_listings_count),
		color: hostColor(data.host_listings_count),
		fillOpacity: 0.7,
		weight: 1
	}).bindPopup("ID: " + "<a href=" + data.listing_url + ">" + data.id + "</a>" +
		"<br>Host: " + data.host_name + 
		"<br>Price: $" + data.price + 
		"<br>Guests: " + data.accommodates).addTo(host);
	
	// Then we add the earthquake layer to our map.
	host.addTo(map);
});

  	// Here we create a legend control object.
let priceLegend = L.control({
	position: "bottomright"
});
  
// Then add all the details for the legend
priceLegend.onAdd = function() {
	let div = L.DomUtil.create("div", "info legend");
 
	const prices = [0, 100, 200, 500, 1000, 2000, 3000];
	const colors = [
  		"#90e0ef",
  		"#48cae4",
  		"#00b4d8",
  		"#0096c7",
  		"#0077b6",
  		"#023e8a",
		"#03045e"
	];
 
// Looping through our intervals to generate a label with a colored square for each interval.
	div.innerHTML += "<i>Price</i><br>"
	for (var i = 0; i < prices.length; i++) {
  		div.innerHTML +=
			"<i style='background: " + colors[i] + "'></i> $" +
		prices[i] + (prices[i + 1] ? "&ndash;$" + prices[i + 1] + "<br>" : "+");
	}
	return div;
};
  
// Finally, we our legend to the map.
//priceLegend.addTo(map);

let accLegend = L.control({
	position: "bottomright"
});
  
// Then add all the details for the legend
accLegend.onAdd = function() {
	let div = L.DomUtil.create("div", "info legend");
 
	const guests = [0, 2, 4, 6, 8, 10, 12];
	const colors = [
  		"#90e0ef",
  		"#48cae4",
  		"#00b4d8",
  		"#0096c7",
  		"#0077b6",
  		"#023e8a",
		"#03045e"
	];
 
// Looping through our intervals to generate a label with a colored square for each interval.
	div.innerHTML += "<i>Guests</i><br>";
	for (var i = 0; i < guests.length; i++) {
  		console.log(colors[i]);
  		div.innerHTML +=
			"<i style='background: " + colors[i] + "'></i> " +
		guests[i] + (guests[i + 1] ? "&ndash;" + guests[i + 1] + "<br>" : "+");
	}
	return div;
};

// accLegend.addTo(map);

let hostLegend = L.control({
	position: "bottomright"
});
  
// Then add all the details for the legend
hostLegend.onAdd = function() {
	let div = L.DomUtil.create("div", "info legend");
 
	const listings = [0, 1, 2, 3, 4, 10, 50];
	const colors = [
  		"#90e0ef",
  		"#48cae4",
  		"#00b4d8",
  		"#0096c7",
  		"#0077b6",
  		"#023e8a",
		"#03045e"
	];
 
// Looping through our intervals to generate a label with a colored square for each interval.
	div.innerHTML += "<i>Listings</i><br>";
	for (var i = 0; i < listings.length; i++) {
  		console.log(colors[i]);
  		div.innerHTML +=
			"<i style='background: " + colors[i] + "'></i> " +
		listings[i] + (listings[i + 1] ? "&ndash;" + listings[i + 1] + "<br>" : "+");
	}
	return div;
};
// hostLegend.addTo(map);

// Then we add a control to the map that will allow the user to change which
// layers are visible.
L.control.layers(features, Overlays, {collapsed: false}).addTo(map);
L.control.layers(baseMaps).addTo(map);

map.on('baselayerchange', setLegend);

function setLegend(eventLayer){
	if (eventLayer.name === "By Price"){
		map.removeControl(accLegend);
		map.removeControl(hostLegend);
		priceLegend.addTo(map);
	}
	if (eventLayer.name === "By Guests"){
		map.removeControl(priceLegend);
		map.removeControl(hostLegend);
		accLegend.addTo(map);
	}
	if (eventLayer.name === "By Host Properties"){
		map.removeControl(priceLegend);
		map.removeControl(accLegend);
		hostLegend.addTo(map);
	}
}
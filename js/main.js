//Brian Robinson Geog 777 6/2017 Capstone in Geography

function createMap(){
	var map =L.map('map').setView([44.76,-90.07],7);
	
	//Create layer variables
	var cr =new L.geoJson();
	var nr =new L.geoJson().addTo(map);
	var lr =new L.geoJson();
	
	//call function to retrieve data
	getData(lr, cr, nr);
	
	L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJvYmluNjY1IiwiYSI6ImNpc2p1MXkzZzAybWgydnB1NWVvY2llOGkifQ.ufsYZx_ojLbkU4JSpgzH5g', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery   <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 10,
	minZoom:7,
    //id: 'brobin665.cb0dn68q',
    accessToken: 'pk.eyJ1IjoiYnJvYmluNjY1IiwiYSI6ImNpc2p1MXkzZzAybWgydnB1NWVvY2llOGkifQ.ufsYZx_ojLbkU4JSpgzH5g',
	}).addTo(map);
	
	//create a layer group
	var radio = {
    "Mean Nitrate Rate": nr,
    "Mean Cancer Rate": cr,
    "Cancer & Nitrate Relationship": lr
	};
	
	//add layer control to map with above layer group
	L.control.layers(radio).addTo(map); 
}

function getData(lr,cr,nr, map){
	$.ajax("data/canrate_tracts.geojson", {
        dataType: "json",
        success: function(response){
		L.geoJson(response, {style: styleCR}).bindPopup(function(layer){
			return ("<p> Cancer Occurrence Rate by Population per Census Tract: " +layer.feature.properties.canrate+" </p>");
		}).addTo(cr);
    	}
	});

	
	$.ajax("data/nitrate_tracts.geojson", {
        dataType: "json",
        success: function(response){
			L.geoJson(response,{style: styleNR}).bindPopup(function(layer){
				return ("<p><b> Interpolated Nitrate Levels by Census Tract: " + layer.feature.properties.nitrate + " </b></p>");}).addTo(nr);
			
		}
    });
	$.ajax("data/linear_regression.geojson", {
        dataType: "json",
        success: function(response){
			L.geoJson(response, {style:styleLR}).bindPopup(function(layer){
				return("<p><b> Standardized Residual: " + layer.feature.properties.StdResid + "</b></p>");}).addTo(lr);
			
        }
    });
	
}

function getColorCR(can) {
    return can > 0.9 ? '#8c2d04' :
           can > 0.7  ? '#d94801' :
           can > 0.5  ? '#f16913' :
           can > 0.3   ? '#fd8d3c' :
           can > 0.1   ? '#fdae6b' :
           can > 0   ? '#fdd0a2' :
                      '#feedde';
}

function styleCR(feature){
	return{
		fillColor: getColorCR(feature.properties.canrate),
		weight: 2,
		opacity:1,
		color: 'gray',
		fillOpacity:1
	};
}

function getColorNR(nit) {
    return nit > 15 ? '#084594' :
           nit > 12  ? '#2171b5' :
           nit > 9  ? '#4292c6' :
           nit > 6  ? '#6baed6' :
           nit > 3   ? '#9ecae1' :
           nit > 0   ? '#c6dbef' :
                      '#eff3ff';
}

function styleNR(feature){
	return{
		fillColor: getColorNR(feature.properties.nitrate),
		weight: 2,
		opacity:1,
		color: 'gray',
		fillOpacity:1
	};
}
function getColorLR(sr) {
    return sr > 6  ? '#d73027' :
           sr > 4 ? '#fc8d59' :
           sr > 2? '#fee090' :
           sr > 0   ? '#e0f3f8' :
           sr > -2  ? '#91bfdb' :
                      '#4575b';
}

function styleLR(feature){
	return{
		fillColor: getColorLR(feature.properties.StdResid),
		weight: 2,
		opacity:1,
		color: 'gray',
		fillOpacity:1
	};
}

$(document).ready(createMap);